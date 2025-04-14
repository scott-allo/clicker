// Variables globales
let kibbles = 0;
let kibblesPerClick = 1;
let doubleClickers = 0;
let autoClickers = 0;
let multipliers = 0;
let multiplierCost = 200;
let gifs = []; // Liste des GIFs chargée dynamiquement
let activeKibbleImage = "assets/kibble/default.png"; // Image active par défaut
let purchasedSkins = []; // Liste des skins achetés
let lastClickTime = 0;
let music = document.getElementById("backgroundMusic");
let lastMusicPosition = 0;
let musicTimeout;
let audioEnabled = false;
// Éléments HTML
const kibbleDisplay = document.getElementById("kibble");
const kibbleCount = document.getElementById("kibbleCount");
const autoClickerCount = document.getElementById("autoClickers");
const doubleClickerCount = document.getElementById("doubleClicker");
const multiplierCostDisplay = document.getElementById("multiplierCost");
const nyanCatGif = document.querySelector(".nyancatgif");
const shopToggle = document.getElementById("shopToggle");
const shopPanel = document.getElementById("shopPanel");

let lastThreshold = -1; // Variable pour suivre le dernier palier atteint

/* ==================== */
/*  INITIALISATION DU JEU */
/* ==================== */

// Charger le jeu au démarrage
function initGame() {
  loadGame();
  loadGifs();
  loadKibbleShop();
  setupEventListeners();
}

/* ==================== */
/*  CHARGEMENT ET SAUVEGARDE */
/* ==================== */

// Charger les données depuis le localStorage
function loadGame() {
  kibbles = parseInt(localStorage.getItem("kibbles")) || 0;
  autoClickers = parseInt(localStorage.getItem("autoClickers")) || 0;
  doubleClickers = parseInt(localStorage.getItem("doubleClickers")) || 0;
  multipliers = parseInt(localStorage.getItem("multipliers")) || 0;
  multiplierCost = parseInt(localStorage.getItem("multiplierCost")) || 200;
  purchasedSkins = JSON.parse(localStorage.getItem("purchasedSkins")) || [];
  activeKibbleImage =
    localStorage.getItem("activeKibbleImage") || "assets/kibble/default.png";
  kibblesPerClick = 1 + doubleClickers; // Mise à jour du bonus des doubleClickers

  updateDisplay();
}

// Sauvegarder les données dans le localStorage
function saveScore() {
  localStorage.setItem("kibbles", kibbles);
  localStorage.setItem("autoClickers", autoClickers);
  localStorage.setItem("doubleClickers", doubleClickers);
  localStorage.setItem("multipliers", multipliers);
  localStorage.setItem("multiplierCost", multiplierCost);
  localStorage.setItem("purchasedSkins", JSON.stringify(purchasedSkins));
  localStorage.setItem("activeKibbleImage", activeKibbleImage);
}

/* ==================== */
/*  AFFICHAGE ET ANIMATIONS */
/* ==================== */

// Met à jour l'affichage des statistiques
function updateDisplay() {
  kibbleCount.textContent = kibbles.toLocaleString();
  autoClickerCount.textContent = autoClickers;
  doubleClickerCount.textContent = doubleClickers;
  multiplierCostDisplay.textContent = multiplierCost;
  document.getElementById("multipliers").textContent = multipliers;

  // Mettre à jour l'état des boutons
  updateButtonStates();
  updateGif();
}

// Met à jour le GIF en fonction du seuil atteint
function updateGif() {
  if (gifs.length === 0) return;

  const currentGif = gifs
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif && currentGif.threshold !== lastThreshold) {
    lastThreshold = currentGif.threshold;
    nyanCatGif.src = currentGif.file;
    showToast(`Nouveau skin débloqué: ${currentGif.name}!`, "success");
  }
}

// Crée une particule de croquette au clic
function createKibbleParticle(e) {
  console.log("Clic détecté aux coordonnées:", e.clientX, e.clientY); // Debug
  const particle = document.createElement("div");
  particle.className = "kibble-particle";
  particle.innerHTML = `<img src="${activeKibbleImage}" style="width:30px;height:30px;">`;

  const x = e.clientX;
  const y = e.clientY;

  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.willChange = "transform, opacity";

  // Animation aléatoire
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 100;
  const xEnd = Math.cos(angle) * distance;
  const yEnd = Math.sin(angle) * distance - 100;

  particle.style.setProperty("--x-end", `${xEnd}px`);
  particle.style.setProperty("--y-end", `${yEnd}px`);
  particle.style.setProperty("--rotation", `${Math.random() * 360}deg`);

  document.body.appendChild(particle);
  particle.style.animation = "kibble-float 1s forwards";

  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Gère le clic sur le Nyan Cat
function handleNyanCatClick(e) {
  // Calcul du gain
  const gain = kibblesPerClick * (multipliers + 1);

  // Ajout immédiat des kibbles
  kibbles += gain;
  kibbleCount.textContent = kibbles;

  // Animation sans restriction
  createKibbleParticle(e, gain);

  // Sauvegarde (optimisée pour ne pas surcharger)
  const now = Date.now();
  if (now - lastClickTime > 1000) {
    // Sauvegarde max 1 fois/seconde
    saveScore();
    lastClickTime = now;
  }

  updateGif();
}

/* ==================== */
/*  BOUTIQUE ET SKINS */
/* ==================== */

// Charge la boutique de skins
function loadKibbleShop() {
  fetch("data/kibble.json")
    .then((response) => response.json())
    .then((kibblesData) => {
      const kibbleShop = document.getElementById("kibbleShop");
      kibbleShop.innerHTML = "";

      kibblesData.forEach((kibble) => {
        const isPurchased = purchasedSkins.includes(kibble.id);
        const isEquipped = activeKibbleImage === kibble.file;
        const canAfford = kibbles >= kibble.cost;

        const kibbleItem = document.createElement("div");
        kibbleItem.className = `kibble-item ${isEquipped ? "active-skin" : ""}`;
        kibbleItem.innerHTML = `
                    <img src="${kibble.file}" alt="${
          kibble.name
        }" class="max-h-full max-w-full object-contain">
                    <h4 class="text-lg font-bold">${kibble.name}</h4>
                    <p class="text-sm">${kibble.description}</p>
                    <p class="text-yellow-300">Prix: ${
                      kibble.cost
                    } croquettes</p>
                    <button class="buy-kibble-btn mt-2 px-4 py-2 rounded-lg transition-colors 
                        ${
                          isEquipped
                            ? "bg-green-600"
                            : isPurchased
                            ? "bg-blue-600"
                            : canAfford
                            ? "bg-purple-600"
                            : "bg-gray-600"
                        }
                        ${
                          !isPurchased && !canAfford ? "cursor-not-allowed" : ""
                        }"
                        data-id="${kibble.id}" ${
          !isPurchased && !canAfford ? "disabled" : ""
        }>
                        ${
                          isEquipped
                            ? "Équipé"
                            : isPurchased
                            ? "Équiper"
                            : "Acheter"
                        }
                    </button>
                `;
        kibbleShop.appendChild(kibbleItem);
      });

      document.querySelectorAll(".buy-kibble-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const kibbleId = parseInt(e.target.dataset.id, 10);
          buyKibbleSkin(kibbleId, kibblesData);
        });
      });
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des skins:", error)
    );
}

// Achète ou équipe un skin
function buyKibbleSkin(kibbleId, kibblesData) {
  const selectedKibble = kibblesData.find((k) => k.id === kibbleId);
  if (!selectedKibble) return;

  const isPurchased = purchasedSkins.includes(kibbleId);

  if (isPurchased) {
    // Équiper le skin déjà acheté
    activeKibbleImage = selectedKibble.file;
    saveScore();
    loadKibbleShop();
    showToast(`Skin ${selectedKibble.name} équipé!`, "success");
  } else if (kibbles >= selectedKibble.cost) {
    // Acheter le skin
    kibbles -= selectedKibble.cost;
    purchasedSkins.push(kibbleId);
    activeKibbleImage = selectedKibble.file;
    saveScore();
    updateDisplay();
    loadKibbleShop();
    showToast(`Skin ${selectedKibble.name} acheté et équipé!`, "success");
  } else {
    showToast("Pas assez de croquettes!", "error");
  }
}

/* ==================== */
/*  AMÉLIORATIONS */
/* ==================== */

// Acheter un AutoClicker
function buyAutoClicker() {
  const cost = 50 + autoClickers * 20; // Coût augmente avec le nombre possédé

  if (kibbles >= cost) {
    kibbles -= cost;
    autoClickers++;
    saveScore();
    updateDisplay();
    showToast("AutoClicker acheté!", "success");
  } else {
    showToast("Pas assez de croquettes!", "error");
  }
}

// Acheter un DoubleClicker
function buyDoubleClicker() {
  const cost = 100 + doubleClickers * 50;

  if (kibbles >= cost) {
    kibbles -= cost;
    doubleClickers++;
    kibblesPerClick = 1 + doubleClickers; // Chaque doubleClicker ajoute +1 au clic
    saveScore();
    updateDisplay();
    showToast("DoubleClicker acheté!", "success");
  } else {
    showToast("Pas assez de croquettes!", "error");
  }
}

// Acheter un Multiplicateur
function buyMultiplier() {
  if (kibbles >= multiplierCost) {
    kibbles -= multiplierCost;
    multipliers++;
    multiplierCost = Math.floor(multiplierCost * 1.5); // Coût augmente de 50%
    saveScore();
    updateDisplay();
    showToast("Multiplicateur acheté!", "success");
  } else {
    showToast("Pas assez de croquettes!", "error");
  }
}

// Met à jour l'état des boutons en fonction des fonds
function updateButtonStates() {
  const autoClickerCost = 50 + autoClickers * 20;
  const doubleClickerCost = 100 + doubleClickers * 50;

  document.getElementById("autoClickerBtn").disabled =
    kibbles < autoClickerCost;
  document.getElementById("doubleClickerBtn").disabled =
    kibbles < doubleClickerCost;
  document.getElementById("multiplierBtn").disabled = kibbles < multiplierCost;
}

/* ==================== */
/*  FONCTIONS UTILITAIRES */
/* ==================== */

// Affiche une notification
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : "⚠"}</span>
        <span>${message}</span>
    `;

  const container = document.getElementById("toastContainer");
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Charge la liste des skins de Nyan Cat
function loadGifs() {
  fetch("data/skins.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des GIFs.");
      }
      return response.json();
    })
    .then((data) => {
      gifs = data;
      updateGif(); // Met à jour le GIF immédiatement après le chargement
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des GIFs :", error);
    });
}

// Réinitialise le jeu
function resetGame() {
  if (
    confirm(
      "Êtes-vous sûr de vouloir réinitialiser la partie? Tout sera perdu!"
    )
  ) {
    kibbles = 0;
    kibblesPerClick = 1;
    autoClickers = 0;
    doubleClickers = 0;
    multipliers = 0;
    multiplierCost = 200;
    purchasedSkins = [];
    activeKibbleImage = "assets/kibble/default.png";
    localStorage.clear();
    updateDisplay();
    loadKibbleShop();
    showToast("Jeu réinitialisé!", "info");
    setupMusicControls();
  }
}

/* ==================== */
/*  CONFIGURATION DES ÉVÉNEMENTS */
/* ==================== */

function setupEventListeners() {
  if (!nyanCatGif) {
    console.error("Element nyanCatGif non trouvé");
    return;
  }
  // Clic sur le Nyan Cat
  nyanCatGif.addEventListener("click", handleNyanCatClick);

  // Boutons de la boutique
  document
    .getElementById("autoClickerBtn")
    .addEventListener("click", buyAutoClicker);
  document
    .getElementById("doubleClickerBtn")
    .addEventListener("click", buyDoubleClicker);
  document
    .getElementById("multiplierBtn")
    .addEventListener("click", buyMultiplier);
  document.getElementById("resetGameBtn").addEventListener("click", resetGame);

  // Bouton de basculement du panneau boutique (mobile)
  shopToggle.addEventListener("click", () => {
    shopPanel.classList.toggle("translate-x-full");
  });
}

/* ==================== */
/*  BOUCLE DE JEU */
/* ==================== */

// Boucle principale du jeu
setInterval(() => {
  if (autoClickers > 0) {
    kibbles += autoClickers * (multipliers + 1);
    updateDisplay();
    saveScore();
  }
}, 1000);

/* ==================== */
/*  GESTION DE LA MUSIQUE */
/* ==================== */

let musicEnabled = false;
let musicFadeInterval = null;

// Activation audio au premier clic
function enableAudio() {
  if (musicEnabled) return;

  music.volume = 0.5;
  music
    .play()
    .then(() => {
      music.pause();
      music.currentTime = 0;
      musicEnabled = true;
      document.removeEventListener("click", enableAudio);
    })
    .catch((e) => console.error("Audio error:", e));
}

// Fondu de sortie
function fadeOutMusic() {
  const fadeDuration = 400; // 0.4 secondes
  const steps = 10;
  const stepTime = fadeDuration / steps;
  const volumeStep = music.volume / steps;

  clearInterval(musicFadeInterval);

  musicFadeInterval = setInterval(() => {
    if (music.volume > volumeStep) {
      music.volume -= volumeStep;
    } else {
      music.pause();
      music.volume = 0.5; // Reset volume
      clearInterval(musicFadeInterval);
    }
  }, stepTime);
}

// Gestion du clic
nyanCatGif.addEventListener("click", () => {
  if (!musicEnabled) {
    enableAudio();
    return;
  }

  // Relancer la musique si besoin
  if (music.paused) {
    music.currentTime = 0;
    music.volume = 0.5;
    music.play().catch((e) => console.error("Play error:", e));
  }

  // Réinitialiser le timer de fondu
  clearTimeout(music.pauseTimer);
  music.pauseTimer = setTimeout(fadeOutMusic, 800); // 0.8s avant fondu
});

// Initialisation
document.addEventListener("click", enableAudio);
music.volume = 0.5;
initGame();

function updateKibbleCount() {
  const kibbleCount = document.getElementById("kibbleCount");
  kibbleCount.textContent = kibbles;

  // Ajoute une animation temporaire
  kibbleCount.classList.add("kibble-bounce");
  setTimeout(() => {
    kibbleCount.classList.remove("kibble-bounce");
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const shopToggle = document.getElementById("shopToggle");
  const shopPanel = document.getElementById("shopPanel");
  const closeShopBtn = document.getElementById("closeShopBtn");

  // Fermer le shop par défaut
  shopPanel.classList.remove("open");

  // Basculer l'état du shop (ouvrir/fermer)
  shopToggle.addEventListener("click", () => {
    shopPanel.classList.toggle("open");
  });

  // Fermer le shop avec le bouton "Retour"
  closeShopBtn.addEventListener("click", () => {
    shopPanel.classList.remove("open");
  });
});
