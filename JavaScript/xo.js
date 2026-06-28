const squares = document.querySelectorAll(".xo-board .sq");
const board = document.querySelector(".xo-board");
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const xoWinPopUp = document.querySelector(".win-xo-popup ");
const popUpTxt = document.querySelector(".popup-text");
const xoDrawPopUp = document.querySelector(".draw-xo-popup ");
const xoChampPopUp = document.querySelector(".champ-xo-popup ");
const champPopUpTxt = document.querySelector(".champ-popup-text");
const playersData = document.querySelector(".players-data");
const player1Display = document.querySelector("#p1-display");
const player2Display = document.querySelector("#p2-display");
const player1Inp = document.querySelector(".p1-input");
const player2Inp = document.querySelector(".p2-input");
const drawPopUpTxt = document.querySelector(".draw-popup-text");
const xoRole = document.querySelector(".role");
const xoHeader = document.querySelector(".xo-header");
const xoCounters = document.querySelector(".counters");

let xArray = [];
let oArray = [];
let role = "x";
let nextGameStarter = "x";
let xoP1Counter = 0;
let xoP2Counter = 0;
let p1Name;
let p2Name;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("sq")) {
    putXo(e.target);
  }

  if (e.target.classList.contains("xo-players-btn")) {
    xoRoleName();
    updateScoresDisplay();
    playersData.classList.add("hidden");
    board.classList.remove("hidden");
  }

  if (e.target.classList.contains("xo-new-game")) {
    xoRoundReset();
    xoRoleName();
  }

  if (e.target.className === "go-home" || e.target.className === "home-btn" || e.target.className === "home-txt") {
    goHome(xoGame);
  }

  if (e.target.classList.contains("xo-new-champ")) {
    xoReset();
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function putXo(curentSq) {
  curentSq.textContent = role === "x" ? "X" : "O";
  role === "x" ? xArray.push(+curentSq.dataset.index) : oArray.push(+curentSq.dataset.index);
  curentSq.classList.add("not-allowed");

  checkXoWin();

  if (!board.classList.contains("not-allowed")) {
    role = role === "x" ? "o" : "x";
    xoRoleName();
  }
}
function checkXoWin() {
  let someOneWon = false;
  winningCombinations.forEach((comb) => {
    if (
      (xArray.includes(comb[0]) && xArray.includes(comb[1]) && xArray.includes(comb[2])) ||
      (oArray.includes(comb[0]) && oArray.includes(comb[1]) && oArray.includes(comb[2]))
    ) {
      if (!someOneWon) {
        xoWinPopUp.classList.remove("hidden");
        board.classList.add("not-allowed");

        if (xArray.includes(comb[0]) && xArray.includes(comb[1]) && xArray.includes(comb[2])) {
          popUpTxt.textContent = `الفائز هو ${player1Inp.value}`;
          nextGameStarter = "o";
          xoP1Counter++;
        } else if (oArray.includes(comb[0]) && oArray.includes(comb[1]) && oArray.includes(comb[2])) {
          popUpTxt.textContent = `الفائز هو ${player2Inp.value}`;
          nextGameStarter = "x";
          xoP2Counter++;
        }
        someOneWon = true;
      }
    }
  });
  if (someOneWon) {
    updateScoresDisplay();
    endGame();
  }

  if (xArray.length + oArray.length === 9 && !board.classList.contains("not-allowed")) {
    xoDrawPopUp.classList.remove("hidden");
    drawPopUpTxt.textContent = "تعادل";
  }
}

function setPlayersName() {
  board.classList.add("hidden");
  playersData.classList.remove("hidden");
  xoCounters.classList.remove("hidden");
}

function updateScoresDisplay() {
  p1Name = player1Inp.value || "اللاعب اكس";
  p2Name = player2Inp.value || " اللاعب او";

  player1Display.textContent = `${p1Name} : ${xoP1Counter}`;
  player2Display.textContent = `${p2Name} : ${xoP2Counter}`;
}

function xoRoundReset() {
  xArray = [];
  oArray = [];
  role = nextGameStarter;
  xoWinPopUp.classList.add("hidden");
  xoDrawPopUp.classList.add("hidden");
  xoRoleName();
  squares.forEach((sq) => {
    sq.textContent = "";
    sq.classList.remove("not-allowed");
  });
  board.classList.remove("not-allowed");
}

function xoReset() {
  xArray = [];
  oArray = [];
  role = "x";
  nextGameStarter = "x";
  xoWinPopUp.classList.add("hidden");
  xoDrawPopUp.classList.add("hidden");
  xoChampPopUp.classList.add("hidden");
  xoHeader.classList.add("hidden");
  player1Inp.value = "";
  player2Inp.value = "";
  xoP1Counter = 0;
  xoP2Counter = 0;
  updateScoresDisplay();
  squares.forEach((sq) => {
    sq.textContent = "";
    sq.classList.remove("not-allowed");
  });
  board.classList.remove("not-allowed");
  setPlayersName();
}

function xoRoleName() {
  xoHeader.classList.remove("hidden");
  if (player1Inp.value.trim() === "") {
    player1Inp.value = "اللاعب اكس";
  }
  if (player2Inp.value.trim() === "") {
    player2Inp.value = "اللاعب او";
  }

  let currentPname = role === "x" ? player1Inp.value : player2Inp.value;
  xoRole.style.color = currentPname === player1Inp.value ? "white" : "red";
  xoRole.textContent = ` ${currentPname}`;
}

function endGame() {
  if (xoP1Counter === 3 || xoP2Counter === 3) {
    xoWinPopUp.classList.add("hidden");
    xoChampPopUp.classList.remove("hidden");
    if (xoP1Counter === 3) {
      champPopUpTxt.textContent = `الفائز بالبطولة هو ${p1Name}`;
    }
    if (xoP2Counter === 3) {
      champPopUpTxt.textContent = `الفائز بالبطولة هو ${p2Name}`;
    }
  }
}
