import Auth from "../models/Auth.js";
import AuthView from "../views/AuthView.js";
import Storage from "../models/Storage.js";

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
        if (success) {
          const session = Storage.load("Session");
          console.log(session)
          if (session.role === "admin") {
            window.location.href = "../Dashboards/Admin/index.html"
            return;
          }
          if (session.role === "doctor") {
            window.location.href = "../Dashboards/Doctor/index.html"
            return;
          }
          if (session.role === "staff") {
            window.location.href = "../Dashboards/Staff/index.html"
            return;
          }
        };
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