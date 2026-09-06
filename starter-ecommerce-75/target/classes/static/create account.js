async function onCreateAccount(event) {
  event.preventDefault();
  const form = event.currentTarget;
  form.classList.add('was-validated');
  if (!form.checkValidity()) return;
  const value = id => document.getElementById(id).value;
  const body = {
    firstName: value('name').trim(),
    lastName: value('surname').trim(),
    email: value('email').trim(),
    username: value('username').trim(),
    password: value('password'),
    role: value('role')
  };
  try { await StoreApi.request('/api/auth/register',{method:'POST',publicRequest:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); alert('Account created. Please log in.'); location.href='log in.html'; }
  catch(error){ alert(error.message); }
}
