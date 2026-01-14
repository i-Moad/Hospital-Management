import Appointment from "./Appointment.js";
import User from "./User.js";

export default class DocorStats {
  static getCounts() {
    const appointments = Appointment.getAll();

    const totalP = User.getAllUsers("patient").filter(user =>
        user.role === "patient" &&
        appointments.some(a => a.patientId == user.userId)
    ).length;

    const nbrPendingAppointments = appointments.filter(a => a.status === "pending").length;
    const nbrConfirmedAppointments = appointments.filter(a => a.status === "confirmed").length;

    return {
      totalP,
      nbrPendingAppointments,
      nbrConfirmedAppointments
    };
  }

    static getAppointmentsByStatus() {
        const appointments = Appointment.getAll();
        const statuses = ["pending", "confirmed", "cancelled"];

        return statuses.map(status => ({
            status,
            count: appointments.filter(a => a.status === status).length
        }));
    }

}
