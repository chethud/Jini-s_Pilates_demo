(() => {
  const form = document.getElementById("login-form");
  const error = document.getElementById("login-error");

  // Already signed in → go straight to dashboard
  if (window.JinisCMS.isAuthed()) {
    location.replace("/cms/dashboard.html");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const id = document.getElementById("login-id").value;
    const password = document.getElementById("login-password").value;

    if (!window.JinisCMS.checkCredentials(id, password)) {
      error.hidden = false;
      error.textContent = "Invalid ID or password.";
      return;
    }

    window.JinisCMS.setAuthed(true, id);
    location.replace("/cms/dashboard.html");
  });
})();
