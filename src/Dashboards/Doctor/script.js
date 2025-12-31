
        // ============================================
        // CONFIGURATION ET DONNÉES
        // ============================================

        const pages = ['dashboard', 'patients', 'rendezvous', 'consultations', 'profile'];

        // Données statiques pour la démonstration
        const demoData = {
            doctorId: 1,
            doctor: {
                nom: "Martin",
                prenom: "Sophie",
                specialite: "Médecin Généraliste",
                email: "dr.sophie.martin@emsihealth.com",
                telephone: "+212 611-223344",
                licence: "MED123456",
                adresse: "123 Avenue Mohammed V, Casablanca",
                bio: "Médecin généraliste avec 10 ans d'expérience. Spécialisée en médecine familiale et suivi des maladies chroniques."
            },
            patients: [
                { id: 1, nom: "Dupont", prenom: "Jean", age: 45, sexe: "M", telephone: "+212 611-223344", derniereVisite: "2024-01-15", prochainRdv: "2024-02-20" },
                { id: 2, nom: "Martin", prenom: "Sophie", age: 32, sexe: "F", telephone: "+212 622-334455", derniereVisite: "2024-01-10", prochainRdv: "2024-02-18" },
                { id: 3, nom: "Bernard", prenom: "Pierre", age: 58, sexe: "M", telephone: "+212 633-445566", derniereVisite: "2024-01-05", prochainRdv: "2024-02-22" },
                { id: 4, nom: "Petit", prenom: "Marie", age: 28, sexe: "F", telephone: "+212 644-556677", derniereVisite: "2023-12-20", prochainRdv: "2024-02-25" },
                { id: 5, nom: "Durand", prenom: "Luc", age: 65, sexe: "M", telephone: "+212 655-667788", derniereVisite: "2023-12-15", prochainRdv: "2024-02-28" }
            ],
            appointments: [
                { appointmentId: 1, patientId: 1, doctorId: 1, serviceId: 1, appointmentDateTime: "2024-01-20T09:00", patient: "Jean Dupont", motif: "Consultation générale", status: "confirmed", createdBy: "patient", createdAt: "2024-01-10" },
                { appointmentId: 2, patientId: 2, doctorId: 1, serviceId: 2, appointmentDateTime: "2024-01-20T10:30", patient: "Sophie Martin", motif: "Suivi de traitement", status: "pending", createdBy: "staff", createdAt: "2024-01-12" },
                { appointmentId: 3, patientId: 3, doctorId: 1, serviceId: 1, appointmentDateTime: "2024-01-20T14:00", patient: "Pierre Bernard", motif: "Contrôle annuel", status: "confirmed", createdBy: "patient", createdAt: "2024-01-05" },
                { appointmentId: 4, patientId: 4, doctorId: 1, serviceId: 3, appointmentDateTime: "2024-01-21T11:00", patient: "Marie Petit", motif: "Première consultation", status: "pending", createdBy: "staff", createdAt: "2024-01-15" },
                { appointmentId: 5, patientId: 5, doctorId: 1, serviceId: 2, appointmentDateTime: "2024-01-21T15:30", patient: "Luc Durand", motif: "Consultation spécialisée", status: "cancelled", createdBy: "patient", createdAt: "2024-01-08" }
            ],
            appointmentRequests: [
                { requestId: 1, appointmentId: 5, patientId: 5, requestType: "cancel", requestedDateTime: null, status: "approved", createdAt: "2024-01-09" }
            ],
            consultations: [
                { consultationId: 1, patientId: 1, doctorId: 1, date: "2024-01-15", type: "Consultation générale", diagnostic: "Hypertension artérielle", traitement: "Traitement antihypertenseur", notes: "Patient à surveiller régulièrement" },
                { consultationId: 2, patientId: 2, doctorId: 1, date: "2024-01-10", type: "Suivi de grossesse", diagnostic: "Grossesse normale 24 SA", traitement: "Suppléments vitaminiques", notes: "Échographie programmée dans 4 semaines" },
                { consultationId: 3, patientId: 3, doctorId: 1, date: "2024-01-05", type: "Contrôle diabète", diagnostic: "Diabète type 2 équilibré", traitement: "Continuation traitement", notes: "Glycémie bien contrôlée" }
            ],
            medicalNotes: [
                { noteId: 1, appointmentId: 1, doctorId: 1, patientId: 1, notesText: "Patient présentant une tension artérielle élevée. Recommandation: réduire la consommation de sel et faire de l'exercice régulièrement.", createdAt: "2024-01-15" },
                { noteId: 2, appointmentId: 2, doctorId: 1, patientId: 2, notesText: "Grossesse évoluant normalement. Compléments vitaminiques prescrits. Prochain contrôle dans 4 semaines.", createdAt: "2024-01-10" }
            ],
            prescriptions: [
                {
                    prescriptionId: 1,
                    appointmentId: 1,
                    doctorId: 1,
                    patientId: 1,
                    medicineList: [
                        { medicineName: "Amlodipine", dosage: "5mg", frequency: "1 fois par jour", duration: "30 jours" },
                        { medicineName: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "1 fois par jour", duration: "30 jours" }
                    ],
                    note: "Prendre le matin après le petit déjeuner. Contrôle de la tension dans 15 jours.",
                    createdAt: "2024-01-15"
                },
                {
                    prescriptionId: 2,
                    appointmentId: 2,
                    doctorId: 1,
                    patientId: 2,
                    medicineList: [
                        { medicineName: "Acide folique", dosage: "400μg", frequency: "1 fois par jour", duration: "90 jours" },
                        { medicineName: "Fer", dosage: "30mg", frequency: "1 fois par jour", duration: "90 jours" }
                    ],
                    note: "Compléments vitaminiques pour la grossesse.",
                    createdAt: "2024-01-10"
                }
            ]
        };

        // ============================================
        // FONCTIONS UTILITAIRES
        // ============================================

        function isMobile() {
            return window.innerWidth < 1024;
        }

        function isRTL() {
            return localStorage.getItem('lang') === 'ar';
        }

        function getDirectionClasses() {
            if (isRTL()) {
                return {
                    hidden: 'translate-x-full',
                    visible: 'translate-x-0',
                    position: 'right-0',
                    margin: 'sm:mr-64',
                    border: 'border-l'
                };
            } else {
                return {
                    hidden: '-translate-x-full',
                    visible: 'translate-x-0',
                    position: 'left-0',
                    margin: 'sm:ml-64',
                    border: 'border-r'
                };
            }
        }

        function formatDate(dateString) {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

 function formatDateTime(dateTimeString) {
    if (!dateTimeString) return "N/A";

    const date = new Date(dateTimeString);
    const currentLang = localStorage.getItem("lang") || 'fr';

    let locale, separator;

    if (currentLang === 'ar') {
        locale = 'ar-EG'; // mois en arabe, chiffres occidentaux
        separator = ' الساعة ';
    } else if (currentLang === 'fr') {
        locale = 'fr-FR';
        separator = ' à ';
    } else {
        locale = 'en-US';
        separator = ' at ';
    }

    const formattedDate = date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: '2-digit' });
    const formattedTime = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

    return `${formattedDate}${separator}${formattedTime}`;
}

        function showModal(modalId) {
            const modal = document.getElementById(`${modalId}Modal`);
            if (modal) {
                modal.style.display = 'grid';
                setTimeout(() => {
                    modal.classList.add('modal-animation');
                }, 10);

                // Mettre à jour les icônes
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }

        function closeModal(modalId) {
            const modal = document.getElementById(`${modalId}Modal`);
            if (modal) {
                modal.classList.remove('modal-animation');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        }



        // ============================================
        // GESTION DU SIDEBAR
        // ============================================

        function initSidebar() {
            const sidebar = document.getElementById('sidebar');
            const main = document.getElementById('main');
            const direction = getDirectionClasses();

            ['left-0', 'right-0', 'sm:ml-64', 'sm:mr-64', 'border-l', 'border-r',
                '-translate-x-full', 'translate-x-full', 'translate-x-0'].forEach(cls => {
                    sidebar.classList.remove(cls);
                    if (main) main.classList.remove(cls);
                });

            sidebar.classList.add(direction.position);
            main.classList.add(direction.margin);

            if (isMobile()) {
                sidebar.classList.add(direction.hidden);
            } else {
                sidebar.classList.add('sm:translate-x-0');
            }

            sidebar.classList.add(direction.border);
            document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
            sidebar.setAttribute('dir', isRTL() ? 'rtl' : 'ltr');
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
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

        // ============================================
        // GESTION DE LA NAVIGATION
        // ============================================

        function navigateToPage(pageId) {
            if (!pages.includes(pageId)) {
                pageId = 'dashboard';
            }

            window.location.hash = pageId;
            updateActiveNav(pageId);
            showPage(pageId);

            if (isMobile()) {
                const sidebar = document.getElementById('sidebar');
                const direction = getDirectionClasses();
                sidebar.classList.remove(direction.visible);
                sidebar.classList.add(direction.hidden);
            }

            loadPageData(pageId);

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function updateActiveNav(activePage) {
            document.querySelectorAll('.nav-link').forEach(link => {
                const page = link.getAttribute('data-page');

                link.classList.remove('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100');
                link.querySelector('i')?.classList.remove('text-blue-600');

                link.classList.add('text-gray-900', 'hover:bg-gray-100');
                link.querySelector('i')?.classList.add('text-gray-500');

                if (page === activePage) {
                    link.classList.remove('text-gray-900', 'hover:bg-gray-100');
                    link.classList.add('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100');

                    link.querySelector('i')?.classList.remove('text-gray-500');
                    link.querySelector('i')?.classList.add('text-blue-600');
                }
            });
        }

        function showPage(pageId) {
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.add('hidden');
            });

            const targetPage = document.getElementById(`page-${pageId}`);
            if (targetPage) {
                targetPage.classList.remove('hidden');
                targetPage.style.opacity = '0';
                setTimeout(() => {
                    targetPage.style.transition = 'opacity 0.3s ease';
                    targetPage.style.opacity = '1';
                }, 10);
            }
        }

        function loadPageData(pageId) {
            switch (pageId) {
                case 'dashboard':
                    loadDashboardData();
                    break;
                case 'patients':
                    loadPatientsList();
                    break;
                case 'rendezvous':
                    loadAppointmentsList();
                    loadPatientsForAppointment();
                    manageAppointmentFormVisibility();
                    break;
                case 'consultations':
                    loadConsultationsList();
                    break;
                case 'profile':
                    break;
            }
        }

        function manageAppointmentFormVisibility() {
            if (isMobile()) {
                document.getElementById('appointment-sidebar').classList.add('hidden');
            } else {
                document.getElementById('appointment-sidebar').classList.remove('hidden');
            }
        }

        function handleHashChange() {
            const hash = window.location.hash.substring(1);
            navigateToPage(pages.includes(hash) ? hash : 'dashboard');
        }

        // ============================================
        // GESTION DES DONNÉES
        // ============================================

        function loadDashboardData() {
            const today = new Date().toISOString().split('T')[0];
            const todayPatients = demoData.patients.filter(p =>
                p.derniereVisite === today || p.prochainRdv === today
            ).length;

            const upcomingAppointments = demoData.appointments.filter(a =>
                new Date(a.appointmentDateTime) >= new Date() && a.status !== 'cancelled'
            ).length;

            const weeklyConsultations = demoData.consultations.filter(c => {
                const consultDate = new Date(c.date);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return consultDate >= oneWeekAgo;
            }).length;

            document.getElementById('today-patients').textContent = todayPatients;
            document.getElementById('upcoming-appointments').textContent = upcomingAppointments;
            document.getElementById('weekly-consultations').textContent = weeklyConsultations;
            document.getElementById('availability').textContent = '85%';

            loadTodayAppointments();
        }

        function loadTodayAppointments() {
            const today = new Date().toISOString().split('T')[0];
            const todayAppointments = demoData.appointments.filter(a =>
                a.appointmentDateTime.startsWith(today)
            );

            const tbody = document.getElementById('today-appointments-list');
            tbody.innerHTML = '';

            todayAppointments.forEach(appointment => {
                const tr = document.createElement('tr');
                const date = new Date(appointment.appointmentDateTime);
                const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                let statusClass, statusText;
                switch (appointment.status) {
                    case 'confirmed':
                        statusClass = 'status-confirmed';
                        statusText = t('sir thwa');
                        break;
                    case 'pending':
                        statusClass = 'status-pending';
                        statusText = t('En attente');
                        break;
                    case 'cancelled':
                        statusClass = 'status-cancelled';
                        statusText = t('Annulé');
                        data = "Annulé";
                        break;
                }

                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${time}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${appointment.patient}</td>
                    <td class="px-6 py-4">${appointment.motif}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded-full ${statusClass}" data-i18n=${data}>
                            ${statusText}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="confirmAppointment(${appointment.appointmentId})" class="text-green-600 hover:text-green-800 transition-colors mx-1" title="Confirmer">
                            <i data-feather="check" class="w-4 h-4"></i>
                        </button>
                        <button onclick="cancelAppointment(${appointment.appointmentId})" class="text-red-600 hover:text-red-800 transition-colors mx-1" title="Annuler">
                            <i data-feather="x" class="w-4 h-4"></i>
                        </button>
                        <button onclick="viewPatientDetails(${appointment.patientId})" class="text-blue-600 hover:text-blue-800 transition-colors mx-1" title="Voir patient">
                            <i data-feather="eye" class="w-4 h-4"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function loadPatientsList() {
            const tbody = document.getElementById('patients-list');
            tbody.innerHTML = '';

            demoData.patients.forEach(patient => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${patient.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${patient.nom} ${patient.prenom}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${patient.age} ans</td>
                    <td class="px-6 py-4 whitespace-nowrap">${formatDate(patient.derniereVisite)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${formatDate(patient.prochainRdv)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex space-x-2">
                            <button onclick="viewPatientDetails(${patient.id})" 
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                title="Voir détails">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                            <button onclick="createPrescription(${patient.id})" 
                                class="text-green-600 hover:text-green-800 transition-colors p-1"
                                title="Créer prescription">
                                <i data-feather="file-text" class="w-4 h-4"></i>
                            </button>
                            <button onclick="viewMedicalNotes(${patient.id})" 
                                class="text-purple-600 hover:text-purple-800 transition-colors p-1"
                                title="Notes médicales">
                                <i data-feather="clipboard" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function loadAppointmentsList() {
            const tbody = document.getElementById('appointments-list');
            tbody.innerHTML = '';

            const sortedAppointments = [...demoData.appointments].sort((a, b) =>
                new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
            );

            sortedAppointments.forEach(appointment => {
                const tr = document.createElement('tr');

                let statusClass, statusText;
                switch (appointment.status) {
                    case 'confirmed':
                        statusClass = 'status-confirmed';
                        statusText = 'Confirmé';
                        break;
                    case 'pending':
                        statusClass = 'status-pending';
                        statusText = 'En_attente';
                        break;
                    case 'cancelled':
                        statusClass = 'status-cancelled';
                        statusText = 'Annulé';
                        break;
                }

                tr.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap">${formatDateTime(appointment.appointmentDateTime)}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${appointment.patient}</td>
                    <td class="px-4 py-3">${appointment.motif}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs rounded-full ${statusClass}" data-i18n=${statusText}>
                            
                        </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex space-x-2">
                            ${appointment.status === 'pending' ? `
                            <button onclick="confirmAppointment(${appointment.appointmentId})" 
                                class="text-green-600 hover:text-green-800 transition-colors p-1"
                                title="Confirmer">
                                <i data-feather="check" class="w-4 h-4"></i>
                            </button>
                            ` : ''}
                            ${appointment.status !== 'cancelled' ? `
                            <button onclick="cancelAppointment(${appointment.appointmentId})" 
                                class="text-red-600 hover:text-red-800 transition-colors p-1"
                                title="Annuler">
                                <i data-feather="x" class="w-4 h-4"></i>
                            </button>
                            ` : ''}
                            <button onclick="viewPatientDetails(${appointment.patientId})" 
                                class="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                title="Voir patient">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function loadPatientsForAppointment() {
            const select = document.getElementById('appointment-patient');
            const mobileSelect = document.getElementById('mobile-appointment-patient');
            const consultationSelect = document.getElementById('consultation-patient');

            select.innerHTML = '<option value="" data-i18n="Sélectionner un patient"></option>';
            mobileSelect.innerHTML = '<option value="" data-i18n="Sélectionner un patient"></option>';
            consultationSelect.innerHTML = '<option value="" data-i18n="Sélectionner un patient"></option>';

            demoData.patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.nom} ${patient.prenom}`;
                select.appendChild(option.cloneNode(true));
                mobileSelect.appendChild(option.cloneNode(true));
                consultationSelect.appendChild(option.cloneNode(true));
            });
        }

        function loadConsultationsList() {
            const container = document.getElementById('consultations-list');
            container.innerHTML = '';

            demoData.consultations.forEach(consultation => {
                const patient = demoData.patients.find(p => p.id === consultation.patientId);

                const div = document.createElement('div');
                div.className = 'border border-gray-200 rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors';

                div.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-semibold">${patient ? `${patient.nom} ${patient.prenom}` : 'Patient inconnu'}</h4>
                            <p class="text-sm text-gray-500">${formatDate(consultation.date)} • ${consultation.type}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="createPrescription(${consultation.patientId}, ${consultation.consultationId})" 
                                class="text-green-600 hover:text-green-800 transition-colors"
                                title="Créer prescription">
                                <i data-feather="file-text" class="w-4 h-4"></i>
                            </button>
                            <button onclick="viewConsultationDetails(${consultation.consultationId})" 
                                class="text-blue-600 hover:text-blue-800 transition-colors"
                                title="Voir détails">
                                <i data-feather="eye" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    <div class="text-sm">
                        <p class="mb-1"><strong data-i18n='Diagnostic'></strong> ${consultation.diagnostic}</p>
                        <p><strong data-i18n='Traitement'></strong> ${consultation.traitement}</p>
                    </div>
                `;
                container.appendChild(div);
            });

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        // ============================================
        // GESTION DES RENDEZ-VOUS
        // ============================================

        function confirmAppointment(appointmentId) {
            const appointment = demoData.appointments.find(a => a.appointmentId === appointmentId);
            if (appointment) {
                appointment.status = 'confirmed';

                Swal.fire({
                    icon: 'success',
                    title: 'Rendez-vous confirmé',
                    text: 'Le rendez-vous a été confirmé avec succès',
                    timer: 2000,
                    showConfirmButton: false
                });

                loadTodayAppointments();
                loadAppointmentsList();
            }
        }

        function cancelAppointment(appointmentId) {
            Swal.fire({
                title: 'Confirmer l\'annulation',
                text: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Oui, annuler',
                cancelButtonText: 'Non'
            }).then((result) => {
                if (result.isConfirmed) {
                    const appointment = demoData.appointments.find(a => a.appointmentId === appointmentId);
                    if (appointment) {
                        appointment.status = 'cancelled';

                        const newRequest = {
                            requestId: demoData.appointmentRequests.length + 1,
                            appointmentId: appointmentId,
                            patientId: appointment.patientId,
                            requestType: 'cancel',
                            requestedDateTime: null,
                            status: 'approved',
                            createdAt: new Date().toISOString().split('T')[0]
                        };
                        demoData.appointmentRequests.push(newRequest);

                        Swal.fire({
                            icon: 'success',
                            title: 'Rendez-vous annulé',
                            text: 'Le rendez-vous a été annulé avec succès',
                            timer: 2000,
                            showConfirmButton: false
                        });

                        loadTodayAppointments();
                        loadAppointmentsList();
                    }
                }
            });
        }

        // ============================================
        // GESTION DES PATIENTS (MODAL)
        // ============================================

        function viewPatientDetails(patientId) {
            const patient = demoData.patients.find(p => p.id === patientId);
            if (!patient) return;

            // Mettre à jour les informations du modal
            document.getElementById('patient-details-name').textContent = `${patient.nom} ${patient.prenom}`;
            document.getElementById('patient-details-age-gender').textContent =
                `${patient.age} ans • ${patient.sexe === 'M' ? t('Homme') : t('Femme')}`;
            document.getElementById('patient-details-phone').textContent = patient.telephone;
            document.getElementById('patient-details-last-visit').textContent = formatDate(patient.derniereVisite);
            document.getElementById('patient-details-next-appointment').textContent = formatDate(patient.prochainRdv);
            document.getElementById('patient-details-id').value = patientId;

            // Charger l'historique médical
            const medicalHistoryContainer = document.getElementById('patient-details-medical-history');
            medicalHistoryContainer.innerHTML = '';

            const patientConsultations = demoData.consultations.filter(c => c.patientId === patientId);
            if (patientConsultations.length > 0) {
                patientConsultations.forEach(consultation => {
                    const consultationDiv = document.createElement('div');
                    consultationDiv.className = 'bg-gray-50 p-3 rounded';
                    consultationDiv.innerHTML = `
                        <div class="flex justify-between">
                            <span class="font-medium">${consultation.type}</span>
                            <span class="text-sm text-gray-500">${formatDate(consultation.date)}</span>
                        </div>
                        <p class="text-sm mt-1">${consultation.diagnostic}</p>
                    `;
                    medicalHistoryContainer.appendChild(consultationDiv);
                });
            } else {
                medicalHistoryContainer.innerHTML = `<p class="text-gray-500 text-center py-4">patient.no_consultations</p>`;
            }

            // Charger les prescriptions
            const prescriptionsContainer = document.getElementById('patient-details-prescriptions');
            prescriptionsContainer.innerHTML = '';

            const patientPrescriptions = demoData.prescriptions.filter(p => p.patientId === patientId);
            if (patientPrescriptions.length > 0) {
                patientPrescriptions.forEach(prescription => {
                    const prescriptionDiv = document.createElement('div');
                    prescriptionDiv.className = 'bg-green-50 p-3 rounded border border-green-100';
                    prescriptionDiv.innerHTML = `
                        <div class="flex justify-between items-start">
                            <span class="font-medium">${t("Prescription")} #${prescription.prescriptionId}</span>
                            <span class="text-sm text-gray-500">${formatDate(prescription.createdAt)}</span>
                        </div>
                        <p class="text-sm mt-1">
                            ${prescription.medicineList.map(m => `${m.medicineName} (${m.dosage})`).join(', ')}
                        </p>
                        ${prescription.note ? `<p class="text-sm mt-2 text-gray-600">${prescription.note}</p>` : ''}
                    `;
                    prescriptionsContainer.appendChild(prescriptionDiv);
                });
            } else {
                prescriptionsContainer.innerHTML = `<p class="text-gray-500 text-center py-4">${t("Aucune prescription enregistrée")}</p>`;
            }

            // Configurer les boutons d'action
            const createPrescriptionBtn = document.getElementById('create-prescription-from-modal');
            createPrescriptionBtn.onclick = () => createPrescription(patientId);

            const viewMedicalNotesBtn = document.getElementById('view-medical-notes');
            viewMedicalNotesBtn.onclick = () => viewMedicalNotes(patientId);

            // Afficher le modal
            showModal('patientDetails');

            // Mettre à jour les icônes
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function viewMedicalNotes(patientId) {
            const patient = demoData.patients.find(p => p.id === patientId);
            if (!patient) return;

            const notes = demoData.medicalNotes.filter(n => n.patientId === patientId);

            const container = document.getElementById('medical-notes-container');
            container.innerHTML = '';

            if (notes.length > 0) {
                notes.forEach(note => {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'bg-gray-50 p-4 rounded-lg';
                    noteDiv.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-medium">Note #${note.noteId}</span>
                            <span class="text-sm text-gray-500">${formatDate(note.createdAt)}</span>
                        </div>
                        <p class="text-sm">${note.notesText}</p>
                    `;
                    container.appendChild(noteDiv);
                });
            } else {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">Aucune note médicale pour ce patient.</p>';
            }

            document.getElementById('medical-notes-patient-id').value = patientId;
            showModal('medicalNotes');
        }

        function viewConsultationDetails(consultationId) {
            const consultation = demoData.consultations.find(c => c.consultationId === consultationId);
            if (!consultation) return;

            const patient = demoData.patients.find(p => p.id === consultation.patientId);

            document.getElementById('consultation-details-patient').textContent =
                patient ? `${patient.nom} ${patient.prenom}` : 'Inconnu';
            document.getElementById('consultation-details-date').textContent = formatDate(consultation.date);
            document.getElementById('consultation-details-type').textContent = consultation.type;
            document.getElementById('consultation-details-doctor').textContent = 'Dr. Sophie Martin';
            document.getElementById('consultation-details-diagnostic').textContent = consultation.diagnostic;
            document.getElementById('consultation-details-treatment').textContent = consultation.traitement;
            document.getElementById('consultation-details-notes').textContent = consultation.notes || 'Aucune note supplémentaire';
            document.getElementById('consultation-details-id').value = consultationId;

            showModal('consultationDetails');
        }

        // ============================================
        // GESTION DES PRESCRIPTIONS
        // ============================================

        function createPrescription(patientId, consultationId = null) {
            const patient = demoData.patients.find(p => p.id === patientId);
            if (!patient) return;

            document.getElementById('prescription-patient-id').value = patientId;
            document.getElementById('prescription-consultation-id').value = consultationId || '';

            document.getElementById('prescription-instructions').value = '';
            document.getElementById('prescription-validity').value = '';

            const container = document.getElementById('medicines-container');
            container.innerHTML = '';

            const firstRow = document.createElement('div');
            firstRow.className = 'flex space-x-2 items-center';
            firstRow.innerHTML = `
                <input type="text" data-i18n-placeholder="Nom du médicament" value="Paracétamol"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Dosage" value="500mg"
                    class="w-24 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Fréquence" value="3 fois par jour"
                    class="w-24 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Durée" value="7 jours"
                    class="w-20 px-3 py-2 border border-gray-300 rounded-lg">
                <button type="button" onclick="this.parentElement.remove()" 
                    class="text-red-600 hover:text-red-800">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
            `;
            container.appendChild(firstRow);

            const validityDate = new Date();
            validityDate.setDate(validityDate.getDate() + 30);
            document.getElementById('prescription-validity').value = validityDate.toISOString().split('T')[0];

            showModal('prescription');

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function addMedicineRow() {
            const container = document.getElementById('medicines-container');
            const row = document.createElement('div');
            row.className = 'flex space-x-2 items-center';
            row.innerHTML = `
                <input type="text" data-i18n-placeholder="Nom du médicament" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Dosage" 
                    class="w-24 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Fréquence" 
                    class="w-24 px-3 py-2 border border-gray-300 rounded-lg">
                <input type="text" data-i18n-placeholder="Durée" 
                    class="w-20 px-3 py-2 border border-gray-300 rounded-lg">
                <button type="button" onclick="this.parentElement.remove()" 
                    class="text-red-600 hover:text-red-800">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
            `;
            container.appendChild(row);

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        // ============================================
        // INITIALISATION DES CHARTES
        // ============================================

        function initCharts() {
            const ctx1 = document.getElementById('weeklyActivityChart');
            if (ctx1) {
                new Chart(ctx1.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                        datasets: [{
                            label: 'Consultations',
                            data: [5, 7, 8, 6, 9, 4, 2],
                            borderColor: '#3B82F6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.parsed.y} consultations`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return value;
                                    }
                                }
                            }
                        }
                    }
                });
            }

            const ctx2 = document.getElementById('patientsChart');
            if (ctx2) {
                new Chart(ctx2.getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: ['Nouveaux patients', 'Patients réguliers', 'Patients occasionnels'],
                        datasets: [{
                            data: [15, 50, 35],
                            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.label}: ${context.parsed}%`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
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
            const LangSelect = document.getElementById('LangSelect');

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
            const LangSelect = document.getElementById('LangSelect');

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

            languages.forEach(lang => {
                const isActive = lang.code === currentLang;
                buttons += `
                    <button onclick="changeLang('${lang.code}')"
                        class="flex items-center justify-between w-full px-4 py-3
                               ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white hover:bg-gray-50'} 
                               transition-all duration-200">
                        <div class="flex items-center">
                            <img src="${lang.flag}" width="24" class="rounded-sm" alt="${lang.name}">
                            <span class="ml-3 font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}">
                                ${lang.name}
                            </span>
                        </div>
                        ${isActive ? '<i data-feather="check" class="w-4 h-4 text-blue-500"></i>' : ''}
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

            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }

        function closeLangMenu() {
            const LangSelect = document.getElementById('LangSelect');
            LangSelect.innerHTML = "";
            LangSelect.classList.remove("opacity-100", "visible", "translate-y-0");
            LangSelect.classList.add("opacity-0", "invisible", "-translate-y-2");
            isLangOpen = false;
        }

        function changeLang(lang) {
            localStorage.setItem('lang', lang);
            updateCurrentLangDisplay();
            closeLangMenu();
            location.reload();
        }

        // ============================================
        // GESTION DU PROFIL MÉDECIN
        // ============================================

        function initDoctorProfileForm() {
            const form = document.getElementById('doctor-profile-form');
            if (!form) return;

            document.getElementById('doctor-nom').value = demoData.doctor.nom;
            document.getElementById('doctor-prenom').value = demoData.doctor.prenom;
            document.getElementById('specialite').value = demoData.doctor.specialite;
            document.getElementById('doctor-email').value = demoData.doctor.email;
            document.getElementById('doctor-telephone').value = demoData.doctor.telephone;
            document.getElementById('licence').value = demoData.doctor.licence;
            document.getElementById('doctor-adresse').value = demoData.doctor.adresse;
            document.getElementById('bio').value = demoData.doctor.bio;

            updateDoctorDisplay(demoData.doctor);

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const formData = {
                    nom: document.getElementById('doctor-nom').value,
                    prenom: document.getElementById('doctor-prenom').value,
                    specialite: document.getElementById('specialite').value,
                    email: document.getElementById('doctor-email').value,
                    telephone: document.getElementById('doctor-telephone').value,
                    licence: document.getElementById('licence').value,
                    adresse: document.getElementById('doctor-adresse').value,
                    bio: document.getElementById('bio').value
                };

                localStorage.setItem('doctorProfile', JSON.stringify(formData));
                updateDoctorDisplay(formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: 'Profil enregistré avec succès',
                    timer: 2000,
                    showConfirmButton: false
                });
            });

            const cancelBtn = document.getElementById('cancel-profile-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function () {
                    Swal.fire({
                        title: 'Annuler les modifications',
                        text: 'Êtes-vous sûr de vouloir annuler les modifications ?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#EF4444',
                        cancelButtonColor: '#6B7280',
                        confirmButtonText: 'Oui, annuler',
                        cancelButtonText: 'Non'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            loadDoctorProfile();
                        }
                    });
                });
            }
        }

        function loadDoctorProfile() {
            const savedProfile = localStorage.getItem('doctorProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                updateDoctorDisplay(profile);
            }
        }

        function updateDoctorDisplay(profile) {
            const doctorName = document.getElementById('doctor-name');
            const doctorSpecialty = document.getElementById('doctor-specialty');
            const dropdownDoctorName = document.getElementById('dropdown-doctor-name');
            const dropdownDoctorEmail = document.getElementById('dropdown-doctor-email');

            if (doctorName && profile.nom) {
                doctorName.textContent = `Dr. ${profile.nom} ${profile.prenom}`;
            }
            if (doctorSpecialty && profile.specialite) {
                doctorSpecialty.textContent = profile.specialite;
            }
            if (dropdownDoctorName && profile.nom) {
                dropdownDoctorName.textContent = `Dr. ${profile.nom} ${profile.prenom}`;
            }
            if (dropdownDoctorEmail && profile.email) {
                dropdownDoctorEmail.textContent = profile.email;
            }
        }

        // ============================================
        // FORMULAIRES
        // ============================================

        function initForms() {
            const addAppointmentForm = document.getElementById('add-appointment-form');
            if (addAppointmentForm) {
                addAppointmentForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const patientId = document.getElementById('appointment-patient').value;
                    const dateTime = document.getElementById('appointment-datetime').value;
                    const reason = document.getElementById('appointment-reason').value;

                    if (!patientId || !dateTime || !reason) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Veuillez remplir tous les champs',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        return;
                    }

                    const patient = demoData.patients.find(p => p.id == patientId);
                    if (!patient) return;

                    const newAppointment = {
                        appointmentId: demoData.appointments.length + 1,
                        patientId: parseInt(patientId),
                        doctorId: demoData.doctorId,
                        serviceId: 1,
                        appointmentDateTime: dateTime,
                        patient: `${patient.nom} ${patient.prenom}`,
                        motif: reason,
                        status: 'pending',
                        createdBy: 'doctor',
                        createdAt: new Date().toISOString().split('T')[0]
                    };

                    demoData.appointments.push(newAppointment);
                    patient.prochainRdv = dateTime.split('T')[0];

                    this.reset();

                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'Rendez-vous programmé avec succès',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    loadAppointmentsList();
                    loadPatientsList();
                });
            }

            const mobileAddAppointmentForm = document.getElementById('mobile-add-appointment-form');
            if (mobileAddAppointmentForm) {
                mobileAddAppointmentForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const patientId = document.getElementById('mobile-appointment-patient').value;
                    const date = document.getElementById('mobile-appointment-date').value;
                    const time = document.getElementById('mobile-appointment-time').value;
                    const reason = document.getElementById('mobile-appointment-reason').value;

                    if (!patientId || !date || !time || !reason) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Veuillez remplir tous les champs',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        return;
                    }

                    const patient = demoData.patients.find(p => p.id == patientId);
                    if (!patient) return;

                    const dateTime = `${date}T${time}`;

                    const newAppointment = {
                        appointmentId: demoData.appointments.length + 1,
                        patientId: parseInt(patientId),
                        doctorId: demoData.doctorId,
                        serviceId: 1,
                        appointmentDateTime: dateTime,
                        patient: `${patient.nom} ${patient.prenom}`,
                        motif: reason,
                        status: 'pending',
                        createdBy: 'doctor',
                        createdAt: new Date().toISOString().split('T')[0]
                    };

                    demoData.appointments.push(newAppointment);
                    patient.prochainRdv = date;

                    this.reset();
                    closeModal('addAppointment');

                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'Rendez-vous programmé avec succès',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    loadAppointmentsList();
                    loadPatientsList();
                });
            }

            const prescriptionForm = document.getElementById('prescription-form');
            if (prescriptionForm) {
                prescriptionForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const patientId = document.getElementById('prescription-patient-id').value;
                    const instructions = document.getElementById('prescription-instructions').value;
                    const validity = document.getElementById('prescription-validity').value;

                    const medicines = [];
                    document.querySelectorAll('#medicines-container .flex.space-x-2').forEach(row => {
                        const inputs = row.querySelectorAll('input');
                        if (inputs[0].value) {
                            medicines.push({
                                medicineName: inputs[0].value,
                                dosage: inputs[1].value,
                                frequency: inputs[2].value,
                                duration: inputs[3].value
                            });
                        }
                    });

                    if (medicines.length === 0) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Veuillez ajouter au moins un médicament',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        return;
                    }

                    const newPrescription = {
                        prescriptionId: demoData.prescriptions.length + 1,
                        appointmentId: null,
                        doctorId: demoData.doctorId,
                        patientId: parseInt(patientId),
                        medicineList: medicines,
                        note: instructions,
                        createdAt: new Date().toISOString().split('T')[0]
                    };

                    demoData.prescriptions.push(newPrescription);

                    closeModal('prescription');

                    Swal.fire({
                        icon: 'success',
                        title: 'Prescription générée',
                        html: `
                            <div class="text-left">
                                <p>La prescription a été générée avec succès.</p>
                                <p class="mt-2 text-sm text-gray-600">
                                    ${medicines.length} médicament(s) prescrit(s)<br>
                                    Valide jusqu'au: ${formatDate(validity)}
                                </p>
                            </div>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: 'OK'
                    });
                });
            }

            const consultationForm = document.getElementById('consultation-form');
            if (consultationForm) {
                consultationForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const patientId = document.getElementById('consultation-patient').value;
                    const date = document.getElementById('consultation-date').value;
                    const type = document.getElementById('consultation-type').value;
                    const diagnostic = document.getElementById('consultation-diagnostic').value;
                    const treatment = document.getElementById('consultation-treatment').value;
                    const notes = document.getElementById('consultation-notes').value;

                    if (!patientId || !date || !type || !diagnostic || !treatment) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur',
                            text: 'Veuillez remplir tous les champs obligatoires',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        return;
                    }

                    const patient = demoData.patients.find(p => p.id == patientId);
                    if (!patient) return;

                    const newConsultation = {
                        consultationId: demoData.consultations.length + 1,
                        patientId: parseInt(patientId),
                        doctorId: demoData.doctorId,
                        date: date,
                        type: type,
                        diagnostic: diagnostic,
                        traitement: treatment,
                        notes: notes
                    };

                    demoData.consultations.push(newConsultation);
                    patient.derniereVisite = date;

                    const newNote = {
                        noteId: demoData.medicalNotes.length + 1,
                        appointmentId: null,
                        doctorId: demoData.doctorId,
                        patientId: parseInt(patientId),
                        notesText: notes || diagnostic,
                        createdAt: date
                    };
                    demoData.medicalNotes.push(newNote);

                    closeModal('consultation');

                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                        text: 'Consultation enregistrée avec succès',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    loadConsultationsList();
                    loadPatientsList();
                    loadDashboardData();
                });
            }

            // Initialiser les boutons des modales
            document.getElementById('add-consultation-btn').addEventListener('click', function () {
                document.getElementById('consultation-date').value = new Date().toISOString().split('T')[0];
                showModal('consultation');
            });

            document.getElementById('mobile-add-appointment-btn').addEventListener('click', function () {
                document.getElementById('mobile-appointment-date').value = new Date().toISOString().split('T')[0];
                document.getElementById('mobile-appointment-time').value = '09:00';
                showModal('addAppointment');
            });

            // Fermer les modales
            document.getElementById('closePatientDetailsModal').addEventListener('click', () => closeModal('patientDetails'));
            document.getElementById('closePatientDetailsModal2').addEventListener('click', () => closeModal('patientDetails'));
            document.getElementById('closePrescriptionModal').addEventListener('click', () => closeModal('prescription'));
            document.getElementById('cancelPrescriptionBtn').addEventListener('click', () => closeModal('prescription'));
            document.getElementById('closeConsultationModal').addEventListener('click', () => closeModal('consultation'));
            document.getElementById('cancelConsultationBtn').addEventListener('click', () => closeModal('consultation'));
            document.getElementById('closeAddAppointmentModal').addEventListener('click', () => closeModal('addAppointment'));
            document.getElementById('cancelAddAppointmentBtn').addEventListener('click', () => closeModal('addAppointment'));
            document.getElementById('closeConsultationDetailsModal').addEventListener('click', () => closeModal('consultationDetails'));
            document.getElementById('closeConsultationDetailsModal2').addEventListener('click', () => closeModal('consultationDetails'));
            document.getElementById('closeMedicalNotesModal').addEventListener('click', () => closeModal('medicalNotes'));
            document.getElementById('closeMedicalNotesModal2').addEventListener('click', () => closeModal('medicalNotes'));
        }

        // ============================================
        // ÉVÉNEMENTS
        // ============================================

        function setupEventListeners() {
            const toggleButton = document.getElementById('toggleSidebar');
            if (toggleButton) {
                toggleButton.addEventListener('click', toggleSidebar);
            }

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    navigateToPage(pageId);
                });
            });

            window.addEventListener('hashchange', handleHashChange);

            window.addEventListener('resize', function () {
                const sidebar = document.getElementById('sidebar');
                const direction = getDirectionClasses();

                if (isMobile()) {
                    sidebar.classList.remove(direction.visible, 'sm:translate-x-0');
                    sidebar.classList.add(direction.hidden);
                    document.getElementById('appointment-sidebar').classList.add('hidden');
                } else {
                    sidebar.classList.remove(direction.hidden, direction.visible);
                    sidebar.classList.add('sm:translate-x-0');
                    document.getElementById('appointment-sidebar').classList.remove('hidden');
                }
            });

            document.addEventListener('click', function (event) {
                const sidebar = document.getElementById('sidebar');
                const toggleBtn = document.getElementById('toggleSidebar');

                if (isMobile() && sidebar && toggleBtn) {
                    const isClickInside = sidebar.contains(event.target);
                    const isClickOnToggle = toggleBtn.contains(event.target);
                    const direction = getDirectionClasses();

                    if (!isClickInside && !isClickOnToggle &&
                        !sidebar.classList.contains(direction.hidden)) {
                        sidebar.classList.remove(direction.visible);
                        sidebar.classList.add(direction.hidden);
                    }
                }

                const LangToogle = document.getElementById('LangToogle');
                const LangSelect = document.getElementById('LangSelect');

                if (LangSelect && LangToogle && isLangOpen) {
                    const isClickOnLang = LangToogle.contains(event.target) ||
                        LangSelect.contains(event.target);

                    if (!isClickOnLang) {
                        closeLangMenu();
                    }
                }
            });

            const LangToogle = document.getElementById('LangToogle');
            if (LangToogle) {
                LangToogle.addEventListener('click', toggleLangMenu);
            }

            window.addEventListener('storage', function (e) {
                if (e.key === 'lang') {
                    initSidebar();
                    updateCurrentLangDisplay();
                    updateLangPosition();
                }
            });
        }

        // ============================================
        // INITIALISATION
        // ============================================

        function init() {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }

            initSidebar();
            updateCurrentLangDisplay();
            updateLangPosition();
            initDoctorProfileForm();
            initForms();
            setupEventListeners();
            initCharts();
            handleHashChange();

            setInterval(() => {
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }, 1000);
        }

        // ============================================
        // DÉMARRAGE
        // ============================================

        document.addEventListener('DOMContentLoaded', init);