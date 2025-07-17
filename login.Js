const DOMINIO_PERMITIDO = 'queonetics.com';

function handleCredentialResponse(response) {
  const jwt = parseJwt(response.credential);
  const email = jwt.email;
  const domain = email.split('@')[1];

  if (domain === DOMINIO_PERMITIDO) {
    localStorage.setItem("userEmail", email);
    window.location.href = "index.html";
  } else {
    alert("Apenas contas @" + DOMINIO_PERMITIDO + " são permitidas.");
  }
}

function parseJwt(token) {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}
