function createKibbleAnimation(e) {
  const kibble = document.createElement("img");
  kibble.src = "assets/kibble/kibble.png"; // Chemin mis à jour
  kibble.style.position = "absolute";
  kibble.style.width = "30px";
  kibble.style.height = "30px";
  kibble.style.left = `${e.pageX - 15}px`;
  kibble.style.top = `${e.pageY - 15}px`;
  kibble.style.zIndex = "9999";
  document.body.appendChild(kibble);

  setTimeout(() => {
    kibble.style.transition = "transform 1s ease-out";
    kibble.style.transform = "translateY(-50px)";
  }, 0);

  setTimeout(() => {
    kibble.remove();
  }, 1000);
}

kibbleDisplay.addEventListener("click", createKibbleAnimation);
