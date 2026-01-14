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

    // Récupérer la langue depuis localStorage
    const lang = localStorage.getItem("lang") || "en"; // valeur par défaut = anglais

    // Traduction des statuts selon la langue
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

    this.statusChart = new Chart(this.statusChartEl, {
        type: "doughnut",
        data: {
            labels: translatedStatuses,
            datasets: [{
                label: lang === "fr" ? "Rendez-vous" : lang === "ar" ? "المواعيد" : "Appointments",
                data: data.map(d => d.count),
                backgroundColor: ["#facc15", "#ef4444", "#22c55e"] // jaune, rouge, vert
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
