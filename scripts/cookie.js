let kibbles = 0;
let kibblesPerClick = 1;
let doubleClickers = 0;
let autoClickers = 0;
let multipliers = 0;
let multiplierCost = 200;
let gifs = []; // Liste des GIFs chargée dynamiquement

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
  kibble.src = "assets/kibble/kibble.png"; // Assure-toi que l'image existe
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

// Réinitialiser le jeu
function resetGame() {
  if (confirm("Es-tu sûr de vouloir réinitialiser la partie ? Cette action est irréversible.")) {
    kibbles = 0;
    kibblesPerClick = 1;
    autoClickers = 0;
    doubleClickers = 0;
    multipliers = 0;
    multiplierCost = 200;
    localStorage.clear(); // Supprime toutes les données sauvegardées
    updateDisplay(); // Met à jour l'affichage
    alert("La partie a été réinitialisée !");
  }
}

// Ajouter un écouteur d'événement pour le bouton de reset
document.getElementById("resetGameBtn").addEventListener("click", resetGame);

// Charger la boutique de skins au démarrage
loadKibbleShop();

function loadKibbleShop() {
  fetch("data/kibble.json")
    .then((response) => response.json())
    .then((kibbles) => {
      const kibbleShop = document.getElementById("kibbleShop");
      kibbleShop.innerHTML = ""; // Réinitialise la boutique

      kibbles.forEach((kibble) => {
        const kibbleItem = document.createElement("div");
        kibbleItem.className =
          "kibble-item bg-purple-800 p-4 rounded-lg shadow-lg text-center";

        kibbleItem.innerHTML = `
          <img src="${kibble.file}" alt="${kibble.name}" class="w-16 h-16 mx-auto mb-2" />
          <h4 class="font-bold text-lg">${kibble.name}</h4>
          <p class="text-sm italic mb-2">${kibble.description}</p>
          <p class="font-bold mb-2">Coût : ${kibble.cost} croquettes</p>
          <button class="buy-kibble-btn bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg" data-id="${kibble.id}">
            Acheter
          </button>
        `;

        kibbleShop.appendChild(kibbleItem);
      });

      // Masquer le kibble par défaut si un autre skin est actif
      if (activeKibbleImage !== "assets/kibble/kibble.png") {
        const defaultKibble = document.querySelector(
          '.kibble-item img[src="assets/kibble/kibble.png"]'
        );
        if (defaultKibble) {
          defaultKibble.closest(".kibble-item").style.display = "none";
        }
      }

      // Ajouter des écouteurs d'événements pour les boutons d'achat
      document.querySelectorAll(".buy-kibble-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const kibbleId = parseInt(e.target.dataset.id, 10);
          buyKibbleSkin(kibbleId, kibbles);
        });
      });
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des skins de croquettes :", error)
    );
}

// Fonction pour acheter un skin de croquette
function buyKibbleSkin(kibbleId, kibblesData) {
  const selectedKibble = kibblesData.find((kibble) => kibble.id === kibbleId);

  if (!selectedKibble) {
    alert("Skin introuvable !");
    return;
  }

  if (kibbles >= selectedKibble.cost) {
    kibbles -= selectedKibble.cost;
    saveScore();
    alert(`Félicitations ! Vous avez acheté le skin "${selectedKibble.name}"`);

    // Mettre à jour l'image active pour les clics
    activeKibbleImage = selectedKibble.file;

    // Marquer le skin comme actif
    document.querySelectorAll(".kibble-item").forEach((item) => {
      item.classList.remove("active-skin");
    });
    document
      .querySelector(`[data-id="${kibbleId}"]`)
      .closest(".kibble-item")
      .classList.add("active-skin");

    // Masquer le kibble par défaut
    const defaultKibble = document.querySelector(
      '.kibble-item img[src="assets/kibble/kibble.png"]'
    );
    if (defaultKibble) {
      defaultKibble.closest(".kibble-item").style.display = "none";
    }

    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes pour acheter ce skin !");
  }
}

function updateClickImage(imageFile) {
  activeKibbleImage = imageFile; // Met uniquement à jour l'image active pour les clics
}
