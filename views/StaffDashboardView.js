export default class StaffDashboardView {
  constructor() {
    this.totalPatients = document.getElementById("totalPatients");
    this.nbrPendingAppointments = document.getElementById("pendingAppointments");
    this.nbrConfirmedAppointments = document.getElementById("confirmedAppointments");
    this.statusChartEl = document.getElementById("statusChart").getContext("2d");
  }

  renderChart(counts) {
    this.totalPatients.textContent = counts.totalP;
    this.nbrPendingAppointments.textContent = counts.nbrPendingAppointments;
    this.nbrConfirmedAppointments.textContent = counts.nbrConfirmedAppointments;
  }

    renderAppointmentsByStatusChart(data) {
        if (this.statusChart) this.statusChart.destroy();

        this.statusChart = new Chart(this.statusChartEl, {
            type: "doughnut",
            data: {
                labels: data.map(d => d.status),
                datasets: [{
                    label: "Appointments",
                    data: data.map(d => d.count),
                    backgroundColor: ["#facc15", "#22c55e", "#ef4444"] // yellow, green, red
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: { enabled: true }
                }
            }
        });
    }

}