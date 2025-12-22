import Auth from "../models/Auth.js";
import AuthView from "../views/AuthView.js";

export default class AuthController {
  constructor() {
    this.view = new AuthView();
    this.init();
  }

  init() {
    this.view.button?.addEventListener("click", (e) => this.handleLogin(e));
  }

  handleLogin(e) {
    e.preventDefault();
    this.view.clearErrors();

    const { email, password } = this.view.getFormData();

    if (!email) return this.view.showError(this.view.errorEmail, "Veuillez remplir l'email");
    if (!password) return this.view.showError(this.view.errorPassword, "Veuillez remplir le mot de passe");

    this.view.showSpinner();

    try {
      const success = Auth.login(email, password);
      setTimeout(() => {
        this.view.hideSpinner();
        if (success) window.location.href = "../index.html";
      }, 500);
    } catch {
      setTimeout(() => {
        this.view.hideSpinner();
        this.view.showError(this.view.errorEmail, "Email ou mot de passe incorrect");
        this.view.showError(this.view.errorPassword, "Email ou mot de passe incorrect");
      }, 500);
    }
  }
}