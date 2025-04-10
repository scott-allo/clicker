let autoClickers = 0;
let doubleClickers = 0;
let multipliers = 0;
let multiplierCost = 200;

const autoClickerCount = document.getElementById("autoClickers");
const doubleClickerCount = document.getElementById("doubleClicker");

// Acheter un AutoClicker
function buyAutoClicker() {
  const cost = 50;
  if (kibbles >= cost) {
    kibbles -= cost;
    autoClickers++;
    saveScore(); // Sauvegarde immédiate
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

document
  .getElementById("autoClickerBtn")
  .addEventListener("click", buyAutoClicker);

// Acheter un DoubleClicker
function buyDoubleClicker() {
  const cost = 100;
  if (kibbles >= cost) {
    kibbles -= cost;
    doubleClickers++;
    kibblesPerClick *= 2;
    saveScore(); // Sauvegarde immédiate
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de croquettes !");
  }
}

document
  .getElementById("doubleClickerBtn")
  .addEventListener("click", buyDoubleClicker);
