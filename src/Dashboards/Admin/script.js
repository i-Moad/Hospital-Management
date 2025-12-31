// ============================================
// CONFIGURATION GLOBALE
// ============================================

const pages = ["dashboard", "users", "services", "hopital"];
let currentUsersPage = 1;
let usersPerPage = 10;
let usersData = [];
let filteredUsersData = [];
let servicesData = [];
let filteredServicesData = [];
let currentServicesPage = 1;
let servicesPerPage = 10;
let selectedServiceId = null;
let assignedDoctors = new Set();
let currentEditingUserId = null;
let currentEditingServiceId = null;

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function isMobile() {
  return window.innerWidth < 640;
}

function isRTL() {
  return localStorage.getItem("lang") === "ar";
}

function getDirectionClasses() {
  if (isRTL()) {
    return {
      hidden: "translate-x-full",
      visible: "translate-x-0",
      position: "right-0",
      margin: "sm:mr-64",
      border: "border-l",
    };
  } else {
    return {
      hidden: "-translate-x-full",
      visible: "translate-x-0",
      position: "left-0",
      margin: "sm:ml-64",
      border: "border-r",
    };
  }
}

function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast-container");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast-container fixed top-4 right-4 z-[100]`;
  toast.innerHTML = `
                <div class="px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
                  type === "success"
                    ? "bg-green-500 text-white"
                    : type === "error"
                    ? "bg-red-500 text-white"
                    : type === "warning"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
                }">
                    <div class="flex items-center">
                        <i data-feather="${
                          type === "success"
                            ? "check-circle"
                            : type === "error"
                            ? "alert-circle"
                            : type === "warning"
                            ? "alert-triangle"
                            : "info"
                        }" 
                          class="w-5 h-5 mr-2"></i>
                        <span>${message}</span>
                    </div>
                </div>
            `;

  document.body.appendChild(toast);

  feather.replace();

  setTimeout(() => {
    toast.querySelector("div").style.opacity = "0";
    toast.querySelector("div").style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function generateUserCode(id) {
  return `USR-${String(id).padStart(3, "0")}`;
}

function generateServiceCode(id) {
  return `SVC-${String(id).padStart(3, "0")}`;
}

// ============================================
// GESTION DU DASHBOARD
// ============================================

async function loadDashboardData() {
  try {
    const dashboardData = {
      totalUsers: 1234,
      activeHospitals: 48,
      medicalServices: 156,
      occupationRate: 78,
      usersEvolution: "+12%",
      hospitalsEvolution: "+5%",
      servicesEvolution: "+8%",
      occupationEvolution: "-3%",
      recentActivity: [
        {
          id: 1,
          metric: "Nouveaux utilisateurs",
          value: "45",
          evolution: "+12%",
          trend: "up",
        },
        {
          id: 2,
          metric: "Rendez-vous aujourd'hui",
          value: "156",
          evolution: "+5%",
          trend: "up",
        },
        {
          id: 3,
          metric: "Taux d'occupation",
          value: "78%",
          evolution: "-3%",
          trend: "down",
        },
        {
          id: 4,
          metric: "Temps d'attente moyen",
          value: "15 min",
          evolution: "-8%",
          trend: "down",
        },
      ],
    };

    // Mettre à jour les cartes
    document.getElementById("totalUsersCount").textContent =
      dashboardData.totalUsers.toLocaleString();
    document.getElementById("activeHospitalsCount").textContent =
      dashboardData.activeHospitals;
    document.getElementById("medicalServicesCount").textContent =
      dashboardData.medicalServices;
    document.getElementById("occupationRateValue").textContent =
      dashboardData.occupationRate + "%";
    document.getElementById("usersEvolution").textContent =
      dashboardData.usersEvolution;
    document.getElementById("hospitalsEvolution").textContent =
      dashboardData.hospitalsEvolution;
    document.getElementById("servicesEvolution").textContent =
      dashboardData.servicesEvolution;
    document.getElementById("occupationEvolution").textContent =
      dashboardData.occupationEvolution;

    // Mettre à jour le tableau
    const tbody = document.getElementById("dashboardMetricsBody");
    let html = "";
    dashboardData.recentActivity.forEach((item) => {
      html += `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-900">${
                              item.metric
                            }</td>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">${
                              item.value
                            }</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-${
                                  item.trend === "up" ? "green" : "red"
                                }-600 font-medium">
                                    ${item.evolution}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <i data-feather="trending-${item.trend}" 
                                   class="w-5 h-5 text-${
                                     item.trend === "up" ? "green" : "red"
                                   }-600"></i>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button class="text-blue-600 hover:text-blue-800 transition-colors mx-1">
                                    <i data-feather="eye" class="w-5 h-5 inline"></i>
                                </button>
                            </td>
                        </tr>
                    `;
    });
    tbody.innerHTML = html;

    feather.replace();
  } catch (error) {
    console.error("Erreur lors du chargement des données du dashboard:", error);
    // showToast("Erreur lors du chargement des données du dashboard", "error");
  }
}



// ============================================
// GESTION DES UTILISATEURS
// ============================================

async function loadUsersData() {
  try {
    usersData = [
      {
        id: 1,
        cin: "AB123456",
        firstName: "Ahmed",
        lastName: "Benani",
        email: "ahmed.benani@example.com",
        phone: "+212 600-111111",
        address: "123 Rue Principale, Casablanca",
        role: "admin",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        birthDate: "1985-03-15",
        department: "Direction",
      },
      {
        id: 1,
        cin: "AB123456",
        firstName: "Ahmed",
        lastName: "Benani",
        email: "ahmed.benani@example.com",
        phone: "+212 600-111111",
        address: "123 Rue Principale, Casablanca",
        role: "admin",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        birthDate: "1985-03-15",
        department: "Direction",
      },
      {
        id: 1,
        cin: "AB123456",
        firstName: "Ahmed",
        lastName: "Benani",
        email: "ahmed.benani@example.com",
        phone: "+212 600-111111",
        address: "123 Rue Principale, Casablanca",
        role: "admin",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        birthDate: "1985-03-15",
        department: "Direction",
      },
      {
        id: 1,
        cin: "AB123456",
        firstName: "Ahmed",
        lastName: "Benani",
        email: "ahmed.benani@example.com",
        phone: "+212 600-111111",
        address: "123 Rue Principale, Casablanca",
        role: "admin",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        birthDate: "1985-03-15",
        department: "Direction",
      },
      {
        id: 1,
        cin: "AB123456",
        firstName: "Ahmed",
        lastName: "Benani",
        email: "ahmed.benani@example.com",
        phone: "+212 600-111111",
        address: "123 Rue Principale, Casablanca",
        role: "admin",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        birthDate: "1985-03-15",
        department: "Direction",
      },
      {
        id: 2,
        cin: "CD789012",
        firstName: "Fatima",
        lastName: "Zahra",
        email: "fatima.zahra@example.com",
        phone: "+212 600-222222",
        address: "456 Avenue Mohammed V, Rabat",
        role: "doctor",
        specialty: "Cardiologie",
        status: "active",
        createdAt: "2024-02-10",
        hospital: "Hôpital Ibn Sina",
        birthDate: "1980-07-22",
        department: "Cardiologie",
      },
      {
        id: 3,
        cin: "EF345678",
        firstName: "Karim",
        lastName: "Alami",
        email: "karim.alami@example.com",
        phone: "+212 600-333333",
        address: "789 Boulevard Hassan II, Marrakech",
        role: "doctor",
        specialty: "Radiologie",
        status: "active",
        createdAt: "2024-02-20",
        hospital: "Clinique Al Farabi",
        birthDate: "1990-11-30",
        department: "Radiologie",
      },
      {
        id: 4,
        cin: "GH901234",
        firstName: "Samira",
        lastName: "El Moussa",
        email: "samira.elmoussa@example.com",
        phone: "+212 600-444444",
        address: "321 Rue des Lilas, Fès",
        role: "doctor",
        specialty: "Urgences",
        status: "active",
        createdAt: "2024-03-01",
        hospital: "Hôpital Central EMSI",
        birthDate: "1988-05-15",
        department: "Urgences",
      },
      {
        id: 5,
        cin: "IJ567890",
        firstName: "Mohamed",
        lastName: "Khalil",
        email: "mohamed.khalil@example.com",
        phone: "+212 600-555555",
        address: "654 Avenue Al Amir, Tanger",
        role: "staff",
        status: "active",
        createdAt: "2024-03-05",
        hospital: "Hôpital Ibn Sina",
        birthDate: "1992-09-20",
        department: "Administration",
      },
    ];

    filterAndPaginateUsers();
    // showToast("Utilisateurs chargés avec succès", "success");
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
    // showToast("Erreur lors du chargement des utilisateurs", "error");
  }
}

function filterAndPaginateUsers() {
  const roleFilter = document.getElementById("filterRole").value;
  const statusFilter = document.getElementById("filterStatus").value;
  const searchTerm = document.getElementById("searchUsers").value.toLowerCase();

  filteredUsersData = usersData.filter((user) => {
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.cin.toLowerCase().includes(searchTerm);

    return matchesRole && matchesStatus && matchesSearch;
  });

  currentUsersPage = 1;
  renderUsersTable();
  updateUsersPagination();
}

function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");

  const startIndex = (currentUsersPage - 1) * usersPerPage;
  const endIndex = Math.min(
    startIndex + usersPerPage,
    filteredUsersData.length
  );
  const paginatedUsers = filteredUsersData.slice(startIndex, endIndex);

  if (paginatedUsers.length === 0) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <i data-feather="users" class="w-12 h-12 text-gray-400 mb-4"></i>
                                <span class="text-gray-500 mb-4" data-i18n="Aucun utilisateur trouvé"></span>
                                <button id="addFirstUserBtn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <i data-feather="user-plus" class="w-4 h-4 inline mr-2"></i>
                                    <span data-i18n="Ajouter votre premier utilisateur"></span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;

    document
      .getElementById("addFirstUserBtn")
      ?.addEventListener("click", () => {
        openModal("addUserModal");
      });

    updateUsersPagination();
    feather.replace();
    return;
  }

  let html = "";
  paginatedUsers.forEach((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const roleInfo = getRoleInfo(user.role);
    const statusInfo = getStatusInfo(user.status);

    html += `
                    <tr class="user-row" data-user-id="${user.id}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                ${generateUserCode(user.id)}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="font-medium text-gray-900">${fullName}</div>
                            <div class="text-sm text-gray-500">${user.cin}</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-900">${
                              user.email
                            }</div>
                            <div class="text-sm text-gray-500">${
                              user.phone
                            }</div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              roleInfo.color
                            }">
                                <i data-feather="${
                                  roleInfo.icon
                                }" class="w-3 h-3 mr-1"></i>
                                ${roleInfo.text}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusInfo.color
                            }">
                                <i data-feather="${
                                  statusInfo.icon
                                }" class="w-3 h-3 mr-1"></i>
                                ${statusInfo.text}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${formatDate(user.createdAt)}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex space-x-2">
                                <button class="edit-user-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" 
                                        title="Modifier" data-user-id="${
                                          user.id
                                        }">
                                    <i data-feather="edit" class="w-4 h-4"></i>
                                </button>
                                <button class="delete-user-btn p-1 text-red-600 hover:text-red-800 transition-colors"
                                        title="Supprimer" data-user-id="${
                                          user.id
                                        }">
                                    <i data-feather="trash" class="w-4 h-4"></i>
                                </button>
                                <button class="view-user-btn p-1 text-green-600 hover:text-green-800 transition-colors"
                                        title="Voir détails" data-user-id="${
                                          user.id
                                        }">
                                    <i data-feather="eye" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
  });

  tbody.innerHTML = html;

  document.getElementById("usersStartItem").textContent = startIndex + 1;
  document.getElementById("usersEndItem").textContent = endIndex;
  document.getElementById("usersTotalItems").textContent =
    filteredUsersData.length;

  feather.replace();
}

function updateUsersPagination() {
  const totalPages = Math.ceil(filteredUsersData.length / usersPerPage);
  const prevBtn = document.getElementById("prevUsersPage");
  const nextBtn = document.getElementById("nextUsersPage");
  const paginationNumbers = document.getElementById("usersPaginationNumbers");

  prevBtn.disabled = currentUsersPage === 1;
  nextBtn.disabled = currentUsersPage === totalPages || totalPages === 0;

  let paginationHTML = "";
  const maxVisiblePages = 5;
  let startPage = Math.max(
    1,
    currentUsersPage - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
                    <button class="users-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="1">
                        1
                    </button>
                    ${
                      startPage > 2
                        ? '<span class="px-2 text-gray-500">...</span>'
                        : ""
                    }
                `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
                    <button class="users-page-btn px-3 py-1 border ${
                      i === currentUsersPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300"
                    } rounded text-sm" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
                    ${
                      endPage < totalPages - 1
                        ? '<span class="px-2 text-gray-500">...</span>'
                        : ""
                    }
                    <button class="users-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="${totalPages}">
                        ${totalPages}
                    </button>
                `;
  }

  paginationNumbers.innerHTML = paginationHTML;
}

function getRoleInfo(role) {
  const roles = {
    admin: {
      text: "Administrateur",
      color: "bg-purple-100 text-purple-800",
      icon: "shield",
    },
    doctor: {
      text: "Médecin",
      color: "bg-blue-100 text-blue-800",
      icon: "user",
    },
    staff: {
      text: "Personnel",
      color: "bg-green-100 text-green-800",
      icon: "users",
    },
    patient: {
      text: "Patient",
      color: "bg-gray-100 text-gray-800",
      icon: "user",
    },
  };
  return (
    roles[role] || {
      text: role,
      color: "bg-gray-100 text-gray-800",
      icon: "user",
    }
  );
}

function getStatusInfo(status) {
  const statuses = {
    active: {
      text: "Actif",
      color: "bg-green-100 text-green-800",
      icon: "check-circle",
    },
    inactive: {
      text: "Inactif",
      color: "bg-red-100 text-red-800",
      icon: "x-circle",
    },
    pending: {
      text: "En attente",
      color: "bg-yellow-100 text-yellow-800",
      icon: "clock",
    },
    suspended: {
      text: "Suspendu",
      color: "bg-orange-100 text-orange-800",
      icon: "pause-circle",
    },
  };
  return (
    statuses[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
      icon: "help-circle",
    }
  );
}

// ============================================
// GESTION DES SERVICES
// ============================================

async function loadServicesData() {
  try {
    servicesData = [
      {
        id: 1,
        name: "Radiologie",
        code: "SERV-RAD-001",
        description:
          "Service d'imagerie médicale équipé des dernières technologies",
        status: "active",
        createdAt: "2024-01-15",
        hospital: "Hôpital Central EMSI",
        chief: "Dr. Ahmed Benani",
        totalBeds: 24,
        occupiedBeds: 18,
        assignedDoctors: [
          {
            id: 3,
            name: "Karim Alami",
            role: "chief",
            specialty: "Radiologie",
            assignmentDate: "2024-02-20",
            schedule: { days: "weekdays", shift: "morning" },
          },
        ],
        equipment: [
          "Scanner 64 barrettes",
          "IRM 3 Tesla",
          "Échographie 4D",
          "Radiologie numérique",
        ],
      },
      {
        id: 2,
        name: "Cardiologie",
        code: "SERV-CAR-002",
        description: "Service de cardiologie et soins intensifs cardiaques",
        status: "active",
        createdAt: "2024-02-10",
        hospital: "Hôpital Ibn Sina",
        chief: "Dr. Fatima Zahra",
        totalBeds: 20,
        occupiedBeds: 15,
        assignedDoctors: [
          {
            id: 2,
            name: "Fatima Zahra",
            role: "chief",
            specialty: "Cardiologie",
            assignmentDate: "2024-02-10",
            schedule: { days: "all_week", shift: "full" },
          },
        ],
        equipment: [
          "Échocardiographie",
          "Holter ECG",
          "Moniteur tensionnel",
          "Défibrillateur",
        ],
      },
      {
        id: 3,
        name: "Urgences",
        code: "SERV-URG-003",
        description:
          "Service d'urgences médicales 24h/24 avec équipement de réanimation",
        status: "active",
        createdAt: "2024-03-05",
        hospital: "Clinique Al Farabi",
        chief: "Dr. Karim Alami",
        totalBeds: 30,
        occupiedBeds: 25,
        assignedDoctors: [
          {
            id: 4,
            name: "Samira El Moussa",
            role: "chief",
            specialty: "Urgences",
            assignmentDate: "2024-03-01",
            schedule: { days: "all_week", shift: "night" },
          },
        ],
        equipment: [
          "Salles de réanimation",
          "Matériel d'intubation",
          "Moniteurs multiparamètres",
          "Échographe portable",
        ],
      },
    ];

    filterAndPaginateServices();
    // showToast("Services chargés avec succès", "success");
  } catch (error) {
    console.error("Erreur lors du chargement des services:", error);
    // showToast("Erreur lors du chargement des services", "error");
  }
}

function filterAndPaginateServices() {
  const statusFilter = document.getElementById("filterServiceStatus").value;
  const searchTerm = document
    .getElementById("searchServicesTable")
    .value.toLowerCase();

  filteredServicesData = servicesData.filter((service) => {
    const matchesStatus = !statusFilter || service.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  currentServicesPage = 1;
  renderServicesTable();
  updateServicesPagination();
}

function renderServicesTable() {
  const tbody = document.getElementById("servicesTableBody");

  const startIndex = (currentServicesPage - 1) * servicesPerPage;
  const endIndex = Math.min(
    startIndex + servicesPerPage,
    filteredServicesData.length
  );
  const paginatedServices = filteredServicesData.slice(startIndex, endIndex);

  if (paginatedServices.length === 0) {
    tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-12 text-center">
                            <div class="flex flex-col items-center justify-center">
                                <i data-feather="inbox" class="w-12 h-12 text-gray-400 mb-4"></i>
                                <span class="text-gray-500 mb-4" data-i18n="Aucun service trouvé"></span>
                                <button id="addFirstServiceBtn"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <i data-feather="plus" class="w-4 h-4 inline mr-2"></i>
                                    <span data-i18n="Ajouter votre premier service"></span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;

    document
      .getElementById("addFirstServiceBtn")
      ?.addEventListener("click", () => {
        openModal("addServiceModal");
      });

    updateServicesPagination();
    feather.replace();
    return;
  }

  let html = "";
  paginatedServices.forEach((service) => {
    const doctorCount = service.assignedDoctors
      ? service.assignedDoctors.length
      : 0;

    html += `
                    <tr class="service-row" data-service-id="${service.id}">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                ${
                                  service.code ||
                                  generateServiceCode(service.id)
                                }
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="font-medium text-gray-900">${
                              service.name
                            }</div>
                            <div class="text-sm text-gray-500">${
                              service.hospital
                            }</div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-600 max-w-xs truncate">${
                              service.description
                            }</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <i data-feather="users" class="w-4 h-4 text-gray-400 mr-2"></i>
                                <span class="text-sm font-medium">${doctorCount}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              service.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }">
                                <i data-feather="${
                                  service.status === "active"
                                    ? "check-circle"
                                    : "x-circle"
                                }" class="w-3 h-3 mr-1"></i>
                                ${
                                  service.status === "active"
                                    ? "Actif"
                                    : "Inactif"
                                }
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex space-x-2">
                                <button class="assign-doctor-btn p-1 text-purple-600 hover:text-purple-800 transition-colors"
                                        title="Affecter un médecin" data-service-id="${
                                          service.id
                                        }">
                                    <i data-feather="user-plus" class="w-4 h-4"></i>
                                </button>
                                <button class="view-service-btn p-1 text-green-600 hover:text-green-800 transition-colors"
                                        title="Voir détails" data-service-id="${
                                          service.id
                                        }">
                                    <i data-feather="eye" class="w-4 h-4"></i>
                                </button>
                                <button class="edit-service-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" 
                                        title="Modifier" data-service-id="${
                                          service.id
                                        }">
                                    <i data-feather="edit" class="w-4 h-4"></i>
                                </button>
                                <button class="delete-service-btn p-1 text-red-600 hover:text-red-800 transition-colors"
                                        title="Supprimer" data-service-id="${
                                          service.id
                                        }">
                                    <i data-feather="trash" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
  });

  tbody.innerHTML = html;

  document.getElementById("servicesStartItem").textContent = startIndex + 1;
  document.getElementById("servicesEndItem").textContent = endIndex;
  document.getElementById("servicesTotalItems").textContent =
    filteredServicesData.length;

  feather.replace();
}

function updateServicesPagination() {
  const totalPages = Math.ceil(filteredServicesData.length / servicesPerPage);
  const prevBtn = document.getElementById("prevServicesPage");
  const nextBtn = document.getElementById("nextServicesPage");
  const paginationNumbers = document.getElementById(
    "servicesPaginationNumbers"
  );

  prevBtn.disabled = currentServicesPage === 1;
  nextBtn.disabled = currentServicesPage === totalPages || totalPages === 0;

  let paginationHTML = "";
  const maxVisiblePages = 5;
  let startPage = Math.max(
    1,
    currentServicesPage - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
                    <button class="services-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="1">
                        1
                    </button>
                    ${
                      startPage > 2
                        ? '<span class="px-2 text-gray-500">...</span>'
                        : ""
                    }
                `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
                    <button class="services-page-btn px-3 py-1 border ${
                      i === currentServicesPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300"
                    } rounded text-sm" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
                    ${
                      endPage < totalPages - 1
                        ? '<span class="px-2 text-gray-500">...</span>'
                        : ""
                    }
                    <button class="services-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="${totalPages}">
                        ${totalPages}
                    </button>
                `;
  }

  if (paginationNumbers) {
    paginationNumbers.innerHTML = paginationHTML;
  }
}

// ============================================
// GESTION DES MODALES UTILISATEURS
// ============================================

function openViewUserModal(userId) {
  const user = usersData.find((u) => u.id == userId);
  if (!user) {
    // showToast("Utilisateur non trouvé", "error");
    return;
  }

  document.getElementById(
    "viewUserFullName"
  ).textContent = `${user.firstName} ${user.lastName}`;
  document.getElementById("viewUserCIN").textContent = user.cin;
  document.getElementById("viewUserBirthDate").textContent = user.birthDate
    ? formatDate(user.birthDate)
    : "-";
  document.getElementById("viewUserEmail").textContent = user.email;
  document.getElementById("viewUserPhone").textContent = user.phone;
  document.getElementById("viewUserAddress").textContent = user.address || "-";

  const roleInfo = getRoleInfo(user.role);
  document.getElementById("viewUserRole").textContent = roleInfo.text;
  document.getElementById(
    "viewUserRole"
  ).className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color}`;

  const statusInfo = getStatusInfo(user.status);
  document.getElementById("viewUserStatus").innerHTML = `
                <i data-feather="${statusInfo.icon}" class="w-4 h-4 mr-1"></i>
                ${statusInfo.text}
            `;
  document.getElementById(
    "viewUserStatus"
  ).className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`;

  document.getElementById("viewUserCreatedAt").textContent = formatDate(
    user.createdAt
  );
  document.getElementById("viewUserHospital").textContent =
    user.hospital || "-";
  document.getElementById("viewUserDepartment").textContent =
    user.department || "-";

  currentEditingUserId = userId;

  openModal("viewUserModal");
  feather.replace();
}

function openEditUserModal(userId) {
  const user = usersData.find((u) => u.id == userId);
  if (!user) {
    // showToast("Utilisateur non trouvé", "error");
    return;
  }

  document.getElementById("editUserFirstName").value = user.firstName;
  document.getElementById("editUserLastName").value = user.lastName;
  document.getElementById("editUserCIN").value = user.cin;
  document.getElementById("editUserEmail").value = user.email;
  document.getElementById("editUserPhone").value = user.phone;
  document.getElementById("editUserAddress").value = user.address || "";
  document.getElementById("editUserRole").value = user.role;
  document.getElementById("editUserStatus").value = user.status;
  document.getElementById("editUserHospital").value = user.hospital || "1";
  document.getElementById("editUserId").value = userId;

  currentEditingUserId = userId;

  openModal("editUserModal");
}

function openDeleteUserModal(userId) {
  const user = usersData.find((u) => u.id == userId);
  if (!user) {
    // showToast("Utilisateur non trouvé", "error");
    return;
  }

  document.getElementById(
    "deleteUserName"
  ).textContent = `${user.firstName} ${user.lastName}`;
  const roleInfo = getRoleInfo(user.role);
  document.getElementById(
    "deleteUserInfo"
  ).textContent = `${roleInfo.text} • ${user.email}`;
  document.getElementById("deleteUserId").value = userId;

  openModal("deleteUserModal");
}

// ============================================
// GESTION DES MODALES SERVICES
// ============================================

function openViewServiceModal(serviceId) {
  const service = servicesData.find((s) => s.id == serviceId);
  if (!service) {
    // showToast("Service non trouvé", "error");
    return;
  }

  document.getElementById("viewServiceName").textContent = service.name;
  document.getElementById("viewServiceCode").textContent =
    service.code || generateServiceCode(service.id);
  document.getElementById("viewServiceHospital").textContent =
    service.hospital || "-";
  document.getElementById("viewServiceChief").textContent =
    service.chief || "-";
  document.getElementById("viewServiceDescription").textContent =
    service.description || "-";
  document.getElementById("viewServiceCreatedAt").textContent = formatDate(
    service.createdAt
  );

  const statusText =
    service.status === "active"
      ? "Actif"
      : service.status === "maintenance"
      ? "En maintenance"
      : "Fermé";
  const statusColor =
    service.status === "active"
      ? "bg-green-100 text-green-800"
      : service.status === "maintenance"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  const statusIcon =
    service.status === "active"
      ? "check-circle"
      : service.status === "maintenance"
      ? "tool"
      : "x-circle";

  document.getElementById("viewServiceStatus").innerHTML = `
                <i data-feather="${statusIcon}" class="w-4 h-4 mr-1"></i>
                ${statusText}
            `;
  document.getElementById(
    "viewServiceStatus"
  ).className = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`;

  document.getElementById("viewServiceTotalBeds").textContent =
    service.totalBeds || 0;
  document.getElementById("viewServiceOccupiedBeds").textContent =
    service.occupiedBeds || 0;
  const occupationRate = service.totalBeds
    ? Math.round(((service.occupiedBeds || 0) / service.totalBeds) * 100)
    : 0;
  document.getElementById(
    "viewServiceOccupationRate"
  ).textContent = `${occupationRate}%`;

  const equipmentContainer = document.getElementById("viewServiceEquipment");
  equipmentContainer.innerHTML = "";
  if (service.equipment && service.equipment.length > 0) {
    service.equipment.forEach((equip) => {
      const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-yellow-100 text-yellow-800",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      equipmentContainer.innerHTML += `
                        <span class="inline-flex items-center px-3 py-1 ${randomColor} rounded-full text-sm">
                            <i data-feather="tool" class="w-3 h-3 mr-1"></i>
                            ${equip}
                        </span>
                    `;
    });
  }

  const doctorsContainer = document.getElementById("viewServiceDoctors");
  doctorsContainer.innerHTML = "";
  if (service.assignedDoctors && service.assignedDoctors.length > 0) {
    service.assignedDoctors.forEach((doctor) => {
      const roleColors = {
        chief: "bg-purple-100 text-purple-800",
        regular: "bg-blue-100 text-blue-800",
        assistant: "bg-green-100 text-green-800",
        specialist: "bg-yellow-100 text-yellow-800",
      };

      doctorsContainer.innerHTML += `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i data-feather="user" class="w-4 h-4 text-blue-600"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-900">${
                                      doctor.name
                                    }</p>
                                    <p class="text-sm text-gray-600">${
                                      doctor.specialty
                                    }</p>
                                </div>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              roleColors[doctor.role] ||
                              "bg-gray-100 text-gray-800"
                            }">
                                ${
                                  doctor.role === "chief"
                                    ? "Chef de service"
                                    : doctor.role === "regular"
                                    ? "Médecin"
                                    : doctor.role === "assistant"
                                    ? "Assistant"
                                    : "Spécialiste"
                                }
                            </span>
                        </div>
                    `;
    });
  } else {
    doctorsContainer.innerHTML = `
                    <div class="text-center py-4 text-gray-500">
                        <i data-feather="users" class="w-8 h-8 mx-auto mb-2"></i>
                        <p>Aucun médecin affecté</p>
                    </div>
                `;
  }

  document.getElementById("viewServiceId").value = serviceId;
  currentEditingServiceId = serviceId;

  openModal("viewServiceModal");
  feather.replace();
}

function openEditServiceModal(serviceId) {
  const service = servicesData.find((s) => s.id == serviceId);
  if (!service) {
    // showToast("Service non trouvé", "error");
    return;
  }

  document.getElementById("editServiceName").value = service.name;
  document.getElementById("editServiceCode").value = service.code || "";
  document.getElementById("editServiceHospital").value =
    service.hospital || "1";
  document.getElementById("editServiceChief").value = service.chief || "1";
  document.getElementById("editServiceTotalBeds").value =
    service.totalBeds || 10;
  document.getElementById("editServiceStatus").value =
    service.status || "active";
  document.getElementById("editServiceDescription").value =
    service.description || "";
  document.getElementById("editServiceEquipment").value = service.equipment
    ? service.equipment.join(", ")
    : "";
  document.getElementById("editServiceId").value = serviceId;

  currentEditingServiceId = serviceId;

  openModal("editServiceModal");
}

function openDeleteServiceModal(serviceId) {
  const service = servicesData.find((s) => s.id == serviceId);
  if (!service) {
    // showToast("Service non trouvé", "error");
    return;
  }

  document.getElementById("deleteServiceName").textContent = service.name;
  document.getElementById("deleteServiceInfo").textContent = `${
    service.hospital || "Hôpital"
  } • ${service.totalBeds || 0} lits`;
  document.getElementById("deleteServiceChief").textContent =
    service.chief || "-";
  const occupationRate = service.totalBeds
    ? Math.round(((service.occupiedBeds || 0) / service.totalBeds) * 100)
    : 0;
  document.getElementById(
    "deleteServiceOccupation"
  ).textContent = `${occupationRate}% (${service.occupiedBeds || 0}/${
    service.totalBeds || 0
  } lits)`;

  const warningText =
    service.occupiedBeds > 0
      ? `Cette action est critique car ce service contient actuellement ${service.occupiedBeds} patients hospitalisés. Toutes les données du service seront définitivement supprimées.`
      : `Cette action supprimera définitivement toutes les données du service.`;

  document.getElementById("deleteServiceWarning").textContent = warningText;
  document.getElementById("deleteServiceId").value = serviceId;

  openModal("deleteServiceModal");
}

// ============================================
// GESTION DE L'AFFECTATION DES MÉDECINS
// ============================================

function openAssignDoctorModal(serviceId) {
  const service = servicesData.find((s) => s.id == serviceId);
  if (!service) {
    // showToast("Service non trouvé", "error");
    return;
  }

  document.getElementById("assignServiceName").textContent = service.name;
  document.getElementById("assignServiceInfo").textContent = `${
    service.hospital || "Hôpital"
  } • ${service.code || generateServiceCode(service.id)}`;
  document.getElementById("assignServiceId").value = serviceId;

  const doctors = usersData.filter(
    (user) => user.role === "doctor" && user.status === "active"
  );
  const select = document.getElementById("assignDoctorSelect");

  let options = '<option value="">Choisir un médecin</option>';
  doctors.forEach((doctor) => {
    const fullName = `${doctor.firstName} ${doctor.lastName}`;
    const isAlreadyAssigned = service.assignedDoctors?.some(
      (d) => d.id === doctor.id
    );

    options += `
                    <option value="${doctor.id}" ${
      isAlreadyAssigned ? "disabled" : ""
    }>
                        ${fullName}${
      doctor.specialty ? ` (${doctor.specialty})` : ""
    }
                        ${isAlreadyAssigned ? " - Déjà affecté" : ""}
                    </option>
                `;
  });

  select.innerHTML = options;

  openModal("assignDoctorModal");
}

function handleDoctorAssignment(e) {
  e.preventDefault();

  const serviceId = document.getElementById("assignServiceId").value;
  const doctorId = document.getElementById("assignDoctorSelect").value;
  const role = document.getElementById("assignDoctorRole").value;
  const days = document.getElementById("assignDoctorDays").value;
  const shift = document.getElementById("assignDoctorShift").value;

  if (!doctorId) {
    // showToast("Veuillez sélectionner un médecin", "error");
    return;
  }

  const serviceIndex = servicesData.findIndex((s) => s.id == serviceId);
  if (serviceIndex === -1) {
    // showToast("Service non trouvé", "error");
    return;
  }

  const doctor = usersData.find((d) => d.id == doctorId);
  if (!doctor) {
    // showToast("Médecin non trouvé", "error");
    return;
  }

  if (!servicesData[serviceIndex].assignedDoctors) {
    servicesData[serviceIndex].assignedDoctors = [];
  }

  servicesData[serviceIndex].assignedDoctors.push({
    id: doctor.id,
    name: `${doctor.firstName} ${doctor.lastName}`,
    role: role,
    specialty: doctor.specialty || "Généraliste",
    assignmentDate: new Date().toISOString().split("T")[0],
    schedule: {
      days: days,
      shift: shift,
    },
  });

  document.getElementById("assignDoctorForm").reset();
  closeModal("assignDoctorModal");

  filterAndPaginateServices();

  // showToast("Médecin affecté au service avec succès", "success");
}

// ============================================
// GESTION DES ÉVÉNEMENTS UTILISATEURS
// ============================================

function setupUsersEvents() {
  // Filtres
  document
    .getElementById("filterRole")
    ?.addEventListener("change", filterAndPaginateUsers);
  document
    .getElementById("filterStatus")
    ?.addEventListener("change", filterAndPaginateUsers);
  document
    .getElementById("searchUsers")
    ?.addEventListener("input", filterAndPaginateUsers);

  // Pagination
  document.getElementById("prevUsersPage")?.addEventListener("click", () => {
    if (currentUsersPage > 1) {
      currentUsersPage--;
      renderUsersTable();
      updateUsersPagination();
    }
  });

  document.getElementById("nextUsersPage")?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredUsersData.length / usersPerPage);
    if (currentUsersPage < totalPages) {
      currentUsersPage++;
      renderUsersTable();
      updateUsersPagination();
    }
  });

  // Items per page
  document.getElementById("usersPerPage")?.addEventListener("change", (e) => {
    usersPerPage = parseInt(e.target.value);
    currentUsersPage = 1;
    filterAndPaginateUsers();
  });

  // Page numbers
  document.addEventListener("click", (e) => {
    if (e.target.closest(".users-page-btn")) {
      const page = parseInt(
        e.target.closest(".users-page-btn").getAttribute("data-page")
      );
      if (page && page !== currentUsersPage) {
        currentUsersPage = page;
        renderUsersTable();
        updateUsersPagination();
      }
    }

    if (e.target.closest(".services-page-btn")) {
      const page = parseInt(
        e.target.closest(".services-page-btn").getAttribute("data-page")
      );
      if (page && page !== currentServicesPage) {
        currentServicesPage = page;
        renderServicesTable();
        updateServicesPagination();
      }
    }
  });

  // Add user button
  document.getElementById("addUserBtn")?.addEventListener("click", () => {
    openModal("addUserModal");
  });

  // Add user form
  document
    .getElementById("addUserForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("addUserPassword").value;
      const confirmPassword = document.getElementById(
        "addUserConfirmPassword"
      ).value;

      if (password !== confirmPassword) {
        // showToast("Les mots de passe ne correspondent pas", "error");
        return;
      }

      if (password.length < 6) {
        // showToast(
        //   "Le mot de passe doit contenir au moins 6 caractères",
        //   "error"
        // );
        return;
      }

      const newUser = {
        id:
          usersData.length > 0
            ? Math.max(...usersData.map((u) => u.id)) + 1
            : 1,
        cin: document.getElementById("addUserCIN").value,
        firstName: document.getElementById("addUserFirstName").value,
        lastName: document.getElementById("addUserLastName").value,
        email: document.getElementById("addUserEmail").value,
        phone: document.getElementById("addUserPhone").value,
        address: document.getElementById("addUserAddress").value,
        role: document.getElementById("addUserRole").value,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        hospital: "Hôpital Central EMSI",
        birthDate: null,
        department: null,
      };

      usersData.unshift(newUser);
      document.getElementById("addUserForm").reset();
      closeModal("addUserModal");
      filterAndPaginateUsers();

      // showToast("Utilisateur ajouté avec succès", "success");
    });

  // Edit user form
  document
    .getElementById("editUserForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userId = document.getElementById("editUserId").value;
      const userIndex = usersData.findIndex((u) => u.id == userId);

      if (userIndex === -1) {
        // showToast("Utilisateur non trouvé", "error");
        return;
      }

      usersData[userIndex] = {
        ...usersData[userIndex],
        firstName: document.getElementById("editUserFirstName").value,
        lastName: document.getElementById("editUserLastName").value,
        cin: document.getElementById("editUserCIN").value,
        email: document.getElementById("editUserEmail").value,
        phone: document.getElementById("editUserPhone").value,
        address: document.getElementById("editUserAddress").value,
        role: document.getElementById("editUserRole").value,
        status: document.getElementById("editUserStatus").value,
        hospital:
          document.getElementById("editUserHospital").value === "1"
            ? "Hôpital Central EMSI"
            : document.getElementById("editUserHospital").value === "2"
            ? "Hôpital Ibn Sina"
            : "Clinique Al Farabi",
      };

      closeModal("editUserModal");
      filterAndPaginateUsers();

      // showToast("Utilisateur modifié avec succès", "success");
    });

  // Delete user confirmation
  document
    .getElementById("confirmDeleteUserBtn")
    ?.addEventListener("click", () => {
      const userId = document.getElementById("deleteUserId").value;
      usersData = usersData.filter((u) => u.id != userId);

      closeModal("deleteUserModal");
      filterAndPaginateUsers();

      // showToast("Utilisateur supprimé avec succès", "success");
    });

  // Modal controls
  document
    .getElementById("closeAddUserModal")
    ?.addEventListener("click", () => {
      closeModal("addUserModal");
    });

  document.getElementById("cancelAddUserBtn")?.addEventListener("click", () => {
    closeModal("addUserModal");
  });

  document
    .getElementById("closeEditUserModal")
    ?.addEventListener("click", () => {
      closeModal("editUserModal");
    });

  document
    .getElementById("cancelEditUserBtn")
    ?.addEventListener("click", () => {
      closeModal("editUserModal");
    });

  document
    .getElementById("closeViewUserModal")
    ?.addEventListener("click", () => {
      closeModal("viewUserModal");
    });

  document
    .getElementById("closeViewUserModal2")
    ?.addEventListener("click", () => {
      closeModal("viewUserModal");
    });

  document
    .getElementById("cancelDeleteUserBtn")
    ?.addEventListener("click", () => {
      closeModal("deleteUserModal");
    });

  document
    .getElementById("editFromViewUserBtn")
    ?.addEventListener("click", () => {
      closeModal("viewUserModal");
      openEditUserModal(currentEditingUserId);
    });

  // Action buttons
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-user-btn")) {
      const userId = e.target
        .closest(".edit-user-btn")
        .getAttribute("data-user-id");
      openEditUserModal(userId);
    }

    if (e.target.closest(".delete-user-btn")) {
      const userId = e.target
        .closest(".delete-user-btn")
        .getAttribute("data-user-id");
      openDeleteUserModal(userId);
    }

    if (e.target.closest(".view-user-btn")) {
      const userId = e.target
        .closest(".view-user-btn")
        .getAttribute("data-user-id");
      openViewUserModal(userId);
    }
  });
}

// ============================================
// GESTION DES ÉVÉNEMENTS SERVICES
// ============================================

function setupServicesEvents() {
  // Filtres
  document
    .getElementById("filterServiceStatus")
    ?.addEventListener("change", filterAndPaginateServices);
  document
    .getElementById("searchServicesTable")
    ?.addEventListener("input", filterAndPaginateServices);

  // Pagination
  document.getElementById("prevServicesPage")?.addEventListener("click", () => {
    if (currentServicesPage > 1) {
      currentServicesPage--;
      renderServicesTable();
      updateServicesPagination();
    }
  });

  document.getElementById("nextServicesPage")?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredServicesData.length / servicesPerPage);
    if (currentServicesPage < totalPages) {
      currentServicesPage++;
      renderServicesTable();
      updateServicesPagination();
    }
  });

  // Items per page
  document
    .getElementById("servicesPerPage")
    ?.addEventListener("change", (e) => {
      servicesPerPage = parseInt(e.target.value);
      currentServicesPage = 1;
      filterAndPaginateServices();
    });

  // Add service button
  document.getElementById("addServiceBtn")?.addEventListener("click", () => {
    openModal("addServiceModal");
  });

  // Add service form
  document
    .getElementById("addServiceForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const equipmentText = document.getElementById(
        "addServiceEquipment"
      ).value;
      const equipment = equipmentText
        ? equipmentText
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : [];

      const newService = {
        id:
          servicesData.length > 0
            ? Math.max(...servicesData.map((s) => s.id)) + 1
            : 1,
        name: document.getElementById("addServiceName").value,
        code: document.getElementById("addServiceCode").value,
        description: document.getElementById("addServiceDescription").value,
        status: document.getElementById("addServiceStatus").value,
        createdAt: new Date().toISOString().split("T")[0],
        hospital:
          document.getElementById("addServiceHospital").value === "1"
            ? "Hôpital Central EMSI"
            : document.getElementById("addServiceHospital").value === "2"
            ? "Hôpital Ibn Sina"
            : "Clinique Al Farabi",
        chief:
          document.getElementById("addServiceChief").value === "1"
            ? "Dr. Ahmed Benani"
            : document.getElementById("addServiceChief").value === "2"
            ? "Dr. Fatima Zahra"
            : "Dr. Karim Alami",
        totalBeds: parseInt(
          document.getElementById("addServiceTotalBeds").value
        ),
        occupiedBeds: 0,
        assignedDoctors: [],
        equipment: equipment,
      };

      servicesData.unshift(newService);
      document.getElementById("addServiceForm").reset();
      closeModal("addServiceModal");
      filterAndPaginateServices();

      // showToast("Service ajouté avec succès", "success");
    });

  // Edit service form
  document
    .getElementById("editServiceForm")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const serviceId = document.getElementById("editServiceId").value;
      const serviceIndex = servicesData.findIndex((s) => s.id == serviceId);

      if (serviceIndex === -1) {
        // showToast("Service non trouvé", "error");
        return;
      }

      const equipmentText = document.getElementById(
        "editServiceEquipment"
      ).value;
      const equipment = equipmentText
        ? equipmentText
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item)
        : [];

      servicesData[serviceIndex] = {
        ...servicesData[serviceIndex],
        name: document.getElementById("editServiceName").value,
        code: document.getElementById("editServiceCode").value,
        description: document.getElementById("editServiceDescription").value,
        status: document.getElementById("editServiceStatus").value,
        hospital:
          document.getElementById("editServiceHospital").value === "1"
            ? "Hôpital Central EMSI"
            : document.getElementById("editServiceHospital").value === "2"
            ? "Hôpital Ibn Sina"
            : "Clinique Al Farabi",
        chief:
          document.getElementById("editServiceChief").value === "1"
            ? "Dr. Ahmed Benani"
            : document.getElementById("editServiceChief").value === "2"
            ? "Dr. Fatima Zahra"
            : "Dr. Karim Alami",
        totalBeds: parseInt(
          document.getElementById("editServiceTotalBeds").value
        ),
        equipment: equipment,
      };

      closeModal("editServiceModal");
      filterAndPaginateServices();

      // showToast("Service modifié avec succès", "success");
    });

  // Delete service confirmation
  document
    .getElementById("confirmDeleteServiceBtn")
    ?.addEventListener("click", () => {
      const serviceId = document.getElementById("deleteServiceId").value;
      servicesData = servicesData.filter((s) => s.id != serviceId);

      closeModal("deleteServiceModal");
      filterAndPaginateServices();

      // showToast("Service supprimé avec succès", "success");
    });

  // Modal controls
  document
    .getElementById("closeAddServiceModal")
    ?.addEventListener("click", () => {
      closeModal("addServiceModal");
    });

  document
    .getElementById("cancelAddServiceBtn")
    ?.addEventListener("click", () => {
      closeModal("addServiceModal");
    });

  document
    .getElementById("closeEditServiceModal")
    ?.addEventListener("click", () => {
      closeModal("editServiceModal");
    });

  document
    .getElementById("cancelEditServiceBtn")
    ?.addEventListener("click", () => {
      closeModal("editServiceModal");
    });

  document
    .getElementById("closeViewServiceModal")
    ?.addEventListener("click", () => {
      closeModal("viewServiceModal");
    });

  document
    .getElementById("closeViewServiceModal2")
    ?.addEventListener("click", () => {
      closeModal("viewServiceModal");
    });

  document
    .getElementById("cancelDeleteServiceBtn")
    ?.addEventListener("click", () => {
      closeModal("deleteServiceModal");
    });

  document
    .getElementById("editFromViewServiceBtn")
    ?.addEventListener("click", () => {
      closeModal("viewServiceModal");
      openEditServiceModal(currentEditingServiceId);
    });

  // Gestion de l'affectation des médecins
  document
    .getElementById("assignDoctorForm")
    ?.addEventListener("submit", handleDoctorAssignment);

  document
    .getElementById("closeAssignDoctorModal")
    ?.addEventListener("click", () => {
      closeModal("assignDoctorModal");
    });

  document
    .getElementById("cancelAssignDoctorBtn")
    ?.addEventListener("click", () => {
      closeModal("assignDoctorModal");
    });

  // Action buttons
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".assign-doctor-btn")) {
      const serviceId = e.target
        .closest(".assign-doctor-btn")
        .getAttribute("data-service-id");
      openAssignDoctorModal(serviceId);
    }

    if (e.target.closest(".edit-service-btn")) {
      const serviceId = e.target
        .closest(".edit-service-btn")
        .getAttribute("data-service-id");
      openEditServiceModal(serviceId);
    }

    if (e.target.closest(".delete-service-btn")) {
      const serviceId = e.target
        .closest(".delete-service-btn")
        .getAttribute("data-service-id");
      openDeleteServiceModal(serviceId);
    }

    if (e.target.closest(".view-service-btn")) {
      const serviceId = e.target
        .closest(".view-service-btn")
        .getAttribute("data-service-id");
      openViewServiceModal(serviceId);
    }
  });
}

// ============================================
// FONCTIONS DE BASE
// ============================================

function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  const direction = getDirectionClasses();

  [
    "left-0",
    "right-0",
    "sm:ml-64",
    "sm:mr-64",
    "border-l",
    "border-r",
    "-translate-x-full",
    "translate-x-full",
    "translate-x-0",
  ].forEach((cls) => {
    sidebar.classList.remove(cls);
    if (main) main.classList.remove(cls);
  });

  sidebar.classList.add(direction.position);
  main.classList.add(direction.margin);

  if (isMobile()) {
    sidebar.classList.add(direction.hidden);
  } else {
    sidebar.classList.add("sm:translate-x-0");
  }

  sidebar.classList.add(direction.border);
  document.documentElement.dir = isRTL() ? "rtl" : "ltr";
  sidebar.setAttribute("dir", isRTL() ? "rtl" : "ltr");
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!isMobile()) return;

  const direction = getDirectionClasses();

  if (sidebar.classList.contains(direction.hidden)) {
    sidebar.classList.remove(direction.hidden);
    sidebar.classList.add(direction.visible);
  } else {
    sidebar.classList.remove(direction.visible);
    sidebar.classList.add(direction.hidden);
  }
}

function navigateToPage(pageId) {
  if (!pages.includes(pageId)) {
    pageId = "dashboard";
  }

  window.location.hash = pageId;
  updateActiveNav(pageId);
  showPage(pageId);

  if (isMobile()) {
    const sidebar = document.getElementById("sidebar");
    const direction = getDirectionClasses();
    sidebar.classList.remove(direction.visible);
    sidebar.classList.add(direction.hidden);
  }

  feather.replace();
}

function updateActiveNav(activePage) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const page = link.getAttribute("data-page");

    link.classList.remove("text-blue-600", "bg-blue-50", "hover:bg-blue-100");
    link.querySelector("i")?.classList.remove("text-blue-600");

    link.classList.add("text-gray-900", "hover:bg-gray-100");
    link.querySelector("i")?.classList.add("text-gray-500");

    if (page === activePage) {
      link.classList.remove("text-gray-900", "hover:bg-gray-100");
      link.classList.add("text-blue-600", "bg-blue-50", "hover:bg-blue-100");

      link.querySelector("i")?.classList.remove("text-gray-500");
      link.querySelector("i")?.classList.add("text-blue-600");
    }
  });
}

function showPage(pageId) {
  document.querySelectorAll(".page-content").forEach((page) => {
    page.classList.add("hidden");
  });

  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.remove("hidden");
    targetPage.style.opacity = "0";
    setTimeout(() => {
      targetPage.style.transition = "opacity 0.3s ease";
      targetPage.style.opacity = "1";
    }, 10);
  }
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  navigateToPage(pages.includes(hash) ? hash : "dashboard");
}

// ============================================
// GESTION DE LA LANGUE
// ============================================

let isLangOpen = false;

function updateCurrentLangDisplay() {
  const currentLang = localStorage.getItem("lang") || "fr";
  const langDisplay = document.getElementById("currentLang");

  if (langDisplay) {
    switch (currentLang) {
      case "fr":
        langDisplay.textContent = "FR";
        break;
      case "en":
        langDisplay.textContent = "EN";
        break;
      case "ar":
        langDisplay.textContent = "العربية";
        break;
    }
  }
}

function updateLangPosition() {
  const isRTL = localStorage.getItem("lang") === "ar";
  const LangSelect = document.getElementById("LangSelect");

  if (LangSelect) {
    if (isRTL) {
      LangSelect.classList.remove("right-0");
      LangSelect.classList.add("left-0");
    } else {
      LangSelect.classList.remove("left-0");
      LangSelect.classList.add("right-0");
    }
  }
}

function toggleLangMenu(e) {
  e.stopPropagation();
  const LangSelect = document.getElementById("LangSelect");

  if (isLangOpen) {
    closeLangMenu();
    return;
  }

  updateLangPosition();

  const languages = [
    { name: "Français", code: "fr", flag: "../../../../assets/png/fr.png" },
    { name: "English", code: "en", flag: "../../../../assets/png/en.png" },
    { name: "العربية", code: "ar", flag: "../../../../assets/png/ma.png" },
  ];

  let buttons = "";
  const currentLang = localStorage.getItem("lang") || "fr";

  languages.forEach((lang) => {
    const isActive = lang.code === currentLang;
    buttons += `
                <button onclick="changeLang('${lang.code}')"
                    class="flex items-center justify-between w-full px-4 py-3
                           ${
                             isActive
                               ? "bg-blue-50 border-l-4 border-blue-500"
                               : "bg-white hover:bg-gray-50"
                           } 
                           transition-all duration-200">
                    <div class="flex items-center">
                        <img src="${
                          lang.flag
                        }" width="24" class="rounded-sm" alt="${lang.name}">
                        <span class="ml-3 font-medium ${
                          isActive ? "text-blue-600" : "text-gray-700"
                        }">
                            ${lang.name}
                        </span>
                    </div>
                    ${
                      isActive
                        ? '<i data-feather="check" class="w-4 h-4 text-blue-500"></i>'
                        : ""
                    }
                </button>
            `;
  });

  LangSelect.innerHTML = `
            <div class="py-2">
                <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider" data-i18n="Sélectionner la langue"></p>
                </div>
                ${buttons}
            </div>
        `;

  LangSelect.classList.remove("opacity-0", "invisible", "-translate-y-2");
  LangSelect.classList.add("opacity-100", "visible", "translate-y-0");

  isLangOpen = true;
  feather.replace();
}

function closeLangMenu() {
  const LangSelect = document.getElementById("LangSelect");
  LangSelect.innerHTML = "";
  LangSelect.classList.remove("opacity-100", "visible", "translate-y-0");
  LangSelect.classList.add("opacity-0", "invisible", "-translate-y-2");
  isLangOpen = false;
}

function changeLang(lang) {
  localStorage.setItem("lang", lang);
  updateCurrentLangDisplay();
  closeLangMenu();
  location.reload();
}

// ============================================
// GESTION DES MODALES
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => feather.replace(), 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

// AVATAR
function Avatar(user) {
  const div = document.getElementById("avatar");

  // éviter les doublons
  div.innerHTML = "";

  const img = document.createElement("img");
  img.id = "userAvatar";
  img.className = "w-full h-full object-cover";
  img.src = `https://ui-avatars.com/api/?name=${user.nom}+${user.prénom}&background=0D8ABC&color=fff&bold=true&size=128`;
  img.alt = "Admin User";

  div.appendChild(img);
}


// ============================================
// INITIALISATION
// ============================================

function init() {
  feather.replace();
  initSidebar();
  updateCurrentLangDisplay();
  updateLangPosition();
  setupEventListeners();
  
  handleHashChange();
  loadDashboardData();
  loadUsersData();
  loadServicesData();
  setupUsersEvents();
  setupServicesEvents();
  Avatar()
}

function setupEventListeners() {
  // Sidebar toggle
  document
    .getElementById("toggleSidebar")
    ?.addEventListener("click", toggleSidebar);

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.getAttribute("data-page");
      navigateToPage(pageId);
    });
  });

  // Hash change
  window.addEventListener("hashchange", handleHashChange);

  // Resize
  window.addEventListener("resize", function () {
    const sidebar = document.getElementById("sidebar");
    const direction = getDirectionClasses();

    if (isMobile()) {
      sidebar.classList.remove(direction.visible, "sm:translate-x-0");
      sidebar.classList.add(direction.hidden);
    } else {
      sidebar.classList.remove(direction.hidden, direction.visible);
      sidebar.classList.add("sm:translate-x-0");
    }
  });

  // Click outside sidebar
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");

    if (isMobile() && sidebar && toggleBtn) {
      const isClickInside = sidebar.contains(event.target);
      const isClickOnToggle = toggleBtn.contains(event.target);
      const direction = getDirectionClasses();

      if (
        !isClickInside &&
        !isClickOnToggle &&
        !sidebar.classList.contains(direction.hidden)
      ) {
        sidebar.classList.remove(direction.visible);
        sidebar.classList.add(direction.hidden);
      }
    }

    // Close language menu
    const LangToogle = document.getElementById("LangToogle");
    const LangSelect = document.getElementById("LangSelect");

    if (LangSelect && LangToogle && isLangOpen) {
      const isClickOnLang =
        LangToogle.contains(event.target) || LangSelect.contains(event.target);

      if (!isClickOnLang) {
        closeLangMenu();
      }
    }
  });

  // Language toggle
  document
    .getElementById("LangToogle")
    ?.addEventListener("click", toggleLangMenu);

  // Storage change
  window.addEventListener("storage", function (e) {
    if (e.key === "lang") {
      initSidebar();
      updateCurrentLangDisplay();
      updateLangPosition();
    }
  });

  // Close modals with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(
        ".fixed.bg-black.bg-opacity-50:not(.hidden)"
      );
      openModals.forEach((modal) => {
        const modalId = modal.id;
        if (modalId) closeModal(modalId);
      });
    }
  });

  // Close modals when clicking outside
  document
    .querySelectorAll(".fixed.bg-black.bg-opacity-50")
    .forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });
}

// ============================================
// DÉMARRAGE
// ============================================

document.addEventListener("DOMContentLoaded", init);