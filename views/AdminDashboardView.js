export default class AdminDashboardView {
  constructor() {
    this.nbrUsers = document.getElementById("nbrUsers");
    this.nbrServices = document.getElementById("nbrServices");
    this.nbrStaff = document.getElementById("nbrStaff");
    this.nbrDoctors = document.getElementById("nbrDoctors");
  }

  renderUsersChart(counts) {
    const ctx = document.getElementById('usersHospitalsChart');
    if (!ctx) return;

    this.nbrUsers.textContent = counts.users;
    this.nbrServices.textContent = counts.services;
    this.nbrStaff.textContent = counts.staff;
    this.nbrDoctors.textContent = counts.doctors;

    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Patients', 'Doctors', 'Services Médicaux'],
        datasets: [{
          label: 'Nombre',
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

    new Chart(canvas.getContext("2d"), {
      type: "polarArea",
      data: {
        labels: ["Patients", "Doctors", "Staff"],
        datasets: [
          {
            label: "User Roles",
            data: [
              counts.patients,
              counts.doctors,
              counts.staff
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Users by Role"
          }
        }
      }
    });
  }
}