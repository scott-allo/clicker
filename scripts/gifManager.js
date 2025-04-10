let gifs = [];
let lastThreshold = -1;
const nyanCatGif = document.querySelector(".nyancatgif");

// Charger les GIFs depuis le fichier JSON
fetch("data/nyancat.json")
  .then((response) => response.json())
  .then((data) => {
    gifs = data;
    updateGif();
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des GIFs :", error)
  );

// Mettre à jour le GIF
function updateGif() {
  const currentGif = gifs
    .filter((gif) => kibbles >= gif.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];

  if (currentGif && currentGif.threshold !== lastThreshold) {
    lastThreshold = currentGif.threshold;
    nyanCatGif.src = `assets/${currentGif.file}`;
  }
}
