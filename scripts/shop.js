// Configuration
let kibblesPerClick = 1;
let autoClickers = 0;
let baseAutoClickerCost = 50;
let baseDoubleClickerCost = 100;

// Calcul des coûts progressifs
function getAutoClickerCost() {
  return baseAutoClickerCost * Math.pow(1.15, autoClickers);
}

function getDoubleClickerCost() {
  return baseDoubleClickerCost * Math.pow(1.3, kibblesPerClick / 2);
}

// Achat d'améliorations
function buyDoubleClicker() {
  const cost = Math.floor(getDoubleClickerCost());

  if (kibbles >= cost) {
    kibbles -= cost;
    kibblesPerClick *= 2;

    // Feedback visuel
    document.getElementById("doubleClicker").classList.add("purchased");
    setTimeout(
      () =>
        document.getElementById("doubleClicker").classList.remove("purchased"),
      500
    );

    updateDisplay();
  } else {
    showMessage("Pas assez de croquettes !");
  }
}

function buyAutoClicker() {
  const cost = Math.floor(getAutoClickerCost());

  if (kibbles >= cost) {
    kibbles -= cost;
    autoClickers++;

    // Feedback visuel
    document.getElementById("autoClickers").classList.add("purchased");
    setTimeout(
      () =>
        document.getElementById("autoClickers").classList.remove("purchased"),
      500
    );

    updateDisplay();
  } else {
    showMessage("Pas assez de croquettes !");
  }
}

// Système de messages
function showMessage(msg) {
  const msgElement = document.createElement("div");
  msgElement.className = "game-message";
  msgElement.textContent = msg;
  document.body.appendChild(msgElement);
  setTimeout(() => msgElement.remove(), 2000);
}

// Boucle de jeu optimisée
let lastUpdate = Date.now();
function gameLoop() {
  const now = Date.now();
  const delta = (now - lastUpdate) / 1000; // Temps en secondes

  if (autoClickers > 0) {
    kibbles += autoClickers * delta;
    updateDisplay();
  }

  lastUpdate = now;
  requestAnimationFrame(gameLoop);
}

// Démarrer la boucle de jeu
requestAnimationFrame(gameLoop);
