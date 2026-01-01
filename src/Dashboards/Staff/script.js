// ============================================
// CONFIGURATION GLOBALE
// ============================================

const pages = ["dashboard", "patients", "appointments", "doctors", "profile"];
let currentPatientsPage = 1;
let patientsPerPage = 10;
let patientsData = [];
let filteredPatientsData = [];
let appointmentsData = [];
let filteredAppointmentsData = [];
let currentAppointmentsPage = 1;
let appointmentsPerPage = 10;
let doctorsData = [];
let servicesData = [];
let appointmentRequestsData = [];
let currentEditingPatientId = null;
let currentEditingAppointmentId = null;

// URLs des API/JSON
const DATA_URLS = {
    users: "../../../data/users.json",
    appointments: "../../../data/appointments.json",
    appointmentRequests: "../../../data/appointment_requests.json",
    services: "../../../data/services.json",
    prescriptions: "../../../data/prescriptions.json"
};

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

function formatDateTime(dateString, timeString = null) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    
    if (timeString) {
        // Si c'est un format ISO avec heure
        if (dateString.includes('T')) {
            return date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
        return `${date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })} ${timeString}`;
    }
    
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function extractTimeFromISO(dateTimeISO) {
    if (!dateTimeISO) return "";
    const date = new Date(dateTimeISO);
    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function extractDateFromISO(dateTimeISO) {
    if (!dateTimeISO) return "";
    return dateTimeISO.split('T')[0];
}

function generatePatientCode(id) {
    return `PAT-${String(id).padStart(3, "0")}`;
}

function generateAppointmentCode(id) {
    return `RDV-${String(id).padStart(3, "0")}`;
}

function getStatusInfo(status) {
    const statuses = {
        confirmed: {
            text: "Confirmé",
            color: "status-confirmed",
            icon: "check-circle",
        },
        pending: {
            text: "En attente",
            color: "status-pending",
            icon: "clock",
        },
        cancelled: {
            text: "Annulé",
            color: "status-cancelled",
            icon: "x-circle",
        },
        completed: {
            text: "Terminé",
            color: "status-completed",
            icon: "check",
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
// FONCTIONS DE CHARGEMENT DES DONNÉES
// ============================================

async function loadAllData() {
    try {
        await Promise.all([
            loadUsersData(),
            loadAppointmentsData(),
            loadAppointmentRequestsData(),
            loadServicesData()
        ]);
        
        // Mettre à jour le dashboard après le chargement
        updateDashboardStats();
        
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        showToast("Erreur lors du chargement des données", "error");
    }
}

async function loadUsersData() {
    try {
        const response = await fetch(DATA_URLS.users);
        const allUsers = await response.json();
        
        // Filtrer seulement les patients
        patientsData = allUsers
            .filter(user => user.role === "patient")
            .map(patient => ({
                id: patient.userId,
                cin: patient.CIN,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phone: `+212 ${patient.phoneNumber}`,
                address: patient.address,
                birthDate: null, // Pas dans votre JSON
                gender: "male", // Par défaut
                registrationDate: patient.createdAt,
                emergencyContact: patient.emergencyContact ? 
                    `${patient.emergencyContact.firstName} ${patient.emergencyContact.lastName}` : ""
            }));

        // Extraire les médecins
        doctorsData = allUsers
            .filter(user => user.role === "doctor")
            .map(doctor => ({
                id: doctor.userId,
                name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                specialty: "Généraliste", // À adapter selon vos données
                service: "general", // À adapter
                cin: doctor.CIN,
                email: doctor.email,
                phone: `+212 ${doctor.phoneNumber}`,
                address: doctor.address
            }));

        filterAndPaginatePatients();
        
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        showToast("Erreur lors du chargement des utilisateurs", "error");
        // Données par défaut
        patientsData = [];
        doctorsData = [];
    }
}

async function loadAppointmentsData() {
    try {
        const response = await fetch(DATA_URLS.appointments);
        const appointments = await response.json();
        
        appointmentsData = appointments.map(appointment => {
            // Trouver le patient correspondant
            const patient = patientsData.find(p => p.id === appointment.patientId);
            // Trouver le médecin correspondant
            const doctor = doctorsData.find(d => d.id === appointment.doctorId);
            
            return {
                id: appointment.appointmentId,
                patientId: appointment.patientId,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${appointment.patientId}`,
                doctorId: appointment.doctorId,
                doctorName: doctor ? doctor.name : `Dr. ${appointment.doctorId}`,
                serviceId: appointment.serviceId,
                date: extractDateFromISO(appointment.appointmentDateTime),
                time: extractTimeFromISO(appointment.appointmentDateTime),
                reason: "", // Pas dans votre JSON
                status: appointment.status,
                createdAt: appointment.createdAt,
                createdBy: appointment.createdBy
            };
        });

        populateDoctorFilters();
        filterAndPaginateAppointments();
        
    } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
        showToast("Erreur lors du chargement des rendez-vous", "error");
        appointmentsData = [];
    }
}

async function loadAppointmentRequestsData() {
    try {
        const response = await fetch(DATA_URLS.appointmentRequests);
        appointmentRequestsData = await response.json();
        
    } catch (error) {
        console.error("Erreur lors du chargement des demandes:", error);
        appointmentRequestsData = [];
    }
}

async function loadServicesData() {
    try {
        const response = await fetch(DATA_URLS.services);
        servicesData = await response.json();
        
    } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        servicesData = [];
    }
}

// ============================================
// GESTION DU DASHBOARD
// ============================================

function updateDashboardStats() {
    try {
        // 1. Total des patients
        const totalPatients = patientsData.length;
        
        document.getElementById("totalPatients").textContent = totalPatients;
        
        // Calculer l'évolution des patients cette semaine
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const patientsThisWeek = patientsData.filter(patient => {
            const regDate = new Date(patient.registrationDate);
            return regDate >= oneWeekAgo;
        }).length;
        
        document.getElementById("patientsEvolution").textContent = 
            patientsThisWeek > 0 ? `+${patientsThisWeek} cette semaine` : "Aucun nouveau cette semaine";

        // 2. Rendez-vous aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointmentsData.filter(app => app.date === today);
        document.getElementById("todayAppointments").textContent = todayAppointments.length;
        
        // Détails des rendez-vous d'aujourd'hui
        const confirmedToday = todayAppointments.filter(app => app.status === 'confirmed').length;
        const pendingToday = todayAppointments.filter(app => app.status === 'pending').length;
        document.getElementById("todayAppointmentsInfo").textContent = 
            `${confirmedToday} confirmés, ${pendingToday} en attente`;

        // 3. Rendez-vous en attente (tous)
        const pendingAppointments = appointmentsData.filter(app => app.status === 'pending');
        document.getElementById("pendingAppointments").textContent = pendingAppointments.length;
        
        // 4. Rendez-vous confirmés (tous)
        const confirmedAppointments = appointmentsData.filter(app => app.status === 'confirmed');
        document.getElementById("confirmedAppointments").textContent = confirmedAppointments.length;
        
        // Rendez-vous confirmés à venir (prochains 7 jours)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingConfirmed = confirmedAppointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate <= nextWeek && appDate >= new Date();
        }).length;
        
        document.getElementById("confirmedAppointmentsInfo").textContent = 
            upcomingConfirmed > 0 ? `${upcomingConfirmed} prochains 7j` : "Confirmés";

        // Mettre à jour le chart
        updateDashboardChart();
        
    } catch (error) {
        console.error("Erreur lors de la mise à jour des statistiques:", error);
    }
}

function updateDashboardChart() {
    const appointmentsChartCtx = document.getElementById("appointmentsChart");
    if (appointmentsChartCtx && appointmentsData.length > 0) {
        const confirmedCount = appointmentsData.filter(app => app.status === 'confirmed').length;
        const pendingCount = appointmentsData.filter(app => app.status === 'pending').length;
        const cancelledCount = appointmentsData.filter(app => app.status === 'cancelled').length;
        const completedCount = appointmentsData.filter(app => app.status === 'completed').length;

        // Détruire le chart existant s'il existe
        if (window.appointmentsChart) {
            window.appointmentsChart.destroy();
        }

        window.appointmentsChart = new Chart(appointmentsChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Confirmés', 'En attente', 'Annulés', 'Terminés'],
                datasets: [{
                    data: [confirmedCount, pendingCount, cancelledCount, completedCount],
                    backgroundColor: [
                        '#10B981',
                        '#F59E0B',
                        '#EF4444',
                        '#3B82F6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    // Mettre à jour les rendez-vous à venir
    updateUpcomingAppointments();
}

function updateUpcomingAppointments() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingAppointments = appointmentsData
        .filter(app => {
            const appDate = new Date(app.date);
            return appDate >= new Date() && 
                   appDate <= nextWeek && 
                   app.status !== 'cancelled';
        })
        .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
        .slice(0, 5);

    const upcomingBody = document.getElementById("upcomingAppointmentsBody");
    if (upcomingBody) {
        if (upcomingAppointments.length === 0) {
            upcomingBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                        <i data-feather="calendar" class="w-8 h-8 mx-auto mb-2"></i>
                        <p data-i18n="Aucun rendez-vous à venir"></p>
                    </td>
                </tr>
            `;
        } else {
            upcomingBody.innerHTML = upcomingAppointments.map(appointment => {
                const statusInfo = getStatusInfo(appointment.status);
                return `
                    <tr>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${appointment.patientName}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">${appointment.doctorName}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                            ${formatDate(appointment.date)} ${appointment.time}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span class="${statusInfo.color} status-badge">
                                <i data-feather="${statusInfo.icon}" class="w-3 h-3 inline mr-1"></i>
                                ${statusInfo.text}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');
        }
        feather.replace();
    }
}

// ============================================
// GESTION DES PATIENTS
// ============================================

function filterAndPaginatePatients() {
    const searchTerm = document.getElementById("searchPatients").value.toLowerCase();

    filteredPatientsData = patientsData.filter((patient) => {
        const matchesSearch =
            !searchTerm ||
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.cin.toLowerCase().includes(searchTerm) ||
            patient.phone.toLowerCase().includes(searchTerm);

        return matchesSearch;
    });

    currentPatientsPage = 1;
    renderPatientsTable();
    updatePatientsPagination();
}

function renderPatientsTable() {
    const tbody = document.getElementById("patientsTableBody");

    const startIndex = (currentPatientsPage - 1) * patientsPerPage;
    const endIndex = Math.min(
        startIndex + patientsPerPage,
        filteredPatientsData.length
    );
    const paginatedPatients = filteredPatientsData.slice(startIndex, endIndex);

    if (paginatedPatients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i data-feather="users" class="w-12 h-12 text-gray-400 mb-4"></i>
                        <span class="text-gray-500 mb-4" data-i18n="Aucun patient trouvé"></span>
                        <button id="addFirstPatientBtn"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i data-feather="user-plus" class="w-4 h-4 inline mr-2"></i>
                            <span data-i18n="Enregistrer votre premier patient"></span>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        document.getElementById("addFirstPatientBtn")?.addEventListener("click", () => {
            openModal("addPatientModal");
        });

        updatePatientsPagination();
        feather.replace();
        return;
    }

    let html = "";
    paginatedPatients.forEach((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`;
        const genderIcon = patient.gender === "male" ? "user" : "user";
        const genderColor = patient.gender === "male" ? "text-blue-600" : "text-pink-600";

        html += `
            <tr class="patient-row" data-patient-id="${patient.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ${generatePatientCode(patient.id)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <i data-feather="${genderIcon}" class="w-4 h-4 ${genderColor}"></i>
                        </div>
                        <div>
                            <div class="font-medium text-gray-900">${fullName}</div>
                            <div class="text-sm text-gray-500">${patient.cin}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${patient.phone}</div>
                    <div class="text-sm text-gray-500">${patient.email || "-"}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(patient.registrationDate)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                        <button class="edit-patient-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" 
                                title="Modifier" data-patient-id="${patient.id}">
                            <i data-feather="edit" class="w-4 h-4"></i>
                        </button>
                        <button class="view-patient-appointments-btn p-1 text-green-600 hover:text-green-800 transition-colors"
                                title="Voir rendez-vous" data-patient-id="${patient.id}">
                            <i data-feather="calendar" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    document.getElementById("patientsStartItem").textContent = startIndex + 1;
    document.getElementById("patientsEndItem").textContent = endIndex;
    document.getElementById("patientsTotalItems").textContent = filteredPatientsData.length;

    feather.replace();
}

function updatePatientsPagination() {
    const totalPages = Math.ceil(filteredPatientsData.length / patientsPerPage);
    const prevBtn = document.getElementById("prevPatientsPage");
    const nextBtn = document.getElementById("nextPatientsPage");
    const paginationNumbers = document.getElementById("patientsPaginationNumbers");

    prevBtn.disabled = currentPatientsPage === 1;
    nextBtn.disabled = currentPatientsPage === totalPages || totalPages === 0;

    let paginationHTML = "";
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPatientsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <button class="patients-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="1">
                1
            </button>
            ${startPage > 2 ? '<span class="px-2 text-gray-500">...</span>' : ""}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="patients-page-btn px-3 py-1 border ${
                i === currentPatientsPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
            } rounded text-sm" 
                    data-page="${i}">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="px-2 text-gray-500">...</span>' : ""}
            <button class="patients-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="${totalPages}">
                ${totalPages}
            </button>
        `;
    }

    paginationNumbers.innerHTML = paginationHTML;
}

// ============================================
// GESTION DES RENDEZ-VOUS
// ============================================

function populateDoctorFilters() {
    const filterDoctor = document.getElementById("filterDoctor");
    const addAppointmentDoctor = document.getElementById("addAppointmentDoctor");
    const viewAppointmentDoctor = document.getElementById("viewAppointmentDoctor");

    if (filterDoctor) {
        filterDoctor.innerHTML = '<option value="" data-i18n="Tous les médecins">Tous les médecins</option>' +
            doctorsData.map(doctor => 
                `<option value="${doctor.id}">${doctor.name} (${doctor.specialty})</option>`
            ).join('');
    }

    if (addAppointmentDoctor) {
        addAppointmentDoctor.innerHTML = '<option value="">Sélectionnez un médecin</option>' +
            doctorsData.map(doctor => 
                `<option value="${doctor.id}">${doctor.name} (${doctor.specialty})</option>`
            ).join('');
    }

    if (viewAppointmentDoctor) {
        viewAppointmentDoctor.innerHTML = '<option value="">Sélectionnez un médecin</option>' +
            doctorsData.map(doctor => 
                `<option value="${doctor.id}">${doctor.name} (${doctor.specialty})</option>`
            ).join('');
    }
}

function filterAndPaginateAppointments() {
    const dateFilter = document.getElementById("filterDate").value;
    const statusFilter = document.getElementById("filterAppointmentStatus").value;
    const doctorFilter = document.getElementById("filterDoctor").value;

    filteredAppointmentsData = appointmentsData.filter((appointment) => {
        const matchesDate = !dateFilter || appointment.date === dateFilter;
        const matchesStatus = !statusFilter || appointment.status === statusFilter;
        const matchesDoctor = !doctorFilter || appointment.doctorId == doctorFilter;

        return matchesDate && matchesStatus && matchesDoctor;
    });

    currentAppointmentsPage = 1;
    renderAppointmentsTable();
    updateAppointmentsPagination();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById("appointmentsTableBody");

    const startIndex = (currentAppointmentsPage - 1) * appointmentsPerPage;
    const endIndex = Math.min(
        startIndex + appointmentsPerPage,
        filteredAppointmentsData.length
    );
    const paginatedAppointments = filteredAppointmentsData.slice(startIndex, endIndex);

    if (paginatedAppointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                        <i data-feather="calendar" class="w-12 h-12 text-gray-400 mb-4"></i>
                        <span class="text-gray-500 mb-4" data-i18n="Aucun rendez-vous trouvé"></span>
                        <button id="addFirstAppointmentBtn"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i data-feather="calendar" class="w-4 h-4 inline mr-2"></i>
                            <span data-i18n="Créer votre premier rendez-vous"></span>
                        </button>
                    </div>
                </td>
            </tr>
        `;

        document.getElementById("addFirstAppointmentBtn")?.addEventListener("click", () => {
            openModal("addAppointmentModal");
        });

        updateAppointmentsPagination();
        feather.replace();
        return;
    }

    let html = "";
    paginatedAppointments.forEach((appointment) => {
        const statusInfo = getStatusInfo(appointment.status);
        const dateTime = `${formatDate(appointment.date)} ${appointment.time}`;

        html += `
            <tr class="appointment-row" data-appointment-id="${appointment.id}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        ${generateAppointmentCode(appointment.id)}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-gray-900">${appointment.patientName}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">${appointment.doctorName}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${dateTime}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 max-w-xs truncate">${appointment.reason || "Consultation"}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${statusInfo.color} status-badge">
                        <i data-feather="${statusInfo.icon}" class="w-3 h-3 inline mr-1"></i>
                        ${statusInfo.text}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                        <button class="edit-appointment-btn p-1 text-blue-600 hover:text-blue-800 transition-colors" 
                                title="Modifier" data-appointment-id="${appointment.id}">
                            <i data-feather="edit" class="w-4 h-4"></i>
                        </button>
                        <button class="cancel-appointment-btn p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Annuler" data-appointment-id="${appointment.id}">
                            <i data-feather="x-circle" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    document.getElementById("appointmentsStartItem").textContent = startIndex + 1;
    document.getElementById("appointmentsEndItem").textContent = endIndex;
    document.getElementById("appointmentsTotalItems").textContent = filteredAppointmentsData.length;

    feather.replace();
}

function updateAppointmentsPagination() {
    const totalPages = Math.ceil(filteredAppointmentsData.length / appointmentsPerPage);
    const prevBtn = document.getElementById("prevAppointmentsPage");
    const nextBtn = document.getElementById("nextAppointmentsPage");
    const paginationNumbers = document.getElementById("appointmentsPaginationNumbers");

    prevBtn.disabled = currentAppointmentsPage === 1;
    nextBtn.disabled = currentAppointmentsPage === totalPages || totalPages === 0;

    let paginationHTML = "";
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentAppointmentsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <button class="appointments-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="1">
                1
            </button>
            ${startPage > 2 ? '<span class="px-2 text-gray-500">...</span>' : ""}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="appointments-page-btn px-3 py-1 border ${
                i === currentAppointmentsPage ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
            } rounded text-sm" 
                    data-page="${i}">
                ${i}
            </button>
        `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<span class="px-2 text-gray-500">...</span>' : ""}
            <button class="appointments-page-btn px-3 py-1 border border-gray-300 rounded text-sm" data-page="${totalPages}">
                ${totalPages}
            </button>
        `;
    }

    paginationNumbers.innerHTML = paginationHTML;
}

// ============================================
// GESTION DES PLANNINGS MÉDECINS
// ============================================

function isDoctorFree(doctorId, date) {
    return !appointmentsData.some(appointment => {
        return (
            appointment.doctorId === doctorId &&
            appointment.date === date &&
            appointment.status !== "cancelled"
        );
    });
}

async function loadDoctorsSchedules() {
    try {
        const filterDate = document.getElementById("filterScheduleDate").value ||
            new Date().toISOString().split("T")[0];

        document.getElementById("filterScheduleDate").value = filterDate;

        const schedulesContainer = document.getElementById("doctorsSchedule");
        schedulesContainer.innerHTML = "";

        // Filtrer les médecins disponibles pour la date sélectionnée
        const freeDoctors = doctorsData.filter(doctor =>
            isDoctorFree(doctor.id, filterDate)
        );

        if (freeDoctors.length === 0) {
            schedulesContainer.innerHTML = `
                <div class="text-center py-10 text-gray-500">
                    <i data-feather="calendar-x" class="w-10 h-10 mx-auto mb-3"></i>
                    <p data-i18n="Aucun médecin disponible à cette date">Aucun médecin disponible à cette date</p>
                </div>
            `;
            feather.replace();
            return;
        }

        freeDoctors.forEach(doctor => {
            schedulesContainer.innerHTML += `
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">
                                ${doctor.name}
                            </h3>
                            <p class="text-sm text-gray-600">${doctor.specialty}</p>
                            <p class="text-sm text-gray-500">${doctor.phone}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Disponible
                        </span>
                    </div>

                    <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-700 mb-2">Créneaux disponibles:</h4>
                        <div class="grid grid-cols-4 gap-2">
                            <span class="text-center bg-blue-50 text-blue-700 py-1 rounded">08:00-10:00</span>
                            <span class="text-center bg-blue-50 text-blue-700 py-1 rounded">10:00-12:00</span>
                            <span class="text-center bg-blue-50 text-blue-700 py-1 rounded">14:00-16:00</span>
                            <span class="text-center bg-blue-50 text-blue-700 py-1 rounded">16:00-18:00</span>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                onclick="bookAppointmentWithDoctor(${doctor.id}, '${filterDate}')">
                            <i data-feather="calendar" class="w-4 h-4 inline mr-2"></i>
                            Prendre rendez-vous
                        </button>
                    </div>
                </div>
            `;
        });

        feather.replace();

    } catch (error) {
        console.error("Erreur lors du chargement des plannings:", error);
        showToast("Erreur lors du chargement des plannings", "error");
    }
}

function bookAppointmentWithDoctor(doctorId, date) {
    // Ouvrir le modal de création de rendez-vous avec ce médecin et cette date
    openAddAppointmentModal();
    
    // Pré-remplir les champs
    setTimeout(() => {
        document.getElementById("addAppointmentDoctor").value = doctorId;
        document.getElementById("addAppointmentDate").value = date;
    }, 100);
}

// ============================================
// GESTION DES MODALES PATIENTS
// ============================================

function openAddPatientModal() {
    openModal("addPatientModal");
}

function openEditPatientModal(patientId) {
    const patient = patientsData.find(p => p.id == patientId);
    if (!patient) {
        showToast("Patient non trouvé", "error");
        return;
    }

    document.getElementById("editPatientFirstName").value = patient.firstName;
    document.getElementById("editPatientLastName").value = patient.lastName;
    document.getElementById("editPatientCIN").value = patient.cin;
    document.getElementById("editPatientEmail").value = patient.email || "";
    document.getElementById("editPatientPhone").value = patient.phone;
    document.getElementById("editPatientAddress").value = patient.address || "";
    document.getElementById("editPatientBirthDate").value = patient.birthDate || "";
    
    // Set gender radio
    const genderRadios = document.querySelectorAll('input[name="editGender"]');
    genderRadios.forEach(radio => {
        radio.checked = radio.value === patient.gender;
    });

    document.getElementById("editPatientId").value = patientId;
    currentEditingPatientId = patientId;

    openModal("editPatientModal");
}

// ============================================
// GESTION DES MODALES RENDEZ-VOUS
// ============================================

function openAddAppointmentModal() {
    // Populate patient dropdown
    const patientSelect = document.getElementById("addAppointmentPatient");
    patientSelect.innerHTML = '<option value="">Sélectionnez un patient</option>' +
        patientsData.map(patient => 
            `<option value="${patient.id}">${patient.firstName} ${patient.lastName} (${patient.cin})</option>`
        ).join('');

    // Populate time slots
    const timeSelect = document.getElementById("addAppointmentTime");
    timeSelect.innerHTML = '<option value="">Sélectionnez une heure</option>';
    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
                       "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
                       "16:00", "16:30", "17:00", "17:30"];
    
    timeSlots.forEach(time => {
        timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
    });

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("addAppointmentDate").value = today;
    document.getElementById("addAppointmentDate").min = today;

    openModal("addAppointmentModal");
}

function openEditAppointmentModal(appointmentId) {
    const appointment = appointmentsData.find(a => a.id == appointmentId);
    if (!appointment) {
        showToast("Rendez-vous non trouvé", "error");
        return;
    }

    // Populate patient dropdown
    const patientSelect = document.getElementById("viewAppointmentPatient");
    patientSelect.innerHTML = patientsData.map(patient => 
        `<option value="${patient.id}" ${patient.id === appointment.patientId ? "selected" : ""}>
            ${patient.firstName} ${patient.lastName} (${patient.cin})
        </option>`
    ).join('');

    // Populate doctor dropdown
    const doctorSelect = document.getElementById("viewAppointmentDoctor");
    doctorSelect.innerHTML = doctorsData.map(doctor => 
        `<option value="${doctor.id}" ${doctor.id === appointment.doctorId ? "selected" : ""}>
            ${doctor.name} (${doctor.specialty})
        </option>`
    ).join('');

    // Set date and time
    document.getElementById("viewAppointmentDate").value = appointment.date;
    document.getElementById("viewAppointmentTime").value = appointment.time;

    // Populate time slots
    const timeSelect = document.getElementById("viewAppointmentTime");
    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
                       "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
                       "16:00", "16:30", "17:00", "17:30"];
    
    let timeOptions = '';
    timeSlots.forEach(time => {
        timeOptions += `<option value="${time}" ${time === appointment.time ? "selected" : ""}>${time}</option>`;
    });
    timeSelect.innerHTML = timeOptions;

    // Set other fields
    document.getElementById("viewAppointmentReason").value = appointment.reason || "";
    document.getElementById("viewAppointmentStatus").value = appointment.status;
    document.getElementById("viewAppointmentId").value = appointmentId;

    currentEditingAppointmentId = appointmentId;
    openModal("viewAppointmentModal");
}

function openCancelAppointmentModal(appointmentId) {
    const appointment = appointmentsData.find(a => a.id == appointmentId);
    if (!appointment) {
        showToast("Rendez-vous non trouvé", "error");
        return;
    }

    document.getElementById("cancelAppointmentPatient").textContent = `Patient: ${appointment.patientName}`;
    document.getElementById("cancelAppointmentDoctor").textContent = `Médecin: ${appointment.doctorName}`;
    document.getElementById("cancelAppointmentDateTime").textContent = 
        `Date: ${formatDate(appointment.date)} ${appointment.time}`;
    document.getElementById("cancelAppointmentId").value = appointmentId;

    openModal("confirmCancelAppointmentModal");
}

// ============================================
// GESTION DES ÉVÉNEMENTS PATIENTS
// ============================================

function setupPatientsEvents() {
    // Search
    document.getElementById("searchPatients")?.addEventListener("input", filterAndPaginatePatients);

    // Pagination
    document.getElementById("prevPatientsPage")?.addEventListener("click", () => {
        if (currentPatientsPage > 1) {
            currentPatientsPage--;
            renderPatientsTable();
            updatePatientsPagination();
        }
    });

    document.getElementById("nextPatientsPage")?.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredPatientsData.length / patientsPerPage);
        if (currentPatientsPage < totalPages) {
            currentPatientsPage++;
            renderPatientsTable();
            updatePatientsPagination();
        }
    });

    // Items per page
    document.getElementById("patientsPerPage")?.addEventListener("change", (e) => {
        patientsPerPage = parseInt(e.target.value);
        currentPatientsPage = 1;
        filterAndPaginatePatients();
    });

    // Page numbers
    document.addEventListener("click", (e) => {
        if (e.target.closest(".patients-page-btn")) {
            const page = parseInt(e.target.closest(".patients-page-btn").getAttribute("data-page"));
            if (page && page !== currentPatientsPage) {
                currentPatientsPage = page;
                renderPatientsTable();
                updatePatientsPagination();
            }
        }

        if (e.target.closest(".appointments-page-btn")) {
            const page = parseInt(e.target.closest(".appointments-page-btn").getAttribute("data-page"));
            if (page && page !== currentAppointmentsPage) {
                currentAppointmentsPage = page;
                renderAppointmentsTable();
                updateAppointmentsPagination();
            }
        }
    });

    // Add patient button
    document.getElementById("addPatientBtn")?.addEventListener("click", openAddPatientModal);

    // Add patient form
    document.getElementById("addPatientForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newPatient = {
            id: patientsData.length > 0 ? Math.max(...patientsData.map(p => p.id)) + 1 : 1,
            cin: document.getElementById("addPatientCIN").value,
            firstName: document.getElementById("addPatientFirstName").value,
            lastName: document.getElementById("addPatientLastName").value,
            email: document.getElementById("addPatientEmail").value,
            phone: document.getElementById("addPatientPhone").value,
            address: document.getElementById("addPatientAddress").value,
            birthDate: document.getElementById("addPatientBirthDate").value,
            gender: document.querySelector('input[name="gender"]:checked')?.value || "male",
            registrationDate: new Date().toISOString().split('T')[0],
            emergencyContact: ""
        };

        patientsData.unshift(newPatient);
        document.getElementById("addPatientForm").reset();
        closeModal("addPatientModal");
        filterAndPaginatePatients();
        updateDashboardStats();

        showToast("Patient enregistré avec succès", "success");
    });

    // Edit patient form
    document.getElementById("editPatientForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const patientId = document.getElementById("editPatientId").value;
        const patientIndex = patientsData.findIndex(p => p.id == patientId);

        if (patientIndex === -1) {
            showToast("Patient non trouvé", "error");
            return;
        }

        patientsData[patientIndex] = {
            ...patientsData[patientIndex],
            firstName: document.getElementById("editPatientFirstName").value,
            lastName: document.getElementById("editPatientLastName").value,
            cin: document.getElementById("editPatientCIN").value,
            email: document.getElementById("editPatientEmail").value,
            phone: document.getElementById("editPatientPhone").value,
            address: document.getElementById("editPatientAddress").value,
            birthDate: document.getElementById("editPatientBirthDate").value,
            gender: document.querySelector('input[name="editGender"]:checked')?.value || "male"
        };

        closeModal("editPatientModal");
        filterAndPaginatePatients();

        showToast("Patient modifié avec succès", "success");
    });

    // Modal controls for patients
    document.getElementById("closeAddPatientModal")?.addEventListener("click", () => {
        closeModal("addPatientModal");
    });

    document.getElementById("cancelAddPatientBtn")?.addEventListener("click", () => {
        closeModal("addPatientModal");
    });

    document.getElementById("closeEditPatientModal")?.addEventListener("click", () => {
        closeModal("editPatientModal");
    });

    document.getElementById("cancelEditPatientBtn")?.addEventListener("click", () => {
        closeModal("editPatientModal");
    });

    // Action buttons
    document.addEventListener("click", (e) => {
        if (e.target.closest(".edit-patient-btn")) {
            const patientId = e.target.closest(".edit-patient-btn").getAttribute("data-patient-id");
            openEditPatientModal(patientId);
        }

        if (e.target.closest(".view-patient-appointments-btn")) {
            const patientId = e.target.closest(".view-patient-appointments-btn").getAttribute("data-patient-id");
            // Navigate to appointments page with filter
            navigateToPage("appointments");
            setTimeout(() => {
                const patient = patientsData.find(p => p.id == patientId);
                if (patient) {
                    showToast(`Voir les rendez-vous de ${patient.firstName} ${patient.lastName}`, "info");
                }
            }, 100);
        }
    });
}

// ============================================
// GESTION DES ÉVÉNEMENTS RENDEZ-VOUS
// ============================================

function setupAppointmentsEvents() {
    // Filters
    document.getElementById("filterDate")?.addEventListener("change", filterAndPaginateAppointments);
    document.getElementById("filterAppointmentStatus")?.addEventListener("change", filterAndPaginateAppointments);
    document.getElementById("filterDoctor")?.addEventListener("change", filterAndPaginateAppointments);

    // Pagination
    document.getElementById("prevAppointmentsPage")?.addEventListener("click", () => {
        if (currentAppointmentsPage > 1) {
            currentAppointmentsPage--;
            renderAppointmentsTable();
            updateAppointmentsPagination();
        }
    });

    document.getElementById("nextAppointmentsPage")?.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredAppointmentsData.length / appointmentsPerPage);
        if (currentAppointmentsPage < totalPages) {
            currentAppointmentsPage++;
            renderAppointmentsTable();
            updateAppointmentsPagination();
        }
    });

    // Items per page
    document.getElementById("appointmentsPerPage")?.addEventListener("change", (e) => {
        appointmentsPerPage = parseInt(e.target.value);
        currentAppointmentsPage = 1;
        filterAndPaginateAppointments();
    });

    // Add appointment button
    document.getElementById("addAppointmentBtn")?.addEventListener("click", openAddAppointmentModal);

    // Add appointment form
    document.getElementById("addAppointmentForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const patientId = document.getElementById("addAppointmentPatient").value;
        const doctorId = document.getElementById("addAppointmentDoctor").value;
        const patient = patientsData.find(p => p.id == patientId);
        const doctor = doctorsData.find(d => d.id == doctorId);

        if (!patient || !doctor) {
            showToast("Patient ou médecin non valide", "error");
            return;
        }

        const newAppointment = {
            id: appointmentsData.length > 0 ? Math.max(...appointmentsData.map(a => a.id)) + 1 : 1,
            patientId: parseInt(patientId),
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorId: parseInt(doctorId),
            doctorName: doctor.name,
            date: document.getElementById("addAppointmentDate").value,
            time: document.getElementById("addAppointmentTime").value,
            reason: document.getElementById("addAppointmentReason").value,
            status: document.getElementById("addAppointmentStatus").value,
            createdAt: new Date().toISOString().split('T')[0],
            createdBy: "staff"
        };

        appointmentsData.unshift(newAppointment);
        document.getElementById("addAppointmentForm").reset();
        closeModal("addAppointmentModal");
        filterAndPaginateAppointments();
        updateDashboardStats();

        showToast("Rendez-vous créé avec succès", "success");
    });

    // View/Edit appointment form
    document.getElementById("viewAppointmentForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const appointmentId = document.getElementById("viewAppointmentId").value;
        const appointmentIndex = appointmentsData.findIndex(a => a.id == appointmentId);

        if (appointmentIndex === -1) {
            showToast("Rendez-vous non trouvé", "error");
            return;
        }

        const patientId = document.getElementById("viewAppointmentPatient").value;
        const doctorId = document.getElementById("viewAppointmentDoctor").value;
        const patient = patientsData.find(p => p.id == patientId);
        const doctor = doctorsData.find(d => d.id == doctorId);

        appointmentsData[appointmentIndex] = {
            ...appointmentsData[appointmentIndex],
            patientId: parseInt(patientId),
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : appointmentsData[appointmentIndex].patientName,
            doctorId: parseInt(doctorId),
            doctorName: doctor ? doctor.name : appointmentsData[appointmentIndex].doctorName,
            date: document.getElementById("viewAppointmentDate").value,
            time: document.getElementById("viewAppointmentTime").value,
            reason: document.getElementById("viewAppointmentReason").value,
            status: document.getElementById("viewAppointmentStatus").value
        };

        closeModal("viewAppointmentModal");
        filterAndPaginateAppointments();
        updateDashboardStats();

        showToast("Rendez-vous modifié avec succès", "success");
    });

    // Cancel appointment
    document.getElementById("cancelAppointmentBtn")?.addEventListener("click", () => {
        const appointmentId = document.getElementById("viewAppointmentId").value;
        closeModal("viewAppointmentModal");
        openCancelAppointmentModal(appointmentId);
    });

    document.getElementById("confirmCancelAppointmentBtn")?.addEventListener("click", () => {
        const appointmentId = document.getElementById("cancelAppointmentId").value;
        const cancelReason = document.getElementById("cancelReason").value;
        const appointmentIndex = appointmentsData.findIndex(a => a.id == appointmentId);

        if (appointmentIndex !== -1) {
            appointmentsData[appointmentIndex] = {
                ...appointmentsData[appointmentIndex],
                status: "cancelled",
                cancelledBy: "staff",
                cancelReason: cancelReason
            };
        }

        closeModal("confirmCancelAppointmentModal");
        filterAndPaginateAppointments();
        updateDashboardStats();

        showToast("Rendez-vous annulé avec succès", "success");
    });

    // Modal controls for appointments
    document.getElementById("closeAddAppointmentModal")?.addEventListener("click", () => {
        closeModal("addAppointmentModal");
    });

    document.getElementById("cancelAddAppointmentBtn")?.addEventListener("click", () => {
        closeModal("addAppointmentModal");
    });

    document.getElementById("closeViewAppointmentModal")?.addEventListener("click", () => {
        closeModal("viewAppointmentModal");
    });

    document.getElementById("closeViewAppointmentModal2")?.addEventListener("click", () => {
        closeModal("viewAppointmentModal");
    });

    document.getElementById("dismissCancelAppointmentBtn")?.addEventListener("click", () => {
        closeModal("confirmCancelAppointmentModal");
    });

    // Action buttons
    document.addEventListener("click", (e) => {
        if (e.target.closest(".edit-appointment-btn")) {
            const appointmentId = e.target.closest(".edit-appointment-btn").getAttribute("data-appointment-id");
            openEditAppointmentModal(appointmentId);
        }

        if (e.target.closest(".cancel-appointment-btn")) {
            const appointmentId = e.target.closest(".cancel-appointment-btn").getAttribute("data-appointment-id");
            openCancelAppointmentModal(appointmentId);
        }
    });
}

// ============================================
// GESTION DES ÉVÉNEMENTS PLANNINGS
// ============================================

function setupDoctorsEvents() {
    // Service filter
    document.getElementById("filterService")?.addEventListener("change", loadDoctorsSchedules);
    
    // Date filter
    document.getElementById("filterScheduleDate")?.addEventListener("change", loadDoctorsSchedules);
}

// ============================================
// GESTION DU PROFIL
// ============================================

function setupProfileEvents() {
    document.getElementById("profileForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        showToast("Profil mis à jour avec succès", "success");
    });

    document.getElementById("cancelProfileBtn")?.addEventListener("click", () => {
        document.getElementById("profileForm").reset();
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

    // Charger les données spécifiques à la page
    switch (pageId) {
        case "dashboard":
            updateDashboardStats();
            break;
        case "patients":
            filterAndPaginatePatients();
            break;
        case "appointments":
            filterAndPaginateAppointments();
            break;
        case "doctors":
            loadDoctorsSchedules();
            break;
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
                       ${isActive ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white hover:bg-gray-50"} 
                       transition-all duration-200">
                <div class="flex items-center">
                    <img src="${lang.flag}" width="24" class="rounded-sm" alt="${lang.name}">
                    <span class="ml-3 font-medium ${isActive ? "text-blue-600" : "text-gray-700"}">
                        ${lang.name}
                    </span>
                </div>
                ${isActive ? '<i data-feather="check" class="w-4 h-4 text-blue-500"></i>' : ""}
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

function Avatar() {
    const div = document.getElementById("avatar");
    div.innerHTML = "";

    const img = document.createElement("img");
    img.id = "userAvatar";
    img.className = "w-full h-full object-cover";
    img.src = `https://ui-avatars.com/api/?name=Staff+User&background=0D8ABC&color=fff&bold=true&size=128`;
    img.alt = "Staff User";

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
    
    // Charger toutes les données
    loadAllData().then(() => {
        handleHashChange();
    });
    
    setupPatientsEvents();
    setupAppointmentsEvents();
    setupDoctorsEvents();
    setupProfileEvents();
    Avatar();
}

function setupEventListeners() {
    // Sidebar toggle
    document.getElementById("toggleSidebar")?.addEventListener("click", toggleSidebar);

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

            if (!isClickInside && !isClickOnToggle && !sidebar.classList.contains(direction.hidden)) {
                sidebar.classList.remove(direction.visible);
                sidebar.classList.add(direction.hidden);
            }
        }

        // Close language menu
        const LangToogle = document.getElementById("LangToogle");
        const LangSelect = document.getElementById("LangSelect");

        if (LangSelect && LangToogle && isLangOpen) {
            const isClickOnLang = LangToogle.contains(event.target) || LangSelect.contains(event.target);

            if (!isClickOnLang) {
                closeLangMenu();
            }
        }
    });

    // Language toggle
    document.getElementById("LangToogle")?.addEventListener("click", toggleLangMenu);

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
            const openModals = document.querySelectorAll(".fixed.bg-black.bg-opacity-50:not(.hidden)");
            openModals.forEach((modal) => {
                const modalId = modal.id;
                if (modalId) closeModal(modalId);
            });
        }
    });

    // Close modals when clicking outside
    document.querySelectorAll(".fixed.bg-black.bg-opacity-50").forEach((modal) => {
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