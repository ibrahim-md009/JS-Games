const home = document.querySelector(".home");
const toggleMenu = document.querySelector(".toggle-menu");
const hangmanGame = document.querySelector(".container");
const xoGame = document.querySelector(".xo-container");
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");
const logo = document.querySelector(".logo");

document.addEventListener("click", (e) => {
  if (e.target.id === "play-hangman-btn") {
    playGames(hangmanGame);
  }
  if (e.target.id === "play-xo-btn") {
    playGames(xoGame);
  }

  if (e.target.className === "menu-btn") {
    menu();
  }
});

function playGames(game) {
  home.classList.add("hidden");
  game.classList.remove("hidden");
  if (game === hangmanGame) {
    resetGame();
    getWords();
  }
  if (game === xoGame) {
    xoReset();
    setPlayersName();
  }
}

function menu() {
  nav.classList.toggle("show");

  menuBtn.textContent = nav.classList.contains("show") ? "X" : "☰";
  menuBtn.style.color = nav.classList.contains("show") ? "black" : "white";

  logo.style.color = nav.classList.contains("show") ? "black" : "white";
}
document.querySelectorAll(".nav-links").forEach((l) => {
  l.onclick = function () {
    if (window.innerWidth <= 710) {
      nav.classList.remove("show");
      menuBtn.textContent = "☰";
      menuBtn.style.color = "white";
      logo.style.color = "white";
    }
  };
});

function goHome(currentGame) {
  currentGame.classList.add("hidden");
  home.classList.remove("hidden");
  resetGame();
}
