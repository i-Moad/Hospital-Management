import User from "../models/User.js";
import UserView from "../views/UserView.js";
import Auth from "../models/Auth.js";
import Storage from "../models/Storage.js";

export default class UserController {
  constructor() {
    this.view = new UserView();
    this.init();
  }

  init() {
    this.view.renderCurrUserInfo(Storage.load("Session"));
    this.view.menuLogout?.addEventListener("click", (e) => this.handleLogout(e));
  }

  handleLogout(e) {
    e.preventDefault();
    Auth.logout();
    window.location.href = "/src/auth/login.html";
  }
}