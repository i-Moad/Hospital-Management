feather.replace();

// Fonction pour afficher un message d'erreur
// const showError = (element, message, icon = "alert-circle") => {
//   element.innerHTML = `
//         <div class="flex items-center gap-2 text-red-600">
//             <i data-feather="${icon}" class="w-[15px] h-[15px]"></i>
//             ${t(message)}
//         </div>
//     `;
//   feather.replace();
// };

// Fonction principale pour gérer le login
// const handleLogin = async () => {
//   //Récuperer les champs de form
//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();
//   //Récuperer les balises d'erreur
//   const errorEmail = document.getElementById("errorEmail");
//   const errorPassword = document.getElementById("errorPassword");
//   //Récuperer button de submit
//   const button = document.getElementById("connexion");

//   // vider la partie des erreurs
//   errorEmail.innerHTML = "";
//   errorPassword.innerHTML = "";

//   // Vérifier les champs email et password
//   if (!email) {
//     showError(errorEmail, "Veuillez remplir l'email");
//     return;
//   }
//   if (!password) {
//     showError(errorPassword, "Veuillez remplir le mot de passe");
//     return;
//   }

//   // Désactiver le bouton et afficher le spinner
//   button.disabled = true;
//   button.innerHTML = `
//         Connexion en cours
//         <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block ml-2"></div>
//     `;
//     // récuperer les données des users dans le fichier json et vérifier est ce que les champs de email et password de user connecté existe
//     try {
//         const response = await fetch("../../data/users.json");
//         const users = await response.json(); 

//     const user = users.find(
//       (u) => u.email === email && u.password === password
//     );

//     setTimeout(() => {
//       button.disabled = false;
//       button.innerHTML = "Connexion";

//             if (user) {
//                 window.location.href = "../index.html"; // redirection
//             } else {
//                 showError(errorEmail, "Email ou mot de passe incorrect");
//                 showError(errorPassword, "Email ou mot de passe incorrect");
//             }
//         }, 1000);

//     } catch (err) {
//         //En cas d'erreur afficher l'erreur dans console
//         console.error(err);
//         console.log("Erreur serveur ou fichier JSON introuvable");
//         button.disabled = false;
//         button.innerHTML = "Connexion";
//     }
// };

// L'evenement click de button connexion
// const button = document.getElementById("connexion");
// button.addEventListener("click", (e) => {
//   e.preventDefault();
//   handleLogin();
// });
let isLangOpen = false;
const LangToogle = document.getElementById("LangToogle");
const LangSelect = document.getElementById("LangSelect");
const currentLangSpan = document.getElementById("currentLang");

/* ---------- Mettre à jour l'affichage de la langue ---------- */
function updateCurrentLangDisplay() {
  const lang = localStorage.getItem("lang") || "fr";
  const langMap = {
    fr: "FR",
    en: "EN",
    ar: "AR"
  };
  if (currentLangSpan) {
    currentLangSpan.textContent = langMap[lang] || "FR";
  }
}

/* ---------- Position RTL / LTR ---------- */
function updateLangPosition() {
  const isRTL = localStorage.getItem("lang") === "ar";

  if (LangSelect) {
    if (isRTL) {
      LangSelect.classList.remove("right-0");
      LangSelect.classList.add("left-0");
      document.documentElement.dir = "rtl";
    } else {
      LangSelect.classList.add("right-0");
      LangSelect.classList.remove("left-0");
      document.documentElement.dir = "ltr";
    }
  }
}

/* ---------- Fermer le menu ---------- */
function closeLangMenu() {
  if (LangSelect) {
    LangSelect.classList.add("opacity-0", "invisible", "-translate-y-2");
    LangSelect.classList.remove("opacity-100", "visible", "translate-y-0");
    isLangOpen = false;
  }
}

/* ---------- Changer la langue ---------- */
function setLang(lang) {
  localStorage.setItem("lang", lang);
  updateLangPosition();
  updateCurrentLangDisplay();
  closeLangMenu();
  
  location.reload(); // optionnel
}

/* ---------- Ouvrir / Fermer ---------- */
if (LangToogle) {
  LangToogle.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isLangOpen) {
      closeLangMenu();
      return;
    }

    updateLangPosition();

    const languages = [
      { name: "Français", code: "fr", flag: "../../assets/png/fr.png" },
      { name: "English", code: "en", flag: "../../assets/png/en.png" },
      { name: "العربية", code: "ar", flag: "../../assets/png/ma.png" },
    ];

    const currentLang = localStorage.getItem("lang") || "fr";
    let buttons = "";

    languages.forEach(lang => {
      const isActive = lang.code === currentLang;
      buttons += `
        <button onclick="setLang('${lang.code}')"
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
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider" data-i18n="Sélectionner la langue">Sélectionner la langue</p>
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
  });
}

/* ---------- Click ailleurs = fermer ---------- */
document.addEventListener("click", () => {
  if (isLangOpen) {
    closeLangMenu();
  }
});

/* ---------- Init au chargement ---------- */
updateLangPosition();
updateCurrentLangDisplay();

document.addEventListener("DOMContentLoaded", async () => {
  // Initialiser i18n si la fonction existe
  if (typeof initI18n === 'function') {
    await initI18n();
  }

  // Mettre à jour l'affichage après l'init
  updateCurrentLangDisplay();
  
  // Si c'est un élément SELECT (ancien style)
  const langSelect = document.getElementById("LangSelect");
  if (langSelect && langSelect.tagName === "SELECT") {
    let currentLang = localStorage.getItem("lang") || "fr";
    langSelect.value = currentLang;

    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      setLang(selectedLang);
    });
  }
});
