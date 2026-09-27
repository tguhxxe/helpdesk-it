const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alertBox');

(async () => {
  try {
    const data = await api('/api/auth/me');
    location.href = data.user.role === 'admin' ? '/admin.html' : '/user.html';
  } catch (_) {}
})();

form.addEventListener('submit', async event => {
  event.preventDefault();
  alertBox.className = 'hidden';
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Memproses...';

  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.email.value.trim(),
        password: form.password.value,
      }),
    });
    location.href = data.redirect;
  } catch (error) {
    alertBox.textContent = error.message;
    alertBox.className = 'alert alert-error';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Masuk ke Helpdesk';
  }
});
