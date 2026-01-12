export default class AdminDashboardView {
  constructor() {
    this.nbrUsers = document.getElementById("nbrUsers");
    this.nbrServices = document.getElementById("nbrServices");
    this.nbrStaff = document.getElementById("nbrStaff");
    this.nbrDoctors = document.getElementById("nbrDoctors");

    // Langue actuelle
    this.currentLang = localStorage.getItem("lang") || "fr";
  }

  translate(labelFr, labelEn, labelAr) {
    if (this.currentLang === "fr") return labelFr;
    if (this.currentLang === "en") return labelEn;
    if (this.currentLang === "ar") return labelAr;
    return labelFr; // fallback
  }

  renderUsersChart(counts) {
    const ctx = document.getElementById('usersHospitalsChart');
    if (!ctx) return;

    this.nbrUsers.textContent = counts.users;
    this.nbrServices.textContent = counts.services;
    this.nbrStaff.textContent = counts.staff;
    this.nbrDoctors.textContent = counts.doctors;

    // Traductions
    const labelPatients = this.translate("Patients", "Patients", "المرضى");
    const labelDoctors = this.translate("Médecins", "Doctors", "الأطباء");
    const labelServices = this.translate("Services Médicaux", "Medical Services", "الخدمات الطبية");
    const chartLabel = this.translate("Nombre", "Count", "عدد");

    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [labelPatients, labelDoctors, labelServices],
        datasets: [{
          label: chartLabel,
          data: [counts.patients, counts.doctors, counts.services],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  renderUserRolesChart(counts) {
    const canvas = document.getElementById("userRolesChart");
    if (!canvas) return;

    // Traductions
    const labelPatients = this.translate("Patients", "Patients", "المرضى");
    const labelDoctors = this.translate("Médecins", "Doctors", "الأطباء");
    const labelStaff = this.translate("Personnel", "Staff", "الموظفين");
    const chartTitle = this.translate("Utilisateurs par rôle", "Users by Role", "المستخدمون حسب الدور");

    new Chart(canvas.getContext("2d"), {
      type: "polarArea",
      data: {
        labels: [labelPatients, labelDoctors, labelStaff],
        datasets: [
          {
            label: chartTitle,
            data: [counts.patients, counts.doctors, counts.staff],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: chartTitle
          }
        }
      }
    });
  }
}
