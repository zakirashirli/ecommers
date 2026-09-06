async function onLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (form.getAttribute('aria-busy') === 'true') return;
  FormUI.status(form);
  if (!FormUI.validate(form)) return;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  FormUI.busy(form, true);
  try { const data=await StoreApi.request('/api/auth/login',{method:'POST',publicRequest:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})}); StoreApi.saveAuth(data); location.href='home.html'; }
  catch(error){ FormUI.status(form, error.message); }
  finally { FormUI.busy(form, false); }
}
