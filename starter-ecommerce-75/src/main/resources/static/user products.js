document.addEventListener('DOMContentLoaded', async () => {
  const table = document.getElementById('productTableBody');
  const empty = document.getElementById('noProductsMessage');
  const status = document.getElementById('productsStatus');
  const signIn = document.getElementById('signInLink');
  const add = document.getElementById('addProductLink');
  function showError(error) {
    status.hidden = false;
    status.className = 'alert alert-danger';
    status.textContent = error.message;
  }
  function requireLogin() {
    StoreApi.logout();
    showError(new Error('Your session is no longer valid. Please log in again to view your products.'));
    signIn.hidden = false;
    add.hidden = true;
    document.querySelectorAll('#usernameDisplay').forEach(el => el.textContent = '');
    document.querySelectorAll('#logoutBtn').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#loginBtn').forEach(el => el.style.display = 'inline-block');
  }
  if (!StoreApi.token()) { requireLogin(); return; }
  let user;
  try {
    user = await StoreApi.request('/api/auth/me');
  } catch (error) {
    if ([401, 403].includes(error.status)) requireLogin();
    else showError(error);
    return;
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  if (user.role !== 'SELLER') {
    showError(new Error('A seller account is required to manage products. Please log in with your seller account.'));
    signIn.hidden = false;
    return;
  }
  add.hidden = false;
  status.textContent = 'Loading your products...';
  try {
    const products = await StoreApi.request('/api/products/my');
    status.hidden = true;
    empty.style.display = products.length ? 'none' : 'block';
    for (const product of products) {
      const row = document.createElement('tr');
      row.innerHTML = '<td></td><td></td><td><img style="height:60px;max-width:100px;object-fit:contain"></td><td></td><td></td><td><button class="btn btn-outline-dark btn-sm edit">Edit</button> <button class="btn btn-danger btn-sm del">Delete</button></td>';
      row.cells[0].textContent = product.brand + ' ' + product.model;
      row.cells[1].textContent = product.category;
      const image = row.querySelector('img');
      image.src = product.imageUrl;
      image.alt = product.brand + ' ' + product.model;
      row.cells[3].textContent = '$' + product.price.toFixed(2);
      row.cells[4].textContent = product.rating + ' / 5';
      row.querySelector('.edit').onclick = () => location.href = 'edit product.html?id=' + encodeURIComponent(product.id);
      const remove = row.querySelector('.del');
      remove.onclick = async () => {
        if (!confirm('Delete this product?')) return;
        remove.disabled = true;
        try {
          await StoreApi.request('/api/products/' + product.id, { method: 'DELETE' });
          row.remove();
          empty.style.display = table.children.length ? 'none' : 'block';
          status.hidden = true;
        } catch (error) {
          showError(error);
          if (error.status === 401) requireLogin();
        } finally { remove.disabled = false; }
      };
      table.append(row);
    }
  } catch (error) {
    showError(error);
    if (error.status === 401) requireLogin();
  }
});
