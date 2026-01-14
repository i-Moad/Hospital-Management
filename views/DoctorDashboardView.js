export default class DoctorDashboardView {
    constructor() {
        this.totalPatients = document.getElementById("totalPatients");
        this.nbrPendingAppointments = document.getElementById("pendingAppointments");
        this.nbrConfirmedAppointments = document.getElementById("confirmedAppointments");

        // chart containers
        this.serviceChartEl = document.getElementById("serviceChart").getContext("2d");
        this.statusChartEl = document.getElementById("statusChart").getContext("2d");

        this.serviceChart = null;
        this.statusChart = null;
    }

    renderStats(counts) {
        this.totalPatients.textContent = counts.totalP;
        this.nbrPendingAppointments.textContent = counts.nbrPendingAppointments;
        this.nbrConfirmedAppointments.textContent = counts.nbrConfirmedAppointments;
    }

    renderDoctorsPerServiceChart(data) {
        if (this.serviceChart) this.serviceChart.destroy();

        this.serviceChart = new Chart(this.serviceChartEl, {
            type: "bar",
            data: {
                labels: data.map(d => d.serviceName),
                datasets: [{
                    label: "Doctors assigned",
                    data: data.map(d => d.count),
                    backgroundColor: "#4ade80" // green
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
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
