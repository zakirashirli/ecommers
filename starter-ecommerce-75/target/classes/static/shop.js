document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('productList');

  try {
    const products = (await StoreApi.products('?size=100')).content;
    if (!products.length) {
      list.innerHTML = '<p class="text-muted">No products have been added yet.</p>';
      return;
    }

    products.forEach(product => {
      const column = document.createElement('div');
      column.className = 'col-md-3 mb-4';
      column.innerHTML = `
        <div class="card text-center h-100">
          <img src="${product.imageUrl}" class="card-img-top" style="height:150px;object-fit:contain">
          <div class="card-body">
            <h6>${product.brand} ${product.model}</h6>
            <p>${product.category}</p>
            <p class="text-danger">$${product.price.toFixed(2)}</p>
            <div>${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</div>
            <a class="btn btn-outline-dark btn-sm mt-2" href="product.html?id=${product.id}">Details</a>
          </div>
        </div>`;
      list.appendChild(column);
    });
  } catch (error) {
    list.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
});
