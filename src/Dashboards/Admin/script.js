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

const addEmergencyContactBtn = document.getElementById("addEmergencyContactBtn");
const emergencyContactsContainer = document.getElementById("emergencyContactsContainer");

addEmergencyContactBtn.addEventListener("click", () => {
    // Count current contacts
    const currentCount = emergencyContactsContainer.children.length + 1;

    const contactHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg relative">
            <h3 class="absolute -top-3 left-3 bg-white px-2 text-sm font-semibold text-gray-700">
                Contact d'urgence ${currentCount}
            </h3>

            <!-- First Name -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Prénom</label>
                <div class="relative">
                    <i data-feather="user" class="absolute left-3 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                    <input type="text" name="emergencyFirstName${currentCount}"
                        class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Entrez le prénom" required>
                    <p class="error-firstName text-red-600 text-sm mt-1"></p>
                </div>
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Nom</label>
                <div class="relative">
                    <i data-feather="user" class="absolute left-3 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                    <input type="text" name="emergencyLastName${currentCount}"
                        class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Entrez le nom" required>
                    <p class="error-lastName text-red-600 text-sm mt-1"></p>
                </div>
            </div>

            <!-- Phone -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Téléphone</label>
                <div class="relative">
                    <i data-feather="phone" class="absolute left-3 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                    <input type="text" name="emergencyPhone${currentCount}"
                        class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="+212 600-000000" required>
                    <p class="error-phone text-red-600 text-sm mt-1"></p>
                </div>
            </div>

            <!-- Relationship -->
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">Relation</label>
                <div class="relative">
                    <i data-feather="users" class="absolute left-3 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                    <input type="text" name="emergencyRelationship${currentCount}"
                        class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Ex: Parent, Ami" required>
                    <p class="error-relationship text-red-600 text-sm mt-1"></p>
                </div>
            </div>

            <!-- Remove button -->
            <button type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700 removeContactBtn">
                <i data-feather="x" class="w-5 h-5"></i>
            </button>
        </div>
    `;

    emergencyContactsContainer.insertAdjacentHTML('beforeend', contactHTML);
    feather.replace(); // refresh icons

    // Update remove buttons
    const removeBtns = emergencyContactsContainer.querySelectorAll(".removeContactBtn");
    removeBtns.forEach(btn => {
        btn.onclick = () => {
            btn.parentElement.remove();
            updateEmergencyContactNumbers();
        };
    });
});

// Function to renumber emergency contacts after removing
function updateEmergencyContactNumbers() {
    const contacts = emergencyContactsContainer.children;
    for (let i = 0; i < contacts.length; i++) {
        const h3 = contacts[i].querySelector("h3");
        h3.textContent = `Contact d'urgence ${i + 1}`;

        // Update input names
        const inputs = contacts[i].querySelectorAll("input");
        inputs[0].name = `emergencyFirstName${i + 1}`;
        inputs[1].name = `emergencyLastName${i + 1}`;
        inputs[2].name = `emergencyPhone${i + 1}`;
        inputs[3].name = `emergencyRelationship${i + 1}`;
    }
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
  // loadDashboardData();
  // loadUsersData();
  // loadServicesData();
  // setupUsersEvents();
  // setupServicesEvents();
  // Avatar()
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