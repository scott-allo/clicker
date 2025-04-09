let kibbles = 0;
let kibblesPerClick = 1;
let autoClickers = 0;
let doubleClickers = 0;

const kibbleDisplay = document.getElementById("kibble");
const kibbleCount = document.getElementById("kibbleCount");
const autoClickerCount = document.getElementById("autoClickers");
const doubleClickerCount = document.getElementById("doubleClicker");

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
  kibblesPerClick.textContent = kibblesPerClick;
}
