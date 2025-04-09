let kibbles = 0;
let kibblesPerClick = 1;
let autoClickers = 0;
let gifs = [
  { "id": 1, "name": "AngelicNyan", "file": "AngelicNyan.gif", "threshold": 0 },
  { "id": 2, "name": "Cleo", "file": "Cleo.gif", "threshold": 50 },
  { "id": 3, "name": "DemonicNyan", "file": "DemonicNyan.gif", "threshold": 100 },
  { "id": 4, "name": "FancyNyan", "file": "FancyNyan.gif", "threshold": 200 },
  { "id": 5, "name": "FiestaDog", "file": "FiestaDog.gif", "threshold": 300 }
]; // Liste des GIFs chargée dynamiquement

const kibbleDisplay = document.getElementById("kibble");
const kibbleCount = document.getElementById("kibbleCount");
const autoClickerCount = document.getElementById("autoClickers");
const doubleClickerCount = document.getElementById("doubleClicker");
const nyanCatGif = document.querySelector(".nyancatgif");
let lastThreshold = -1; // Variable pour suivre le dernier palier atteint

// Charger les GIFs depuis le fichier JSON
fetch("data/nyancat.json")
  .then((response) => response.json())
  .then((data) => {
    gifs = data;
    updateGif(); // Met à jour le GIF initial
  })
  .catch((error) => console.error("Erreur lors du chargement des GIFs :", error));

// Fonction pour mettre à jour le GIF
function updateGif() {
  // Trouve le GIF avec le plus grand seuil inférieur ou égal à kibbles
  const currentGif = gifs
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif) {
    // Vérifie si le palier a changé
    if (currentGif.threshold !== lastThreshold) {
      console.log(`Nouveau palier atteint : ${currentGif.threshold} croquettes, affichage du GIF : ${currentGif.file}`);
      lastThreshold = currentGif.threshold; // Met à jour le dernier palier atteint
    }
    nyanCatGif.src = `assets/${currentGif.file}`;
  }
}

// Clique manuel
kibbleDisplay.addEventListener("click", () => {
  kibbles += kibblesPerClick;
  updateDisplay();
});

//================BOUTIQUE==================

// Clicker x2
function buyDoubleClicker() {
  const cost = 100;
  if (kibbles >= cost) {
    kibbles -= cost;
    kibblesPerClick *= 2;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

// Autoclicker
function buyAutoClicker() {
  const cost = 50;
  if (kibbles >= cost) {
    kibbles -= cost;
    autoClickers++;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

// Boucle automatique
setInterval(() => {
  kibbles += autoClickers;
  updateDisplay();
}, 1000); // par seconde

// MAJ affichage
function updateDisplay() {
  kibbleCount.textContent = kibbles;
  autoClickerCount.textContent = autoClickers;
  doubleClickerCount.textContent = kibblesPerClick; // Corrigez ici pour afficher correctement
  updateGif(); // Vérifie et met à jour le GIF
}
