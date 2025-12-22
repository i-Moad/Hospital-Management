feather.replace();

// Fonction pour afficher un message d'erreur
const showError = (element, message, icon = "alert-circle") => {
  element.innerHTML = `
        <div class="flex items-center gap-2 text-red-600">
            <i data-feather="${icon}" class="w-[15px] h-[15px]"></i>
            ${t(message)}
        </div>
    `;
  feather.replace();
};

// Fonction principale pour gérer le login
const handleLogin = async () => {
  //Récuperer les champs de form
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  //Récuperer les balises d'erreur
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");
  //Récuperer button de submit
  const button = document.getElementById("connexion");

  // vider la partie des erreurs
  errorEmail.innerHTML = "";
  errorPassword.innerHTML = "";

  // Vérifier les champs email et password
  if (!email) {
    showError(errorEmail, "Veuillez remplir l'email");
    return;
  }
  if (!password) {
    showError(errorPassword, "Veuillez remplir le mot de passe");
    return;
  }

  // Désactiver le bouton et afficher le spinner
  button.disabled = true;
  button.innerHTML = `
        Connexion en cours
        <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block ml-2"></div>
    `;
    // récuperer les données des users dans le fichier json et vérifier est ce que les champs de email et password de user connecté existe
    try {
        const response = await fetch("../../data/users.json");
        const users = await response.json(); 

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = "Connexion";

            if (user) {
                window.location.href = "../index.html"; // redirection
            } else {
                showError(errorEmail, "Email ou mot de passe incorrect");
                showError(errorPassword, "Email ou mot de passe incorrect");
            }
        }, 1000);

    } catch (err) {
        //En cas d'erreur afficher l'erreur dans console
        console.error(err);
        console.log("Erreur serveur ou fichier JSON introuvable");
        button.disabled = false;
        button.innerHTML = "Connexion";
    }
};

// L'evenement click de button connexion
const button = document.getElementById("connexion");
button.addEventListener("click", (e) => {
  e.preventDefault();
  handleLogin();
});
let isLangOpen = false;
const LangToogle = document.getElementById("LangToogle");
const LangSelect = document.getElementById("LangSelect");

/* ---------- Position RTL / LTR ---------- */
function updateLangPosition() {
  const isRTL = localStorage.getItem("lang") === "ar";

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

/* ---------- Changer la langue ---------- */
function setLang(lang) {
  localStorage.setItem("lang", lang);
  updateLangPosition();

  LangSelect.innerHTML = "";
  isLangOpen = false;

  location.reload(); // optionnel
}

/* ---------- Ouvrir / Fermer ---------- */
LangToogle.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isLangOpen) {
    LangSelect.innerHTML = "";
    isLangOpen = false;
    return;
  }

  updateLangPosition();

  const languages = [
    { name: "Français", code: "fr", flag: "../../assets/png/fr.png" },
    { name: "English", code: "en", flag: "../../assets/png/en.png" },
    { name: "العربية", code: "ar", flag: "../../assets/png/ma.png" },
  ];

  let buttons = "";

  for (let lang of languages) {
    buttons += `
      <button
        onclick="setLang('${lang.code}')"
        class="flex items-center gap-2 w-full px-4 py-3
               bg-white hover:bg-gray-50 border border-gray-200
               rounded-lg transition-all hover:shadow-md">
        <img src="${lang.flag}" width="20">
        <span class="font-medium text-gray-700">${lang.name}</span>
      </button>
    `;
  }

  LangSelect.innerHTML = `
    <div class="flex flex-col gap-2 mt-2 p-2
                bg-white rounded-lg shadow-lg border">
      ${buttons}
    </div>
  `;

  isLangOpen = true;
});

/* ---------- Click ailleurs = fermer ---------- */
document.addEventListener("click", () => {
  LangSelect.innerHTML = "";
  isLangOpen = false;
});

/* ---------- Init au chargement ---------- */
updateLangPosition();

document.addEventListener("DOMContentLoaded", async () => {
  await initI18n();

  const langSelect = document.getElementById("LangSelect");
  let currentLang = "fr";

  if (langSelect && langSelect.tagName === "SELECT") {
    langSelect.value = currentLang;

    langSelect.addEventListener("change", (e) => {
      const selectedLang = e.target.value;
      setLang(selectedLang);
    });
  }
});
