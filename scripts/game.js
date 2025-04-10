let kibbles = 0;
let kibblesPerClick = 1;

const kibbleDisplay = document.getElementById("kibble");
const kibbleCount = document.getElementById("kibbleCount");

// Clique manuel
kibbleDisplay.addEventListener("click", () => {
  kibbles += kibblesPerClick;
  saveScore(); // Appel à la fonction de stockage
  updateDisplay(); // Mise à jour de l'affichage
});

// Mise à jour de l'affichage
function updateDisplay() {
  kibbleCount.textContent = kibbles;
  updateGif(); // Mise à jour du GIF (appel à gifManager.js)
}
