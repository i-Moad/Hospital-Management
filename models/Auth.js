import Storage from "./Storage.js";

export default class Auth {
  static USERS_KEY = "Users";
  static SESSION_KEY = "Session";

  static register(user) {
    if (!user || typeof user !== "object") {
      throw new Error("Invalid user data");
    }

    const users = Storage.load(this.USERS_KEY) || [];

    // prevent duplicate CIN
    const exists = users.some(u => u.CIN === user.CIN);
    if (exists) {
      throw new Error("User already exists");
    }

    Storage.addItem(this.USERS_KEY, user);
    return true;
  }

  static login(email, password) {
    const users = Storage.load(this.USERS_KEY) || [];
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("CIN or password is incorrect");
    }

    // save session
    const sessionUser = {
      CIN: user.CIN,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
    return true;
  }

  static logout() {
    localStorage.removeItem(this.SESSION_KEY);
    return true;
  }

  // Check if user is logged in
  static isAuthenticated() {
    return localStorage.getItem(this.SESSION_KEY) !== null;
  }

  // Get current user
  static currentUser() {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
}