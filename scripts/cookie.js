let kibbles = 0;
let kibblesPerClick = 1;
let doubleClickers = 0;
let autoClickers = 0;
let multipliers = 0;
let multiplierCost = 200;
let gifs = []; // Liste des GIFs chargée dynamiquement
// Liste des GIFs chargée dynamiquement

const kibbleDisplay = document.getElementById("kibble");
const kibbleCount = document.getElementById("kibbleCount");
const autoClickerCount = document.getElementById("autoClickers");
const doubleClickerCount = document.getElementById("doubleClicker");
const nyanCatGif = document.querySelector(".nyancatgif");
let lastThreshold = -1; // Variable pour suivre le dernier palier atteint

// Charger les données depuis le localStorage au démarrage
if (localStorage.getItem("kibbles")) {
  kibbles = parseInt(localStorage.getItem("kibbles"), 10);
}
if (localStorage.getItem("autoClickers")) {
  autoClickers = parseInt(localStorage.getItem("autoClickers"), 10);
}
if (localStorage.getItem("doubleClickers")) {
  doubleClickers = parseInt(localStorage.getItem("doubleClickers"), 10);
}
if (localStorage.getItem("multipliers")) {
  multipliers = parseInt(localStorage.getItem("multipliers"), 10);
}

// Mettre à jour l'affichage après restauration
updateDisplay();

// Charger les GIFs depuis le fichier JSON
fetch("data/nyancat.json")
  .then((response) => response.json())
  .then((data) => {
    gifs = data;
    updateGif(); // Met à jour le GIF initial
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des GIFs :", error)
  );

// Fonction pour mettre à jour le GIF
function updateGif() {
  // Trouve le GIF avec le plus grand seuil inférieur ou égal à kibbles
  const currentGif = gifs
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif) {
    // Vérifie si le palier a changé
    if (currentGif.threshold !== lastThreshold) {
      console.log(
        `Nouveau palier atteint : ${currentGif.threshold} croquettes, affichage du GIF : ${currentGif.file}`
      );
      lastThreshold = currentGif.threshold; // Met à jour le dernier palier atteint
    }
    nyanCatGif.src = `assets/${currentGif.file}`;
  }
}

// Clique manuel
kibbleDisplay.addEventListener("click", () => {
  kibbles += kibblesPerClick;
  saveScore(); // Sauvegarde immédiate
  updateDisplay();
});

//================BOUTIQUE==================
console.log(kibblesPerClick);
// Clicker x2
function buyDoubleClicker() {
  const cost = 100;
  if (kibbles >= cost) {
    kibbles -= cost;
    saveScore(); // Sauvegarde immédiate
    doubleClickers++;
    kibblesPerClick *= 2;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

document
  .getElementById("doubleClickerBtn")
  .addEventListener("click", buyDoubleClicker);

// Autoclicker
function buyAutoClicker() {
  const cost = 50;
  if (kibbles >= cost) {
    kibbles -= cost;
    saveScore(); // Sauvegarde immédiate
    autoClickers++;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

document
  .getElementById("autoClickerBtn")
  .addEventListener("click", buyAutoClicker);

// Multiplicateur de croquettes

function buyMultiplier() {
  if (kibbles >= multiplierCost) {
    kibbles -= multiplierCost;
    saveScore(); // Sauvegarde immédiate
    multipliers++;
    kibblesPerClick += 1; // Chaque multiplicateur augmente les croquettes par clic
    updateDisplay();
    multiplierCost = Math.floor(multiplierCost * 3); // Augmente le prix pour chaque nouvel achat
    document.getElementById("multiplierCost").textContent =
      "Prix : " + multiplierCost + " croquettes";
    document.getElementById("multipliers").textContent =
      "Nombre : " + multipliers;
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

kibbleDisplay.addEventListener("click", (e) => {
  kibbles += kibblesPerClick * (multipliers + 1);
  updateDisplay();

  // Créer une animation de croquette à la position du clic
  const kibble = document.createElement("img");
  kibble.src = "assets/kibble.png"; // Assure-toi que l'image existe
  kibble.style.position = "absolute";
  kibble.style.width = "30px"; // Largeur de l'image des croquettes
  kibble.style.height = "30px"; // Hauteur de l'image des croquettes
  kibble.style.left = `${e.pageX - 15}px`; // Position de l'élément au clic
  kibble.style.top = `${e.pageY - 15}px`;
  kibble.style.zIndex = "9999"; // Assurer que les croquettes soient au-dessus des autres éléments
  document.body.appendChild(kibble);

  // Animation: les croquettes montent et disparaissent
  setTimeout(() => {
    kibble.style.transition = "transform 1s ease-out";
    kibble.style.transform = "translateY(-50px)"; // Déplacement vers le haut
  }, 0);

  // Retirer l'élément après l'animation
  setTimeout(() => {
    kibble.remove();
  }, 1000);
});
// Boucle automatique
setInterval(() => {
  kibbles += autoClickers;
  saveScore(); // Sauvegarde immédiate
  updateDisplay();
}, 1000); // par seconde

// Sauvegarder les données dans le localStorage
function saveScore() {
  console.log("Sauvegarde en cours : kibbles =", kibbles);
  localStorage.setItem("kibbles", kibbles);
  localStorage.setItem("autoClickers", autoClickers);
  localStorage.setItem("doubleClickers", doubleClickers);
  localStorage.setItem("multipliers", multipliers);
}

// MAJ affichage
function updateDisplay() {
  kibbleCount.textContent = kibbles; // Met à jour l'affichage des croquettes
  autoClickerCount.textContent = autoClickers; // Met à jour l'affichage des autoclickers
  doubleClickerCount.textContent = doubleClickers; // Met à jour l'affichage des double clickers
  document.getElementById("multipliers").textContent =
    "Nombre : " + multipliers; // Met à jour les multiplicateurs
  updateGif(); // Vérifie et met à jour le GIF
  saveScore(); // Sauvegarde le score dans le localStorage
}

document.getElementById("shopToggle").addEventListener("click", function () {
  document.getElementById("shopPanel").classList.toggle("hidden");
});

// Sauvegarder le score à intervalles réguliers (par exemple, toutes les 5 secondes)
setInterval(saveScore, 5000);
