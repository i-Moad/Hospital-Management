import Storage from "./Storage.js";

const APPOINTMENTS_KEY = "Appointments";
const USERS_KEY = "Users";
const ID = "appointmentId";

export default class Appointment {
  static getAll() {
    const appointments = Storage.load(APPOINTMENTS_KEY);
    const users = Storage.load(USERS_KEY);

    // Build userId => "LastName FirstName"
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.userId] = `${user.lastName} ${user.firstName}`;
    });

    // Enrich appointments
    return appointments.map(app => ({
      ...app,
      patientName: usersMap[app.patientId] || "Unknown patient",
      doctorName: usersMap[app.doctorId] || "Unknown doctor"
    }));
  }

  static getById(id) {
    const appointment = Storage
      .load(APPOINTMENTS_KEY)
      .find(a => a[ID] == id);

    if (!appointment) return null;

    const users = Storage.load(USERS_KEY);

    // Build userId => "LastName FirstName"
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.userId] = `${user.lastName} ${user.firstName}`;
    });

    return {
      ...appointment,
      patientName: usersMap[appointment.patientId] || "Unknown patient",
      allDoctors: users
        .filter(user => user.role === "doctor")
        .map(user => ({
          id: user.userId,
          fullName: `${user.lastName} ${user.firstName}`
        }))
    };
  }

  static create(data) {
    return Storage.addItem(APPOINTMENTS_KEY, data);
  }

  static update(id, updates) {
    return Storage.updateItem(APPOINTMENTS_KEY, ID, id, updates);
  }

  static delete(id) {
    return Storage.removeItem(APPOINTMENTS_KEY, ID, id);
  }
}
