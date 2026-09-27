async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });

  let data = {};
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data.message || 'Permintaan gagal.');
  return data;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusBadge(status) {
  const cls = status === 'Selesai' ? 'badge-done' : status === 'Diproses' ? 'badge-progress' : 'badge-wait';
  return `<span class="badge ${cls}">${escapeHtml(status)}</span>`;
}

function priorityBadge(priority) {
  const cls = priority === 'Tinggi' ? 'badge-high' : priority === 'Sedang' ? 'badge-medium' : 'badge-low';
  return `<span class="badge ${cls}">${escapeHtml(priority)}</span>`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

async function currentUser(requiredRole) {
  try {
    const data = await api('/api/auth/me');
    if (requiredRole && data.user.role !== requiredRole) {
      location.href = data.user.role === 'admin' ? '/admin.html' : '/user.html';
      return null;
    }
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = data.user.name);
    document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = data.user.email);
    return data.user;
  } catch (_) {
    location.href = '/';
    return null;
  }
}

async function logout() {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch (_) {}
  location.href = '/';
}

document.addEventListener('click', event => {
  const btn = event.target.closest('[data-logout]');
  if (btn) logout();
});
