import Storage from "./Storage.js";

export default class User {
  static USERS_KEY = "Users";

  static createUser({
    CIN,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    emergencyContacts,
    status = "active",
    role = "patient",
    createdAt = new Date().toISOString(),
  }) {
    // Load existing users
    const users = Storage.load(User.USERS_KEY) || [];

    // Check for duplicates
    const exists = users.some(u => u.CIN === CIN || u.email === email || u.phoneNumber === phoneNumber);
    if (exists) {
      alert("User already exists");
    }

    // Create a new user object
    const user = {
      userId: crypto.randomUUID(),
      CIN,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      emergencyContacts,
      status,
      role,
      createdAt
    };

    // Save the user
    Storage.addItem(User.USERS_KEY, user);

    return user;
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
    if ("CIN" in updates) allowedUpdates.CIN = updates.CIN;
    if ("role" in updates) allowedUpdates.role = updates.role;
    if ("status" in updates) allowedUpdates.status = updates.status;
    if ("firstName" in updates) allowedUpdates.firstName = updates.firstName;
    if ("lastName" in updates) allowedUpdates.lastName = updates.lastName;
    if ("emergencyContacts" in updates)
      allowedUpdates.emergencyContacts = updates.emergencyContacts;

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

  static updateByCIN(CIN, updates) {
    const allowedUpdates = {};
    
    if ("phoneNumber" in updates) allowedUpdates.phoneNumber = updates.phoneNumber;
    if ("address" in updates) allowedUpdates.address = updates.address;
    if ("email" in updates) allowedUpdates.email = updates.email;

    const success = Storage.updateItem(
      this.USERS_KEY,
      "CIN",
      CIN,
      allowedUpdates
    );

    if (!success) {
      throw new Error("User not found");
    }

    return this.getUserByCIN(CIN);
  }

  static deleteUser(userId) {
    userId = userId;
    
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