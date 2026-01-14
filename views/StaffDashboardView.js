export default class StaffDashboardView {
  constructor() {
    this.totalPatients = document.getElementById("totalPatients");
    this.nbrPendingAppointments = document.getElementById("pendingAppointments");
    this.nbrConfirmedAppointments = document.getElementById("confirmedAppointments");
  }

  renderChart(counts) {
    this.totalPatients.textContent = counts.totalP;
    this.nbrPendingAppointments.textContent = counts.nbrPendingAppointments;
    this.nbrConfirmedAppointments.textContent = counts.nbrConfirmedAppointments;
  }
}