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

    // Récupérer la langue depuis localStorage
    const lang = localStorage.getItem("lang") || "en"; // par défaut anglais

    // Traduire les statuts
    const translatedStatuses = data.map(d => {
        if (d.status === "pending") {
            if (lang === "fr") return "En attente";
            if (lang === "ar") return "قيد الانتظار";
            return "Pending";
        }
        if (d.status === "cancelled") {
            if (lang === "fr") return "Annulé";
            if (lang === "ar") return "ملغى";
            return "Cancelled";
        }
        if (d.status === "confirmed") {
            if (lang === "fr") return "Confirmé";
            if (lang === "ar") return "مؤكد";
            return "Confirmed";
        }
        return d.status; // par défaut
    });

    // Traduire le label du graphique
    const chartLabel = lang === "fr" ? "Rendez-vous" : lang === "ar" ? "المواعيد" : "Appointments";

    this.statusChart = new Chart(this.statusChartEl, {
        type: "doughnut",
        data: {
            labels: translatedStatuses,
            datasets: [{
                label: chartLabel,
                data: data.map(d => d.count),
                backgroundColor: ["#facc15", "#22c55e", "#ef4444"] // jaune, vert, rouge
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