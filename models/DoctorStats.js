import User from "./User.js";
import Appointment from "./Appointment.js";
import Storage from "./Storage.js";

const SERVICES_KEY = "Services";

export default class DoctorStats {

    // basic counts
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

    static getDoctorsPerService() {
        const services = Storage.load(SERVICES_KEY);
        const doctors = User.getAllUsers("doctor");
        const appointments = Appointment.getAll();

        return services.map(service => {
            // get all unique doctors assigned to this service via appointments
            const doctorIds = new Set(
                appointments
                    .filter(a => a.serviceId === service.serviceId)
                    .map(a => a.doctorId)
            );

            return {
                serviceName: service.serviceName,
                count: doctorIds.size
            };
        });
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
