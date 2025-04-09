// Configuration
let kibbles = 0;
let gifs = []; // Remplacé par le chargement dynamique
const elements = {
  kibbleDisplay: document.getElementById("kibble"),
  kibbleCount: document.getElementById("kibbleCount"),
  autoClickerCount: document.getElementById("autoClickers"),
  doubleClickerCount: document.getElementById("doubleClicker"),
  nyanCatGif: document.querySelector(".nyancatgif"),
};

let lastThreshold = -1;

// Chargement des GIFs
async function loadGifs() {
  try {
    const response = await fetch("data/nyancat.json");
    gifs = await response.json();
    updateGif();
  } catch (error) {
    console.error("Erreur lors du chargement des GIFs :", error);
    // Fallback si le chargement échoue
    gifs = [{ id: 1, name: "Default", file: "nyan-cat.gif", threshold: 0 }];
  }
}

// Mise à jour du GIF
function updateGif() {
  if (!gifs.length) return;

  const currentGif = [...gifs]
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif && currentGif.threshold !== lastThreshold) {
    console.log(`Nouveau palier: ${currentGif.threshold} - ${currentGif.file}`);
    elements.nyanCatGif.src = `assets/${currentGif.file}`;
    lastThreshold = currentGif.threshold;

    // Animation de célébration
    elements.kibbleDisplay.classList.add("celebrate");
    setTimeout(
      () => elements.kibbleDisplay.classList.remove("celebrate"),
      1000
    );
  }
}

// Initialisation
loadGifs();
