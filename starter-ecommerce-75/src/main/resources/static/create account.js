async function onCreateAccount(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.getAttribute('aria-busy') === 'true') return;
  FormUI.status(form);
  if (!FormUI.validate(form)) return;
  const value = id => document.getElementById(id).value;
  const body = {
    firstName: value('name').trim(),
    lastName: value('surname').trim(),
    email: value('email').trim(),
    username: value('username').trim(),
    password: value('password'),
    role: value('role')
  };
  FormUI.busy(form, true);
  try { await StoreApi.request('/api/auth/register',{method:'POST',publicRequest:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); FormUI.status(form, 'Account created. Opening login...', true); location.href='log in.html'; }
  catch(error){ FormUI.status(form, error.message); }
  finally { FormUI.busy(form, false); }
}
