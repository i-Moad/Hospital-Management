import Storage from "./Storage.js";

export default class User {
  static USERS_KEY = "Users";

  constructor({
    CIN,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    emergencyContact,
    role = "patient",
    createdAt = new Date().toISOString(),
  }) {
    this.userId = crypto.randomUUID();
    this.CIN = CIN;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.role = role;
    this.createdAt = createdAt;
  }

  createUser() {
    const users = Storage.load(User.USERS_KEY) || [];

    const exists = users.some(
      u => u.CIN === this.CIN || u.email === this.email
    );
    if (exists) {
      throw new Error("User already exists");
    }
    Storage.addItem(User.USERS_KEY, this);
    return this;
  }

  static getUserById(userId) {
    const users = Storage.load(User.USERS_KEY) || [];
    return users.find(u => u.userId === userId) || null;
  }

  static getUserByCIN(CIN) {
    const users = Storage.load(User.USERS_KEY) || [];
    return users.find(u => u.CIN === CIN) || null;
  }

  static getAllUsers(filterByRole = null) {
    const users = Storage.load(User.USERS_KEY) || [];
    if (!filterByRole) return users;
    return users.filter(u => u.role === filterByRole);
  }

  static updateUserInfo(userId, updates) {
    const allowedUpdates = {};

    if ("phoneNumber" in updates) allowedUpdates.phoneNumber = updates.phoneNumber;
    if ("address" in updates) allowedUpdates.address = updates.address;
    if ("email" in updates) allowedUpdates.email = updates.email;
    if ("emergencyContact" in updates)
      allowedUpdates.emergencyContact = updates.emergencyContact;

    const success = Storage.updateItem(
      this.USERS_KEY,
      "userId",
      userId,
      allowedUpdates
    );

    if (!success) {
      throw new Error("User not found");
    }

    return this.getUserById(userId);
  }

  static deleteUser(userId) {
    const success = Storage.removeItem(
      this.USERS_KEY,
      "userId",
      userId
    );

    if (!success) {
      throw new Error("User not found");
    }

    return true;
  }

  static changePassword(userId, oldPassword, newPassword) {
    const users = Storage.load(User.USERS_KEY) || [];
    const user = users.find(u => u.userId === userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== oldPassword) {
      throw new Error("Old password is incorrect");
    }

    Storage.updateItem(
      this.USERS_KEY,
      "userId",
      userId,
      { password: newPassword }
    );

    return true;
  }
}