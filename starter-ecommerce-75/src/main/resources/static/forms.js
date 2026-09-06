const FormUI = {
  validate(form, focus = true) {
    for (const field of form.querySelectorAll('input, textarea, select')) {
      field.setCustomValidity('');
      if (['text', 'email', 'tel', 'textarea'].includes(field.type) && focus) field.value = field.value.trim();
      if (field.required && !field.value.trim()) field.setCustomValidity('Please fill out this field.');
      if (field.value && field.minLength > 0 && field.value.trim().length < field.minLength && field.type !== 'password') field.setCustomValidity('Use at least ' + field.minLength + ' characters.');
      if (field.id === 'confirmPassword' && field.value !== form.querySelector('#password').value) field.setCustomValidity('Passwords must match.');
      field.setAttribute('aria-invalid', String(!field.validity.valid));
    }
    form.classList.add('was-validated');
    const valid = form.checkValidity();
    if (!valid && focus) form.querySelector(':invalid').focus();
    return valid;
  },
  status(form, message = '', success = false) {
    let status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('div');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.append(status);
    }
    status.className = 'form-status alert alert-' + (success ? 'success' : 'danger');
    status.textContent = message;
    status.hidden = !message;
  },
  busy(form, busy) {
    const button = form.querySelector('[type="submit"]');
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.disabled = busy;
    button.textContent = busy ? 'Please wait...' : button.dataset.label;
    form.setAttribute('aria-busy', String(busy));
  }
};
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('input', () => {
      if (form.classList.contains('was-validated')) FormUI.validate(form, false);
    });
  });
});
