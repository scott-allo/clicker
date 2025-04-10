// Charger les données depuis le localStorage
function loadGame() {
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
}

// Sauvegarder les données dans le localStorage
function saveScore() {
  localStorage.setItem("kibbles", kibbles);
  localStorage.setItem("autoClickers", autoClickers);
  localStorage.setItem("doubleClickers", doubleClickers);
  localStorage.setItem("multipliers", multipliers);
}

// Charger les données au démarrage
loadGame();
