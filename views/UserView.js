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

    if (!this.menuUsername === "") this.menuUsername.textContent = `${session.lastName} ${session.firstName}`;
    if (!this.avatarUsername === "") this.avatarUsername.textContent = `${session.lastName} ${session.firstName}`;
    if (!this.menuEmail === "") this.menuEmail.textContent = session.email;
    if (!this.avatarRole === "") this.avatarRole.textContent = session.role;
  }
}