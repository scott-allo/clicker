let activeKibbleImage = "assets/kibble/kibble.png"; // Image par défaut

function createKibbleAnimation(e) {
  // Vérifie si une nouvelle image a été définie
  if (!activeKibbleImage || activeKibbleImage === "assets/kibble/kibble.png") {
    console.error("Aucune image active définie ou image par défaut utilisée.");
    return; // Ne crée pas l'animation si l'image par défaut est encore active
  }

  // Crée une instance unique de l'image pour chaque clic
  const kibble = document.createElement("img");
  kibble.src = activeKibbleImage;
  kibble.draggable = false; // Désactive le glissement
  kibble.style.position = "absolute";
  kibble.style.width = "30px";
  kibble.style.height = "30px";
  kibble.style.left = `${e.pageX - 15}px`;
  kibble.style.top = `${e.pageY - 15}px`;
  kibble.style.zIndex = "9999";
  kibble.style.pointerEvents = "none"; // Empêche toute interaction avec l'image

  // Ajoute l'image au DOM
  document.body.appendChild(kibble);

  // Ajoute un délai pour permettre au DOM de rendre l'élément avant de démarrer l'animation
  requestAnimationFrame(() => {
    kibble.style.transition = "transform 1s ease-out, opacity 1s ease-out";
    kibble.style.transform = "translateY(-50px)";
    kibble.style.opacity = "0";
  });

  // Supprime l'élément après l'animation
  setTimeout(() => {
    kibble.remove();
  }, 1000);
}

kibbleDisplay.addEventListener("click", createKibbleAnimation);
