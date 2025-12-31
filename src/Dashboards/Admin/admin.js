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
// SIDEBAR
// ============================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const direction = getDirectionClasses();

    ['left-0', 'right-0', 'sm:ml-64', 'sm:mr-64', 'border-l', 'border-r',
        '-translate-x-full', 'translate-x-full', 'translate-x-0'
    ].forEach(cls => {
        sidebar.classList.remove(cls);
        main?.classList.remove(cls);
    });

    sidebar.classList.add(direction.position);
    main?.classList.add(direction.margin);
    sidebar.classList.add(direction.border);

    if (isMobile()) {
        sidebar.classList.add(direction.hidden);
    } else {
        sidebar.classList.add('sm:translate-x-0');
    }

    document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
    sidebar.setAttribute('dir', isRTL() ? 'rtl' : 'ltr');
}

function toggleSidebar() {
    if (!isMobile()) return;

    const sidebar = document.getElementById('sidebar');
    const direction = getDirectionClasses();

    sidebar.classList.toggle(direction.hidden);
    sidebar.classList.toggle(direction.visible);
}

// ============================================
// NAVIGATION (FIXED)
// ============================================

function navigateToPage(pageId) {
    if (!pages.includes(pageId)) {
        pageId = 'dashboard';
    }

    // ✅ prevent infinite loop
    if (window.location.hash.substring(1) !== pageId) {
        window.location.hash = pageId;
    }

    updateActiveNav(pageId);
    showPage(pageId);

    if (isMobile()) {
        const sidebar = document.getElementById('sidebar');
        const direction = getDirectionClasses();
        sidebar.classList.remove(direction.visible);
        sidebar.classList.add(direction.hidden);
    }

    if (window.feather) {
        feather.replace();
    }
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const page = pages.includes(hash) ? hash : 'dashboard';

    updateActiveNav(page);
    showPage(page);

    if (window.feather) {
        feather.replace();
    }
}

function updateActiveNav(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.dataset.page;
        const icon = link.querySelector('i');

        link.classList.remove('text-blue-600', 'bg-blue-50');
        link.classList.add('text-gray-900', 'hover:bg-gray-100');
        icon?.classList.remove('text-blue-600');
        icon?.classList.add('text-gray-500');

        if (page === activePage) {
            link.classList.add('text-blue-600', 'bg-blue-50');
            link.classList.remove('text-gray-900');
            icon?.classList.add('text-blue-600');
            icon?.classList.remove('text-gray-500');
        }
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.add('hidden');
    });

    const target = document.getElementById(`page-${pageId}`);
    if (target) {
        target.classList.remove('hidden');
        target.style.opacity = '0';

        setTimeout(() => {
            target.style.transition = 'opacity 0.3s ease';
            target.style.opacity = '1';
        }, 10);
    }
}

// ============================================
// LANGUAGE MENU
// ============================================

let isLangOpen = false;

function updateCurrentLangDisplay() {
    const lang = localStorage.getItem('lang') || 'fr';
    const el = document.getElementById('currentLang');

    if (!el) return;

    el.textContent = lang === 'ar' ? 'العربية' : lang.toUpperCase();
}

function updateLangPosition() {
    const LangSelect = document.getElementById('LangSelect');
    if (!LangSelect) return;

    LangSelect.classList.toggle('left-0', isRTL());
    LangSelect.classList.toggle('right-0', !isRTL());
}

function toggleLangMenu(e) {
    e.stopPropagation();

    if (isLangOpen) return closeLangMenu();

    const LangSelect = document.getElementById('LangSelect');
    updateLangPosition();

    const currentLang = localStorage.getItem('lang') || 'fr';

    LangSelect.innerHTML = `
        <button onclick="changeLang('fr')" class="w-full px-4 py-2">Français</button>
        <button onclick="changeLang('en')" class="w-full px-4 py-2">English</button>
        <button onclick="changeLang('ar')" class="w-full px-4 py-2">العربية</button>
    `;

    LangSelect.classList.remove('opacity-0', 'invisible');
    LangSelect.classList.add('opacity-100', 'visible');

    isLangOpen = true;

    if (window.feather) {
        feather.replace();
    }
}

function closeLangMenu() {
    const LangSelect = document.getElementById('LangSelect');
    if (!LangSelect) return;

    LangSelect.innerHTML = '';
    LangSelect.classList.remove('opacity-100', 'visible');
    LangSelect.classList.add('opacity-0', 'invisible');
    isLangOpen = false;
}

function changeLang(lang) {
    localStorage.setItem('lang', lang);
    location.reload();
}

// ============================================
// FORM HOPITAL
// ============================================

function updateFormDirection() {
    const form = document.getElementById('hopital-form');
    if (!form) return;

    form.dir = isRTL() ? 'rtl' : 'ltr';
}

function initHopitalForm() {
    const form = document.getElementById('hopital-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Formulaire soumis avec succès!');
    });
}

// ============================================
// EVENTS
// ============================================

function setupEventListeners() {
    document.getElementById('toggleSidebar')
        ?.addEventListener('click', toggleSidebar);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navigateToPage(link.dataset.page);
        });
    });

    window.addEventListener('hashchange', handleHashChange);

    document.getElementById('LangToogle')
        ?.addEventListener('click', toggleLangMenu);

    document.addEventListener('click', () => {
        if (isLangOpen) closeLangMenu();
    });
}

// ============================================
// INIT (CLEAN)
// ============================================

function init() {
    if (window.feather) {
        feather.replace();
    }

    initSidebar();
    updateCurrentLangDisplay();
    updateLangPosition();
    updateFormDirection();
    initHopitalForm();
    setupEventListeners();
    handleHashChange();
}

document.addEventListener('DOMContentLoaded', init);
