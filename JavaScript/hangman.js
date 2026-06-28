const lettersContainer = document.querySelector(".letters");
const loserPopUp = document.querySelector(".loser-pop-up");
const winnerPopUp = document.querySelector(".winner-pop-up");
const theDraw = document.querySelector(".hangman-draw");
const langBtn = document.querySelector(".lang-btn");
const letterGuessContainer = document.querySelector(".letters-guess");

const catMenu = document.querySelector(".cat-menu");
const categoriesFilter = document.querySelector(".categories-filter");
const catList = document.querySelector(".cat-list");

let currentLang = "ar";
let randomValueValue = "";
let selectedCategory;
let wrongAttempts = 0;
let guessSpans;
let theChosenWord = [];
let randomPropertyName;

function generateLetters() {
  const enLetters = "abcdefghijklmnopqrstuvwxyz";
  const arLetters = "ابتثجحخدذرزسشصضطظعغفقكلمنهويةء";

  let theChosenLetters = currentLang === "ar" ? arLetters : enLetters;

  const lettersArray = [...theChosenLetters];

  lettersContainer.innerHTML = "";

  lettersArray.forEach((letter) => {
    const span = document.createElement("span");
    const theLetter = document.createTextNode(letter);

    span.appendChild(theLetter);
    span.classList.add("letter-box");
    lettersContainer.appendChild(span);
  });
}

async function getWords() {
  try {
    const data = await fetchWords();
    randomWord(data);
    renderBoard();
  } catch {
    fetchError();
  }
}

document.addEventListener("click", (e) => {
  if (e.target.className === "lang-btn") {
    changeLang();
  }

  if (e.target.classList.contains("new-game")) {
    resetGame();
    getWords();
  }

  if (e.target.classList.contains("cat-btn")) {
    e.stopPropagation();
    changeCategory(e.target);
  }

  if (e.target.className === "go-home" || e.target.className === "home-btn" || e.target.className === "home-txt") {
    goHome(hangmanGame);
  }

  if (e.target.className === "letter-box") {
    e.target.classList.add("clicked");

    let theStatus = handleLettersMatching(e.target.textContent.toLowerCase());

    if (theStatus !== true) {
      wrong(e.target);
      if (wrongAttempts === 8) {
        lostGame();
      }
    } else {
      correct(e.target);
      checkWin();
    }
  }
  if (e.target.classList.contains("cat-menu")) {
    categoryMenu();
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// DOOM ARENA ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function fetchWords() {
  const response = await fetch("https://raw.githubusercontent.com/ibrahim-md009/words/refs/heads/main/word.json");
  return await response.json();
}

function fetchError() {
  let error = document.createElement("div");
  let errorTxt = document.createTextNode("تحقق من اتصالك بالانترنت");
  error.appendChild(errorTxt);
  error.classList.add("fetch-error");
  hangmanGame.appendChild(error);

  setTimeout(() => {
    error.remove();
  }, 3000);
}

function randomWord(categoryData) {
  const allKeys = Object.keys(categoryData[currentLang]);

  if (selectedCategory && selectedCategory !== "all") {
    propertyKey = allKeys[Number(selectedCategory)];
  } else {
    propertyKey = allKeys[Math.floor(Math.random() * allKeys.length)];
  }

  const wordsArray = categoryData[currentLang][propertyKey];
  const randomValue = wordsArray[Math.floor(Math.random() * wordsArray.length)];

  randomPropertyName = propertyKey;
  randomValueValue = randomValue;
  theChosenWord = [...randomValueValue.toLowerCase()];
}

function renderBoard() {
  letterGuessContainer.innerHTML = "";

  [...randomValueValue].forEach((letter) => {
    const spaceOfWord = document.createElement("span");
    if (letter === " ") {
      spaceOfWord.classList.add("with-space");
    }
    letterGuessContainer.appendChild(spaceOfWord);
  });
  guessSpans = document.querySelectorAll(".letters-guess span");

  const prefix = currentLang === "ar" ? "الكلمة من: " : "Word from: ";
  document.querySelector(".game-info .category").innerHTML =
    `${prefix}  <span class="word">${randomPropertyName}</span>`;
  generateLetters();
}

function handleLettersMatching(clickedLetter) {
  let isLetterFound = false;
  theChosenWord.forEach((l, wordIndex) => {
    if (clickedLetter === l) {
      isLetterFound = true;
      guessSpans[wordIndex].textContent = clickedLetter;
      guessSpans[wordIndex].classList.add("has-letter");
    }
  });
  return isLetterFound;
}

function correct(clickedLetter) {
  const successSound = new Audio("audio/correct-audio.mp3");
  successSound.currentTime = 0;
  successSound.play();
  clickedLetter.classList.add("correct-letter");
}

function wrong(clickedLetter) {
  wrongAttempts++;
  clickedLetter.classList.add("wrong-letter");
  theDraw.classList.add(`wrong-${wrongAttempts}`);
  const failSound = new Audio("audio/wrong-audio.mp3");
  failSound.currentTime = 0;
  failSound.play();
}

function checkWin() {
  let allCorrect = [...guessSpans].every((span) => {
    return span.classList.contains("has-letter") || span.classList.contains("with-space");
  });
  if (allCorrect) {
    winnerPopUp.style.display = "flex";
  }
  document.querySelector(".winner-pop-up p").textContent =
    currentLang === "ar" ? "أحسنت استمر عمل جيد" : "Well done, excellent! , you're really awesome.";
}

function lostGame() {
  lettersContainer.classList.add("finished");
  document.querySelector(".loser-pop-up p").textContent =
    currentLang === "ar"
      ? `  الإجابة هي  ${randomValueValue} حاول مرة اخرى `
      : ` the answer is ${randomValueValue} try again`;
  loserPopUp.style.display = "flex";
}

function changeCategory(clickedCat) {
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.classList.remove("active-cat");
  });

  clickedCat.classList.add("active-cat");
  selectedCategory = clickedCat.dataset.cat;
  categoriesFilter.classList.remove("open");
  resetGame();
  getWords();
}

function changeLang() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  const isAr = currentLang === "ar";

  hangmanGame.style.direction = isAr ? "rtl" : "ltr";
  langBtn.textContent = isAr ? "turn to English" : "تحويل إلى عربي";
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.textContent = isAr ? btn.dataset.ar : btn.dataset.en;
  });
  catMenu.textContent = isAr ? "اختار القسم ▼" : "Select Category ▼";
  categoriesFilter.classList.remove("open");
  lettersContainer.style = isAr ? "padding-left:20 px" : "padding-right:20px; padding-left:0";
  resetGame();
  getWords();
}

function resetGame() {
  wrongAttempts = 0;
  theDraw.className = "hangman-draw";
  lettersContainer.classList.remove("finished");
  letterGuessContainer.innerHTML = "";
  winnerPopUp.style.display = "none";
  loserPopUp.style.display = "none";
}

function categoryMenu() {
  categoriesFilter.classList.toggle("open");
}
