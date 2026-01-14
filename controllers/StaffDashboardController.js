import StaffDashboardView from "../views/StaffDashboardView.js";
import StaffStats from "../models/StaffStats.js";

export default class StaffDashboardController {
  constructor() {
    this.view = new StaffDashboardView();
    this.init();
  }

  init() {
    const counts = StaffStats.getCounts();

    const appointmentsByStatus = StaffStats.getAppointmentsByStatus();

    this.view.renderChart(counts);
    this.view.renderAppointmentsByStatusChart(appointmentsByStatus);
  }
}