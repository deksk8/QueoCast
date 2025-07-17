// ✅ Substitua abaixo pelo seu Client ID do Google
const CLIENT_ID = '920466326948-i8k3q86e57ajlthgpj4i8pb6ge2vesif.apps.googleusercontent.com';

// ✅ Domínio da empresa permitido
const DOMINIO_PERMITIDO = 'queonetics.com';

window.onload = () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse,
    hosted_domain: DOMINIO_PERMITIDO
  });

  google.accounts.id.renderButton(
    document.getElementById("g_id_signin"),
    { theme: "outline", size: "large" }
  );
};

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
