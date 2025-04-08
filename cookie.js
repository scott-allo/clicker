let cookies = 0;
let cookiesPerClick = 1;
let autoClickers = 0;

const cookieDisplay = document.getElementById("cookie");
const cookieCount = document.getElementById("cookieCount");
const autoClickerCount = document.getElementById("autoClickers");

// Clique manuel
cookieDisplay.addEventListener("click", () => {
  cookies += cookiesPerClick;
  updateDisplay();
});

//================BOUTIQUE==================

// Clique x2

function buyDoubleClicker() {
  const cost = 100;
  if (cookies >= cost) {
    cookies -= cost;
    cookiesPerClick *= 2;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de cookies !");
  }
}

// Achat d'un autoclicker
function buyAutoClicker() {
  const cost = 50;
  if (cookies >= cost) {
    cookies -= cost;
    autoClickers++;
    updateDisplay();
  } else {
    alert("Tu n'as pas assez de cookies !");
  }
}

// Boucle automatique
setInterval(() => {
  cookies += autoClickers;
  updateDisplay();
}, 1000); // chaque seconde

// Mise à jour de l'affichage
function updateDisplay() {
  cookieCount.textContent = cookies;
  autoClickerCount.textContent = autoClickers;
}
