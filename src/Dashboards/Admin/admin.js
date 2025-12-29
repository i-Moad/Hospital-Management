// ============================================
// CONFIGURATION
// ============================================

const pages = ['dashboard', 'users', 'services', 'hopital'];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function isMobile() {
    return window.innerWidth < 640;
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

// ============================================
// GESTION DU SIDEBAR
// ============================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const direction = getDirectionClasses();

    // Nettoyer les classes de position
    ['left-0', 'right-0', 'sm:ml-64', 'sm:mr-64', 'border-l', 'border-r',
        '-translate-x-full', 'translate-x-full', 'translate-x-0'].forEach(cls => {
            sidebar.classList.remove(cls);
            if (main) main.classList.remove(cls);
        });

    // Appliquer les nouvelles classes
    sidebar.classList.add(direction.position);
    main.classList.add(direction.margin);

    // Gérer l'affichage initial
    if (isMobile()) {
        sidebar.classList.add(direction.hidden);
    } else {
        sidebar.classList.add('sm:translate-x-0');
    }

    // Gérer la bordure
    sidebar.classList.add(direction.border);

    // Direction du texte
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
    // Validation
    if (!pages.includes(pageId)) {
        pageId = 'dashboard';
    }

    // Mettre à jour l'URL
    window.location.hash = pageId;

    // Mettre à jour la navigation active
    updateActiveNav(pageId);

    // Afficher/masquer les pages
    showPage(pageId);

    // Fermer le sidebar sur mobile
    if (isMobile()) {
        const sidebar = document.getElementById('sidebar');
        const direction = getDirectionClasses();
        sidebar.classList.remove(direction.visible);
        sidebar.classList.add(direction.hidden);
    }

    // Mettre à jour les icônes
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function updateActiveNav(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.getAttribute('data-page');

        // Réinitialiser
        link.classList.remove('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100');
        link.querySelector('i')?.classList.remove('text-blue-600');

        link.classList.add('text-gray-900', 'hover:bg-gray-100');
        link.querySelector('i')?.classList.add('text-gray-500');

        // Activer si correspond
        if (page === activePage) {
            link.classList.remove('text-gray-900', 'hover:bg-gray-100');
            link.classList.add('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100');

            link.querySelector('i')?.classList.remove('text-gray-500');
            link.querySelector('i')?.classList.add('text-blue-600');
        }
    });
}

function showPage(pageId) {
    // Masquer toutes les pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });

    // Afficher la page demandée
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');

        // Animation d'apparition
        targetPage.style.opacity = '0';
        setTimeout(() => {
            targetPage.style.transition = 'opacity 0.3s ease';
            targetPage.style.opacity = '1';
        }, 10);
    }
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    navigateToPage(pages.includes(hash) ? hash : 'dashboard');
}

// ============================================
// GESTION DES CHARTES
// ============================================

// function initCharts() {
//     // Chart 1: Users & Hospitals
//     const ctx1 = document.getElementById('usersHospitalsChart');
//     if (ctx1) {
//         new Chart(ctx1.getContext('2d'), {
//             type: 'bar',
//             data: {
//                 labels: ['Utilisateurs', 'Hôpitaux', 'Services Médicaux'],
//                 datasets: [{
//                     label: 'Nombre',
//                     data: [1234, 48, 156],
//                     backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
//                     borderRadius: 5,
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: { legend: { display: false } },
//                 scales: { y: { beginAtZero: true } }
//             }
//         });
//     }

//     // Chart 2: Occupation Rate
//     const ctx2 = document.getElementById('occupationChart');
//     if (ctx2) {
//         new Chart(ctx2.getContext('2d'), {
//             type: 'line',
//             data: {
//                 labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
//                 datasets: [{
//                     label: 'Taux d\'Occupation (%)',
//                     data: [70, 72, 75, 78, 76, 78],
//                     borderColor: '#EF4444',
//                     backgroundColor: 'rgba(239, 68, 68, 0.2)',
//                     tension: 0.3,
//                     fill: true,
//                     pointRadius: 4,
//                     pointBackgroundColor: '#EF4444'
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         max: 100
//                     }
//                 }
//             }
//         });
//     }
// }

// ============================================
// GESTION DE LA LANGUE (NOUVELLE VERSION)
// ============================================

let isLangOpen = false;

// Mettre à jour l'affichage de la langue courante
function updateCurrentLangDisplay() {
    const currentLang = localStorage.getItem("lang") || "fr";
    const langDisplay = document.getElementById("currentLang");
    
    if (langDisplay) {
        switch(currentLang) {
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

// Position du menu langue (RTL/LTR)
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

// Ouvrir/Fermer le menu langue
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
    
    // Afficher le menu avec animation
    LangSelect.classList.remove("opacity-0", "invisible", "-translate-y-2");
    LangSelect.classList.add("opacity-100", "visible", "translate-y-0");
    
    isLangOpen = true;
    
    // Mettre à jour les icônes Feather
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Fermer le menu langue
function closeLangMenu() {
    const LangSelect = document.getElementById('LangSelect');
    LangSelect.innerHTML = "";
    LangSelect.classList.remove("opacity-100", "visible", "translate-y-0");
    LangSelect.classList.add("opacity-0", "invisible", "-translate-y-2");
    isLangOpen = false;
}

// Changer la langue
function changeLang(lang) {
    localStorage.setItem('lang', lang);
    updateCurrentLangDisplay();
    closeLangMenu();
    location.reload();
}

// ============================================
// GESTION DU FORMULAIRE HOPITAL
// ============================================

function updateFormDirection() {
    const isRTL = localStorage.getItem('lang') === 'ar';
    const form = document.getElementById('hopital-form');

    if (form) {
        // Ajuster les icônes pour RTL
        const iconContainers = form.querySelectorAll('.relative');
        iconContainers.forEach(container => {
            const iconDiv = container.querySelector('.absolute.inset-y-0.left-0');
            if (iconDiv && isRTL) {
                iconDiv.classList.remove('left-0', 'pl-3');
                iconDiv.classList.add('right-0', 'pr-3');
            } else if (iconDiv && !isRTL) {
                iconDiv.classList.remove('right-0', 'pr-3');
                iconDiv.classList.add('left-0', 'pl-3');
            }
        });

        // Ajuster le padding des inputs
        const inputs = form.querySelectorAll('input.pl-10');
        inputs.forEach(input => {
            if (isRTL) {
                input.classList.remove('pl-10');
                input.classList.add('pr-10');
            } else {
                input.classList.remove('pr-10');
                input.classList.add('pl-10');
            }
        });

        // Ajuster la marge des icônes dans les labels
        const labelIcons = form.querySelectorAll('label .mr-2');
        labelIcons.forEach(icon => {
            if (isRTL) {
                icon.classList.remove('mr-2');
                icon.classList.add('ml-2');
            } else {
                icon.classList.remove('ml-2');
                icon.classList.add('mr-2');
            }
        });

        // Ajuster la marge des icônes dans les boutons
        const buttonIcons = form.querySelectorAll('button .mr-2');
        buttonIcons.forEach(icon => {
            if (isRTL) {
                icon.classList.remove('mr-2');
                icon.classList.add('ml-2');
            } else {
                icon.classList.remove('ml-2');
                icon.classList.add('mr-2');
            }
        });

        // Ajuster l'alignement des boutons
        const buttonContainer = form.querySelector('.flex.justify-end');
        if (buttonContainer) {
            if (isRTL) {
                buttonContainer.classList.remove('justify-end', 'space-x-3');
                buttonContainer.classList.add('justify-start', 'space-x-reverse', 'space-x-3');
            } else {
                buttonContainer.classList.remove('justify-start', 'space-x-reverse');
                buttonContainer.classList.add('justify-end', 'space-x-3');
            }
        }
    }
}

function initHopitalForm() {
    const form = document.getElementById('hopital-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Récupérer les données du formulaire
            const formData = {
                nom: document.getElementById('NomHopital').value,
                adresse: document.getElementById('adresse').value,
                telephone: document.getElementById('Téléphone').value,
                email: document.getElementById('email').value,
                logo: document.getElementById('logo').value
            };

            console.log('Données du formulaire:', formData);

            // Ici vous pouvez ajouter votre logique d'envoi
            // Exemple: fetch('/api/hopital', { method: 'POST', body: JSON.stringify(formData) })

            // Message de succès (simulation)
            alert('Formulaire soumis avec succès!');
        });
    }
}

// ============================================
// ÉVÉNEMENTS
// ============================================

function setupEventListeners() {
    // Toggle sidebar
    const toggleButton = document.getElementById('toggleSidebar');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });

    // Hash change
    window.addEventListener('hashchange', handleHashChange);

    // Resize
    window.addEventListener('resize', function () {
        const sidebar = document.getElementById('sidebar');
        const direction = getDirectionClasses();

        if (isMobile()) {
            sidebar.classList.remove(direction.visible, 'sm:translate-x-0');
            sidebar.classList.add(direction.hidden);
        } else {
            sidebar.classList.remove(direction.hidden, direction.visible);
            sidebar.classList.add('sm:translate-x-0');
        }
    });

    // Click outside to close sidebar (mobile)
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

        // Close language menu
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

    // Language toggle
    const LangToogle = document.getElementById('LangToogle');
    if (LangToogle) {
        LangToogle.addEventListener('click', toggleLangMenu);
    }

    // Storage change (for language)
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
    // Initialiser Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialiser le sidebar
    initSidebar();

    // Initialiser l'affichage de la langue
    updateCurrentLangDisplay();
    updateLangPosition();

    // Initialiser le formulaire
    updateFormDirection();
    initHopitalForm();

    // Configurer les événements
    setupEventListeners();

    // Initialiser les chartes
    // initCharts();

    // Gérer la page initiale
    handleHashChange();

    // Mettre à jour les icônes périodiquement (pour le contenu dynamique)
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