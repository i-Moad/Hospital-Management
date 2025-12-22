let translations = {};
let currentLang = "fr"; // lang par defaut

async function initI18n() {
  const res = await fetch("/translation/translation.json");
  translations = await res.json();

  // Récupérer la langue depuis localStorage si existe sinon fr par defaut
  currentLang = localStorage.getItem("lang") || "fr";

  applyTranslations();
}

function t(key) {
  return translations[key]?.[currentLang] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
}

function applyTranslations() {
  // Texte
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  //Placeholders 
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  // 🔹 Langue et direction
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  // 🔹 Gestion des icônes directionnelles
  document.querySelectorAll("[data-feather]").forEach((el) => {
    if (
      currentLang === "ar" &&
      (el.dataset.feather.includes("left") ||
        el.dataset.feather.includes("right"))
    ) {
      el.style.transform = "scaleX(-1)";
    } else {
      el.style.transform = "";
    }
  });
}

// Rendre global
window.t = t;
window.setLang = setLang;
window.initI18n = initI18n;
