let selectedId = null;
let tickets = [];

const ticketBody = document.getElementById('ticketBody');
const detailPanel = document.getElementById('detailPanel');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const replyForm = document.getElementById('replyForm');

(async function init() {
  const user = await currentUser('admin');
  if (!user) return;
  await Promise.all([loadStats(), loadTickets()]);
})();

async function loadStats() {
  const data = await api('/api/admin/stats');
  document.getElementById('statTotal').textContent = data.stats.total;
  document.getElementById('statWait').textContent = data.stats.menunggu;
  document.getElementById('statProgress').textContent = data.stats.diproses;
  document.getElementById('statDone').textContent = data.stats.selesai;
}

async function loadTickets() {
  const params = new URLSearchParams();
  if (statusFilter.value) params.set('status', statusFilter.value);
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  const data = await api(`/api/admin/tickets?${params}`);
  tickets = data.tickets;
  renderTickets();
}

function renderTickets() {
  if (!tickets.length) {
    ticketBody.innerHTML = '<tr><td colspan="7" class="empty">Tidak ada tiket yang sesuai filter.</td></tr>';
    return;
  }
  ticketBody.innerHTML = tickets.map(t => `
    <tr>
      <td><span class="ticket-code">${escapeHtml(t.ticket_code)}</span><br><small>${formatDate(t.created_at)}</small></td>
      <td><strong>${escapeHtml(t.user_name)}</strong><br><small>${escapeHtml(t.user_email)}</small></td>
      <td><strong>${escapeHtml(t.subject)}</strong><br><small>${escapeHtml(t.category)}</small></td>
      <td>${priorityBadge(t.priority)}</td>
      <td>${statusBadge(t.status)}</td>
      <td>${t.reply_count}</td>
      <td><button class="icon-btn" onclick="openTicket(${t.id})">Tangani</button></td>
    </tr>
  `).join('');
}

async function openTicket(id) {
  selectedId = id;
  const data = await api(`/api/tickets/${id}`);
  const t = data.ticket;
  detailPanel.innerHTML = `
    <h3 class="detail-title">${escapeHtml(t.subject)}</h3>
    <div class="detail-meta">
      <span>${escapeHtml(t.ticket_code)}</span><span>${formatDate(t.created_at)}</span><span>${escapeHtml(t.user_name)} · ${escapeHtml(t.user_email)}</span>
    </div>
    <div class="detail-block">
      <label for="statusSelect">Status Penanganan</label>
      <div class="toolbar" style="margin-top:8px">
        <select id="statusSelect" style="max-width:220px">
          ${['Menunggu','Diproses','Selesai'].map(s => `<option value="${s}" ${s === t.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-primary" onclick="saveStatus()">Simpan Status</button>
        ${priorityBadge(t.priority)}
      </div>
    </div>
    <div class="detail-block"><h4>Deskripsi Masalah</h4><div>${escapeHtml(t.description).replaceAll('\n','<br>')}</div></div>
    ${t.attachment_path ? `<div class="detail-block"><h4>Lampiran User</h4><a class="btn btn-light" href="${encodeURI(t.attachment_path)}" target="_blank">Buka Lampiran</a></div>` : ''}
    <div class="detail-block">
      <h4>Riwayat Tanggapan</h4>
      <div class="reply-list">
        ${data.replies.length ? data.replies.map(r => `
          <div class="reply ${r.role === 'admin' ? 'admin' : ''}">
            <div class="reply-head"><strong>${escapeHtml(r.name)} · ${r.role === 'admin' ? 'IT Support' : 'User'}</strong><span>${formatDate(r.created_at)}</span></div>
            <div>${escapeHtml(r.message).replaceAll('\n','<br>')}</div>
          </div>
        `).join('') : '<div class="empty" style="padding:18px">Belum ada tanggapan.</div>'}
      </div>
    </div>
  `;
  replyForm.classList.remove('hidden');
  document.getElementById('replyMessage').value = '';
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveStatus() {
  if (!selectedId) return;
  const status = document.getElementById('statusSelect').value;
  await api(`/api/admin/tickets/${selectedId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  await Promise.all([loadStats(), loadTickets(), openTicket(selectedId)]);
}

replyForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedId) return;
  const message = document.getElementById('replyMessage').value.trim();
  if (!message) return;
  await api(`/api/tickets/${selectedId}/replies`, { method: 'POST', body: JSON.stringify({ message }) });
  await Promise.all([openTicket(selectedId), loadTickets()]);
});

statusFilter.addEventListener('change', loadTickets);
let timer;
searchInput.addEventListener('input', () => {
  clearTimeout(timer);
  timer = setTimeout(loadTickets, 300);
});

window.openTicket = openTicket;
window.saveStatus = saveStatus;
