let tickets = [];
let selectedId = null;

const ticketBody = document.getElementById('ticketBody');
const detailPanel = document.getElementById('detailPanel');
const createForm = document.getElementById('createTicketForm');
const createAlert = document.getElementById('createAlert');
const replyForm = document.getElementById('replyForm');

(async function init() {
  const user = await currentUser('user');
  if (!user) return;
  await loadTickets();
})();

async function loadTickets() {
  const data = await api('/api/tickets/my');
  tickets = data.tickets;
  renderStats();
  renderTickets();
  if (selectedId) await openTicket(selectedId);
}

function renderStats() {
  const total = tickets.length;
  const wait = tickets.filter(t => t.status === 'Menunggu').length;
  const progress = tickets.filter(t => t.status === 'Diproses').length;
  const done = tickets.filter(t => t.status === 'Selesai').length;
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statWait').textContent = wait;
  document.getElementById('statProgress').textContent = progress;
  document.getElementById('statDone').textContent = done;
}

function renderTickets() {
  if (!tickets.length) {
    ticketBody.innerHTML = '<tr><td colspan="6" class="empty">Belum ada tiket. Buat tiket pertama Anda melalui formulir di atas.</td></tr>';
    return;
  }
  ticketBody.innerHTML = tickets.map(t => `
    <tr>
      <td><span class="ticket-code">${escapeHtml(t.ticket_code)}</span><br><small>${formatDate(t.created_at)}</small></td>
      <td><strong>${escapeHtml(t.subject)}</strong><br><small>${escapeHtml(t.category)}</small></td>
      <td>${priorityBadge(t.priority)}</td>
      <td>${statusBadge(t.status)}</td>
      <td>${t.reply_count}</td>
      <td><button class="icon-btn" onclick="openTicket(${t.id})">Detail</button></td>
    </tr>
  `).join('');
}

createForm.addEventListener('submit', async event => {
  event.preventDefault();
  createAlert.className = 'hidden';
  const submit = createForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Mengirim...';
  try {
    const data = await api('/api/tickets', { method: 'POST', body: new FormData(createForm) });
    createAlert.textContent = `${data.message} Nomor tiket: ${data.ticket.ticket_code}`;
    createAlert.className = 'alert alert-success';
    createForm.reset();
    await loadTickets();
  } catch (error) {
    createAlert.textContent = error.message;
    createAlert.className = 'alert alert-error';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Kirim Tiket';
  }
});

async function openTicket(id) {
  selectedId = id;
  const data = await api(`/api/tickets/${id}`);
  const t = data.ticket;
  detailPanel.innerHTML = `
    <h3 class="detail-title">${escapeHtml(t.subject)}</h3>
    <div class="detail-meta">
      <span>${escapeHtml(t.ticket_code)}</span><span>${formatDate(t.created_at)}</span><span>${escapeHtml(t.category)}</span>
    </div>
    <div class="toolbar">${statusBadge(t.status)} ${priorityBadge(t.priority)}</div>
    <div class="detail-block"><h4>Deskripsi Masalah</h4><div>${escapeHtml(t.description).replaceAll('\n','<br>')}</div></div>
    ${t.attachment_path ? `<div class="detail-block"><h4>Lampiran</h4><a class="btn btn-light" href="${encodeURI(t.attachment_path)}" target="_blank">Buka Lampiran</a></div>` : ''}
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

replyForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedId) return;
  const message = document.getElementById('replyMessage').value.trim();
  if (!message) return;
  await api(`/api/tickets/${selectedId}/replies`, { method: 'POST', body: JSON.stringify({ message }) });
  await openTicket(selectedId);
  await loadTickets();
});

window.openTicket = openTicket;
