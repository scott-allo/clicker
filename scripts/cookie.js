// ================ CONFIGURATION ================ //
let kibbles = 0;
let kibblesPerClick = 1;
let autoClickers = 0;
let gifs = [];
let lastThreshold = -1;
let isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

// Éléments DOM
const elements = {
  kibbleDisplay: document.getElementById("kibble"),
  kibbleCount: document.getElementById("kibbleCount"),
  autoClickerCount: document.getElementById("autoClickers"),
  doubleClickerCount: document.getElementById("doubleClicker"),
  nyanCatGif: document.querySelector(".nyancatgif"),
};

// ================ CORE FUNCTIONS ================ //

// Chargement des GIFs
async function loadGifs() {
  try {
    const response = await fetch("data/nyancat.json");
    gifs = await response.json();
    preloadGifs(); // Préchargement pour meilleures performances
    updateGif();
  } catch (error) {
    console.error("Erreur lors du chargement des GIFs :", error);
    gifs = [{ id: 1, name: "Default", file: "nyan-cat.gif", threshold: 0 }];
    updateGif();
  }
}

// Préchargement des GIFs
function preloadGifs() {
  gifs.forEach((gif) => {
    const img = new Image();
    img.src = `assets/${gif.file}`;
    if (gif.mobileFile) {
      const mobileImg = new Image();
      mobileImg.src = `assets/${gif.mobileFile}`;
    }
  });
}

// Mise à jour du GIF
function updateGif() {
  if (!gifs.length) return;

  const currentGif = [...gifs]
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif && currentGif.threshold !== lastThreshold) {
    console.log(`Nouveau palier: ${currentGif.threshold} - ${currentGif.file}`);
    lastThreshold = currentGif.threshold;

    // Utilisation de la version mobile si disponible
    const gifFile =
      isMobile && currentGif.mobileFile
        ? currentGif.mobileFile
        : currentGif.file;

    elements.nyanCatGif.src = `assets/${gifFile}`;

    // Animation
    elements.kibbleDisplay.classList.add("celebrate");
    setTimeout(
      () => elements.kibbleDisplay.classList.remove("celebrate"),
      1000
    );
  }
}

// ================ GAME LOGIC ================ //

// Gestion des clics
function setupEventListeners() {
  elements.kibbleDisplay.addEventListener("touchstart", handleTap, {
    passive: true,
  });
  elements.kibbleDisplay.addEventListener("click", handleTap);
}

let lastTap = 0;
function handleTap(e) {
  // Empêche les doubles déclenchements
  const now = Date.now();
  if (now - lastTap < 300) return;
  lastTap = now;

  e.preventDefault();

  // Feedback visuel
  elements.kibbleDisplay.classList.add("tap-effect");
  setTimeout(() => elements.kibbleDisplay.classList.remove("tap-effect"), 200);

  // Ajout des croquettes
  kibbles += kibblesPerClick;
  updateDisplay();
}

// Mise à jour de l'affichage
function updateDisplay() {
  elements.kibbleCount.textContent = Math.floor(kibbles);
  elements.autoClickerCount.textContent = autoClickers;
  elements.doubleClickerCount.textContent = kibblesPerClick;
  updateGif();
}

// Boucle de jeu
function startGameLoop() {
  let lastUpdate = performance.now();

  function gameLoop(timestamp) {
    const delta = (timestamp - lastUpdate) / 1000; // en secondes
    lastUpdate = timestamp;

    if (autoClickers > 0) {
      kibbles += autoClickers * delta * (isMobile ? 0.5 : 1);
      updateDisplay();
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

// ================ INITIALISATION ================ //
function init() {
  loadGifs();
  setupEventListeners();
  startGameLoop();

  // Optimisation mobile
  if (isMobile) {
    document.body.classList.add("mobile");
    console.log("Mode mobile activé");
  }
}

init();
