export default class AuthView {
  constructor() {
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.errorEmail = document.getElementById("errorEmail");
    this.errorPassword = document.getElementById("errorPassword");
    this.button = document.getElementById("connexion");
  }

  showError(element, message) {
    element.innerHTML = `<div class="text-red-600">${message}</div>`;
  }

  showSpinner() {
    this.button.disabled = true;
    this.button.innerHTML = `
      Connexion en cours
      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block ml-2"></div>
    `;
  }

  hideSpinner() {
    this.button.disabled = false;
    this.button.innerHTML = "Connexion";
  }

  getFormData() {
    return {
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value.trim()
    };
  }

  clearErrors() {
    this.errorEmail.innerHTML = "";
    this.errorPassword.innerHTML = "";
  }
}