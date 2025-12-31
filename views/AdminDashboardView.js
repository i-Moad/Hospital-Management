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

  renderOccupationChart(data) {
    const ctx = document.getElementById('occupationChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Taux d\'Occupation (%)',
          data,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#EF4444'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }
}