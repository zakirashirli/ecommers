const ShopCatalog = {
  category(value) { return (value || '').trim().toLocaleLowerCase(); },
  select(products, category, search, sort) {
    const query = search.trim().toLocaleLowerCase();
    const comparators = {
      newest: (a, b) => b.id - a.id,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      name: (a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
    };
    return products.filter(product =>
      (!category || this.category(product.category) === category) &&
      `${product.brand} ${product.model} ${product.category}`.toLocaleLowerCase().includes(query)
    ).sort((a, b) => (comparators[sort] || comparators.newest)(a, b) || b.id - a.id);
  },
  async load(fetchPage) {
    const products = [];
    let page = 0;
    let result;
    do {
      result = await fetchPage(`?page=${page}&size=100`);
      products.push(...result.content);
      page++;
    } while (page < result.totalPages);
    return products;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('productList');
  const category = document.getElementById('categoryFilter');
  const sort = document.getElementById('sortOrder');
  const search = document.getElementById('searchInput');
  const reset = document.getElementById('resetFilters');
  const count = document.getElementById('resultsCount');
  let products = [];

  function render() {
    const visible = ShopCatalog.select(products, category.value, search.value, sort.value);
    count.textContent = `${visible.length} of ${products.length} products`;
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state text-secondary';
      empty.textContent = products.length ? 'No matching products. Try another category or clear your search.' : 'No products have been added yet.';
      list.append(empty);
      return;
    }
    for (const product of visible) {
      const column = document.createElement('div');
      column.className = 'col-sm-6 col-lg-3 mb-4';
      column.innerHTML = '<div class="card text-center h-100"><img class="card-img-top" loading="lazy"><div class="card-body"><h2 class="h6"></h2><p class="text-secondary product-category"></p><p class="text-danger fw-semibold product-price"></p><p class="product-rating"></p><a class="btn btn-outline-dark btn-sm">Details</a></div></div>';
      const name = `${product.brand} ${product.model}`;
      const img = column.querySelector('img');
      img.src = product.imageUrl;
      img.alt = name;
      column.querySelector('h2').textContent = name;
      column.querySelector('.product-category').textContent = product.category;
      column.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
      const rating = column.querySelector('.product-rating');
      rating.textContent = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
      rating.setAttribute('aria-label', `${product.rating} out of 5 stars`);
      const link = column.querySelector('a');
      link.href = `product.html?id=${encodeURIComponent(product.id)}`;
      link.setAttribute('aria-label', `View ${name}`);
      list.append(column);
    }
  }

  category.addEventListener('change', render);
  sort.addEventListener('change', render);
  search.addEventListener('input', render);
  reset.addEventListener('click', () => {
    category.value = '';
    sort.value = 'newest';
    search.value = '';
    render();
  });

  search.disabled = true;
  try {
    products = await ShopCatalog.load(params => StoreApi.products(params));
    const categories = new Map();
    for (const product of products) {
      const key = ShopCatalog.category(product.category);
      if (key && !categories.has(key)) categories.set(key, product.category.trim());
    }
    for (const [key, label] of [...categories].sort((a, b) => a[1].localeCompare(b[1]))) {
      category.add(new Option(label, key));
    }
    for (const control of [category, sort, search, reset]) control.disabled = false;
    render();
  } catch (error) {
    count.textContent = 'Products could not be loaded. Please refresh to try again.';
    const message = document.createElement('p');
    message.className = 'text-danger';
    message.textContent = error.message;
    list.replaceChildren(message);
  }
});
