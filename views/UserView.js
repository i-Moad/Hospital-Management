export default class UserView {
  constructor() {
    this.menuUsername = document.getElementById("username");
    this.menuEmail = document.getElementById("email");
    this.menuLogout = document.getElementById("logout");
    this.avatarUsername = document.getElementById("avatarUsername");
    this.avatarRole = document.getElementById("avatarRole");
  }

  renderCurrUserInfo(session) {
    if (!session) return;

    this.menuUsername.textContent = `${session.lastName} ${session.firstName}`;
    this.avatarUsername.textContent = `${session.lastName} ${session.firstName}`;
    this.menuEmail.textContent = session.email;
    this.avatarRole.textContent = session.role;
  }
}