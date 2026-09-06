document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.getAttribute('aria-busy') === 'true') return;
    FormUI.status(form);
    if (!FormUI.validate(form)) return;
    const value = id => document.getElementById(id).value.trim();
    const body = { name: value('contactName'), email: value('contactEmail'), phone: value('contactPhone'), message: value('contactMessage') };
    FormUI.busy(form, true);
    try {
      await StoreApi.request('/api/contact', { method: 'POST', publicRequest: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      form.reset();
      form.classList.remove('was-validated');
      FormUI.status(form, 'Your message has been sent. Thank you for getting in touch!', true);
    } catch (error) {
      FormUI.status(form, error.message);
    } finally {
      FormUI.busy(form, false);
    }
  });
});
