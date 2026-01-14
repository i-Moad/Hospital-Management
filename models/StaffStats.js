import Appointment from "./Appointment.js";
import User from "./User.js";

export default class StaffStats {
  static getCounts() {
    const totalP = User.getAllUsers("patient").length;

    const appointments = Appointment.getAll();

    const nbrPendingAppointments = appointments.filter(a => a.status === "pending").length;
    const nbrConfirmedAppointments = appointments.filter(a => a.status === "confirmed").length;

    return {
      totalP,
      nbrPendingAppointments,
      nbrConfirmedAppointments
    };
  }
}
