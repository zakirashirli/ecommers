const StoreApi = {
  token() { return localStorage.getItem('authToken'); },
  user() { try { return JSON.parse(localStorage.getItem('currentUser')); } catch (_) { return null; } },
  saveAuth(data) { localStorage.setItem('authToken', data.token); localStorage.setItem('currentUser', JSON.stringify(data.user)); },
  logout() { localStorage.removeItem('authToken'); localStorage.removeItem('currentUser'); },
  async request(path, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (this.token()) headers.Authorization = `Bearer ${this.token()}`;
    const response = await fetch(path, { ...options, headers });
    if (response.status === 401 && !options.publicRequest) this.logout();
    if (!response.ok) {
      const messages = {
        401: 'Your session has expired. Please log in again.',
        403: 'Access denied. Please log in with an account allowed to perform this action.',
        404: 'The requested item could not be found.'
      };
      let message = messages[response.status] || 'Request failed (HTTP ' + response.status + '). Please try again.';
      const text = await response.text();
      try {
        const body = JSON.parse(text);
        if (typeof body.message === 'string' && body.message.trim()) message = body.message;
      } catch (_) {
        if (text && !text.trim().startsWith('<')) message = text;
      }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    const type = response.headers.get('content-type') || '';
    return type.includes('application/json') ? response.json() : response.text();
  },
  products(params = '') { return this.request(`/api/products${params}`, { publicRequest: true }); },
  product(id) { return this.request(`/api/products/${id}`, { publicRequest: true }); },
  async upload(file) { const body = new FormData(); body.append('file', file); return this.request('/api/uploads/images', { method: 'POST', body }); }
};

document.addEventListener('DOMContentLoaded', () => {
  const user = StoreApi.user();
  document.querySelectorAll('nav a[href="create account.html"]').forEach(link => {
    const navItem = link.closest('.nav-item');
    (navItem || link).style.display = user ? 'none' : '';
  });
  document.querySelectorAll('#usernameDisplay').forEach(el => el.textContent = user ? user.username : '');
  document.querySelectorAll('#loginBtn').forEach(el => el.style.display = user ? 'none' : 'inline-block');
  document.querySelectorAll('#logoutBtn').forEach(el => {
    el.style.display = user ? 'inline-block' : 'none';
    el.onclick = event => { event.preventDefault(); StoreApi.logout(); window.location.href = 'home.html'; };
  });
});
