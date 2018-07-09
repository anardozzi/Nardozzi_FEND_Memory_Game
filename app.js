// Javascript Memory Game - Udacity FEND Nanodegree Project 3
// Author: Anthony Nardozzi July 2018

/*Global Varialbes */
let cardsInPlay = [];
let moves = 0;
let timerOff = true;
let clockId;
let timer = 0;
let pairsMatched = 0;
const TOTAL_PAIRS = 8;
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const modal = document.getElementById('endModal');
const modalCancel = document.querySelector('.modal-cancel').addEventListener('click', () => {
  modal.style.display = 'none';
});
const modalRestart = document.querySelector('.modal-replay').addEventListener('click', () => {
  resetDeck();
});
const span = document.getElementsByClassName('close')[0];
span.onclick = function() {
  modal.style.display = 'none';
}
restart.addEventListener('click', event => {
  resetDeck();
});

/*Main part of this program*/

deck.addEventListener('click', event => {
  let clickTarget = event.target;
/*Saw another developer use this technique, trying this out to see if it improves readability*/
  if(
     clickTarget.classList.contains('card') &&
     cardsInPlay.length < 2 &&
     !cardsInPlay.includes(clickTarget) &&
     !clickTarget.classList.contains('match')
  ) {
    if(timerOff){
      startTimer();
      timerOff = false;
    }
      turnCard(clickTarget);
      addFlippedCard(clickTarget);
      if(cardsInPlay.length === 2) {
        doTheyMatch();
      }  //end if doTheyMatch
      if (pairsMatched === TOTAL_PAIRS) {
        stopTimer();
        gameOverMan();
      } //end if win check
  }  //end if
});

/*Supporting Cast [AKA the functions that drive it all]*/
/* Timer Logic  */
function startTimer() {
  let clockId = setInterval(() => {
    timer++;
    displayTimer();
  }, 1000);
}

function displayTimer() {
  let clock = document.querySelector('.timer');
  const minutes = Math.floor(timer / 60);
  const seconds = Math.floor(timer % 60);
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

function stopTimer() {
  clearInterval(clockId);
}

/*Matching Logic*/
function doTheyMatch() {
  if(cardsInPlay[0].firstElementChild.className ===
    cardsInPlay[1].firstElementChild.className) {
      cardsInPlay[0].classList.toggle('match');
  	  cardsInPlay[1].classList.toggle('match');
  	  cardsInPlay = [];
      moveCounter();
      pairsMatched++;
  } else {
      cardsInPlay[0].classList.toggle('noMatch');
      cardsInPlay[1].classList.toggle('noMatch');
  	  setTimeout(hideCard, 400, cardsInPlay[0]);
  	  setTimeout(hideCard, 400, cardsInPlay[1]);
      cardsInPlay = [];
      moveCounter();
  }  //end else
}  //end doTheyMatch funct

/*Logic for the card flip*/
function turnCard(clicked) {
  clicked.classList.toggle('open');
  clicked.classList.toggle('show');
}

function addFlippedCard(clickTargert) {
  cardsInPlay.push(clickTargert);
}

function hideCard(card) {
  card.classList.remove('open', 'show', 'noMatch');
}

function resetMoves() {
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}  //end resetMoves funct

function moveCounter(){
	moves++;
	const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
  changeScore();
}  //end moveCounter funct

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*Reset the deck*/
function resetDeck() {
  shuffleDeck();
  timerOff = true;
  moves = 0;
  resetMoves();
  stopTimer();
  timer = 0;
  displayTimer();
  resetStars();
  modal.style.display = 'none';
}

function shuffleDeck () {
  const deckOcards = Array.from(document.querySelectorAll('.deck li'));
  const shuffledDeck = shuffle(deckOcards);
  for (card of shuffledDeck) {
    deck.appendChild(card);
    card.classList.remove("show", "open", "match");
  }
}

function resetStars() {
  let stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function changeScore() {
  if (moves === 18 || moves === 24) {
    hideStar();
  }
}

function hideStar() {
  const stars = document.querySelectorAll('.stars li');
  for (star of stars) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    } //end if
  }  //end for
}  //end hideStar funct

function populateModalStats() {
  const timeStat = document.querySelector('.game_time');
  const gameTime = document.querySelector('.timer').innerHTML;
  const gameStars = document.querySelector('.game_stars');
  const gameMoves = document.querySelector('.game_moves');
  const stars = starsLeft();

  timeStat.innerHTML = `Time = ${gameTime}`;
  gameStars.innerHTML = `Stars = ${stars}`;
  gameMoves.innerHTML = `Moves = ${moves}`;
}

function starsLeft() {
  stars = document.querySelectorAll('.stars li');
  let starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++;
    }  //end if
  }  //end for
  return starCount;
}  //end starsLeft funct

function gameOverMan() {
  stopTimer();
  populateModalStats();
  modal.style.display = 'block';
}

