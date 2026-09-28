// Integration checks against a dedicated production server and temporary records.
require('dotenv').config({ quiet: true });
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const pool = require('../src/db');

async function main() {
  const port = 3107;
  const base = `http://127.0.0.1:${port}`;
  const token = `submission-${Date.now()}`;
  const ids = [];
  const files = [];
  let server;
  const results = [];
  const check = (name, fn) => Promise.resolve().then(fn).then(() => {
    results.push(name);
    console.log(`PASS ${name}`);
  });
  async function request(url, { cookie, json, ...options } = {}) {
    const headers = { ...options.headers };
    if (cookie) headers.Cookie = cookie;
    if (json) headers['Content-Type'] = 'application/json';
    const response = await fetch(base + url, {
      ...options, headers, redirect: 'manual', body: json ? JSON.stringify(json) : options.body,
    });
    const data = await response.json().catch(() => null);
    return { response, data };
  }
  try {
    // Refuse to use an unrelated server already listening on the test port.
    const net = require('node:net');
    await new Promise((resolve, reject) => {
      const probe = net.createServer();
      probe.once('error', reject);
      probe.listen(port, '127.0.0.1', () => probe.close(resolve));
    });
    const hash = await bcrypt.hash(token, 10);
    for (const [suffix, role] of [['owner', 'user'], ['other', 'user'], ['admin', 'admin']]) {
      const r = await pool.query(
        'INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,email',
        [token, `${token}-${suffix}@example.test`, hash, role],
      );
      ids.push(r.rows[0]);
    }
    server = spawn(process.execPath, ['src/server.js'], {
      cwd: path.resolve(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: 'ignore',
    });
    let ready = false;
    for (let i = 0; i < 80; i++) {
      if (server.exitCode !== null) throw new Error('Test server exited before readiness.');
      try {
        const r = await request('/api/health');
        if (r.response.status === 200) { ready = true; break; }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    assert.ok(ready, 'Test server and database must become ready');
    await check('Halaman publik dan login tersedia', async () => {
      for (const url of ['/', '/login']) assert.equal((await fetch(base + url)).status, 200);
    });
    await check('Dashboard tanpa sesi dialihkan ke login', async () => {
      for (const url of ['/user', '/admin']) {
        const { response } = await request(url);
        assert.equal(response.status, 302); assert.equal(response.headers.get('location'), '/login');
      }
    });
    await check('API tiket tanpa sesi ditolak', async () => assert.equal((await request('/api/tickets/my')).response.status, 401));
    await check('Login kosong dan password salah ditolak', async () => {
      assert.equal((await request('/api/auth/login', { method:'POST', json:{} })).response.status,400);
      assert.equal((await request('/api/auth/login', { method:'POST', json:{email:ids[0].email,password:'wrong'} })).response.status,401);
    });
    const cookies = [];
    await check('Login user dan admin sesuai peran', async () => {
      for (let i=0;i<ids.length;i++) {
        const r=await request('/api/auth/login',{method:'POST',json:{email:ids[i].email,password:token}});
        assert.equal(r.response.status,200); assert.equal(r.data.redirect,i===2?'/admin':'/user');
        cookies.push(r.response.headers.get('set-cookie').split(';')[0]);
      }
    });
    const [owner,other,admin]=cookies;
    await check('User tidak dapat mengakses API admin',async()=>assert.equal((await request('/api/admin/tickets',{cookie:owner})).response.status,403));
    const valid={category:'Jaringan',subject:token,description:'Skenario pemeriksaan pengumpulan',priority:'Tinggi'};
    await check('Validasi kolom wajib dan prioritas',async()=>{
      assert.equal((await request('/api/tickets',{cookie:owner,method:'POST',json:{}})).response.status,400);
      assert.equal((await request('/api/tickets',{cookie:owner,method:'POST',json:{...valid,priority:'Invalid'}})).response.status,400);
    });
    let ticket;
    await check('Tiket baru tersimpan dengan status Menunggu',async()=>{
      const r=await request('/api/tickets',{cookie:owner,method:'POST',json:valid});
      assert.equal(r.response.status,201); assert.equal(r.data.ticket.status,'Menunggu'); ticket=r.data.ticket;
    });
    await check('Admin tidak dapat membuat tiket user',async()=>assert.equal((await request('/api/tickets',{cookie:admin,method:'POST',json:valid})).response.status,403));
    await check('Daftar pribadi dan pembatasan kepemilikan tiket',async()=>{
      const mine=await request('/api/tickets/my',{cookie:owner}); assert.ok(mine.data.tickets.some(t=>t.id===ticket.id));
      const theirs=await request('/api/tickets/my',{cookie:other}); assert.equal(theirs.data.tickets.length,0);
      assert.equal((await request(`/api/tickets/${ticket.id}`,{cookie:other})).response.status,403);
      assert.equal((await request(`/api/tickets/${ticket.id}/replies`,{cookie:other,method:'POST',json:{message:'test'}})).response.status,403);
    });
    await check('Tanggapan user dan admin tersimpan berurutan',async()=>{
      for(const [cookie,message] of [[owner,'Tambahan informasi'],[admin,'Solusi dari IT']]) {
        assert.equal((await request(`/api/tickets/${ticket.id}/replies`,{cookie,method:'POST',json:{message}})).response.status,201);
      }
      const r=await request(`/api/tickets/${ticket.id}`,{cookie:owner});
      assert.deepEqual(r.data.replies.map(r=>r.message),['Tambahan informasi','Solusi dari IT']);
      assert.equal((await request(`/api/tickets/${ticket.id}/replies`,{cookie:owner,method:'POST',json:{message:' '}})).response.status,400);
    });
    await check('Filter dan pencarian tiket admin',async()=>{
      const r=await request(`/api/admin/tickets?status=Menunggu&search=${token}`,{cookie:admin});
      assert.equal(r.data.tickets.length,1); assert.equal(r.data.tickets[0].id,ticket.id);
    });
    await check('Perubahan status dan penolakan status tidak valid',async()=>{
      for(const status of ['Diproses','Selesai']){
        const r=await request(`/api/admin/tickets/${ticket.id}/status`,{cookie:admin,method:'PATCH',json:{status}});
        assert.equal(r.response.status,200); assert.equal(r.data.ticket.status,status);
      }
      assert.equal((await request(`/api/admin/tickets/${ticket.id}/status`,{cookie:admin,method:'PATCH',json:{status:'Invalid'}})).response.status,400);
    });
    await check('Statistik admin konsisten dengan jumlah status',async()=>{
      const r=await request('/api/admin/stats',{cookie:admin}); const s=r.data.stats;
      assert.equal(s.total,s.menunggu+s.diproses+s.selesai);
    });
    await check('Lampiran PDF dapat dibuat dan dibaca',async()=>{
      const f=new FormData(); for(const [k,v] of Object.entries(valid))f.set(k,v);
      f.set('attachment',new Blob(['%PDF-1.4\n%%EOF'],{type:'application/pdf'}),'uji.pdf');
      const r=await request('/api/tickets',{cookie:owner,method:'POST',body:f});
      assert.equal(r.response.status,201); files.push(path.basename(r.data.ticket.attachment_path));
      assert.equal((await fetch(base+r.data.ticket.attachment_path,{headers:{Cookie:owner}})).status,200);
    });
    await check('Jenis lampiran terlarang dan ukuran di atas 5 MB ditolak',async()=>{
      for(const [type,size,status] of [['text/plain',10,400],['application/pdf',5*1024*1024+1,400]]){
        const f=new FormData(); for(const [k,v] of Object.entries(valid))f.set(k,v);
        f.set('attachment',new Blob([new Uint8Array(size)],{type}),'uji.bin');
        assert.equal((await request('/api/tickets',{cookie:owner,method:'POST',body:f})).response.status,status);
      }
    });
    await check('Logout mengakhiri sesi',async()=>{
      assert.equal((await request('/api/auth/logout',{cookie:owner,method:'POST'})).response.status,200);
      assert.equal((await request('/api/auth/me',{cookie:owner})).response.status,401);
    });
    console.log(`SUCCESS ${results.length} kelompok pemeriksaan lulus.`);
  } finally {
    if(server){server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve));}
    for(const file of files)await fs.unlink(path.resolve(__dirname,'../uploads',file)).catch(()=>{});
    if(ids.length)await pool.query('DELETE FROM users WHERE id = ANY($1::bigint[])',[ids.map(u=>u.id)]);
    await pool.end();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
