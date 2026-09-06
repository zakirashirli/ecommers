document.addEventListener('DOMContentLoaded', () => {
  const message = document.getElementById('empty-cart-message');
  if (message) {
    message.textContent = 'Cart functionality has not been implemented yet.';
    message.style.display = 'block';
  }
});
