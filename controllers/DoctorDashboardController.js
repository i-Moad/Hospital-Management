import DoctorDashboardView from "../views/DoctorDashboardView.js";
import DoctorStats from "../models/DoctorStats.js";

export default class DoctorDashboardController {
    constructor() {
        this.view = new DoctorDashboardView();
        this.init();
    }

    init() {
        const counts = DoctorStats.getCounts();
        const doctorsPerService = DoctorStats.getDoctorsPerService();
        const appointmentsByStatus = DoctorStats.getAppointmentsByStatus();

        this.view.renderStats(counts);
        this.view.renderDoctorsPerServiceChart(doctorsPerService);
        this.view.renderAppointmentsByStatusChart(appointmentsByStatus);
    }
}
