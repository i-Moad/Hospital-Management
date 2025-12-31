import User from "./User.js";

export default class AdminStats {
  static getCounts() {
    const users = User.getAllUsers().length;
    const patients = User.getAllUsers("patient").length;
    const doctors = User.getAllUsers("doctor").length;
    const staff = User.getAllUsers("staff").length;

    const services = 156;

    return { users, doctors, staff, patients, services };
  }

  static getOccupationRate() {
    return [70, 72, 75, 78, 76, 78];
  }
}