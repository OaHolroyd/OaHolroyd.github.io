/* jshint esversion: 6 */

var score = 0;
var wordList = [];

var usesKey = false; // does the current guess use the key letter?
var hasClicked = []; // which letters have been clicked
var guess = []; // records the guess
var guessId = []; // records the guess ids

var keyword = '';
var keyletter = '';
var letters = [];
var totalWords = [];
var aim = [10, 100, 1000];

// elements
const board = document.getElementById('board');
const aimBox = document.getElementById('aim');
const guessBox = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const backButton = document.getElementById('back');
const scoreBox = document.getElementById('score');

// set everything up
setupGame();
setupActions();


// returns the day seed (just days since epoch)
function daySeed() {
  var now = new Date();
  var day = Math.floor(now/8.64e7);
  return day;
}

// shuffles an array using a seed
function shuffle(array, seed) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(random(seed) * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    ++seed;
  }

  return array;
}

// returns a (bad) seeded random number
function random(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// set up the game
function setupGame() {
  // reset the players progress
  score = 0;
  wordList = [];

  // set up the game variables
  let seed = daySeed();
  keyword = en_gb_9[seed % en_gb_9.length];
  letters = keyword.toUpperCase().split('');
  shuffle(letters, seed);
  keyletter = letters[0];
  const N = letters.length;

  // get total words
  totalWords = subwords(letters, maxTrie, 0);
  aim[0] = Math.floor(0.1*totalWords.length);
  aim[1] = Math.floor(0.15*totalWords.length);
  aim[2] = Math.floor(0.2*totalWords.length);

  // draw everything
  const tileSize = 20;

  // draw the main letter
  let letter = document.createElement('div');
  letter.classList.add('letter');
  letter.classList.add('keyLetter');
  letter.innerHTML = keyletter;
  letter.id = 0;
  let x = 50 - tileSize/2;
  let y = 50 - tileSize/2;
  letter.style.width = tileSize+'%';
  letter.style.left = x+'%';
  letter.style.top = y+'%';
  board.appendChild(letter);

  hasClicked.push(false);

  // draw the remaining letters
  for (var i = 1; i < N; i++) {
    // create a letter div for each one
    let letter = document.createElement('div');
    letter.classList.add('letter');
    letter.innerHTML = letters[i];
    letter.id = i;

    // work out the position
    let theta = (i-1) * 2.0 * Math.PI / (N-1);
    let x = 50+30*Math.cos(theta) - tileSize/2;
    let y = 50+30*Math.sin(theta) - tileSize/2;
    letter.style.width = tileSize+'%';
    letter.style.left = x+'%';
    letter.style.top = y+'%';

    board.appendChild(letter);

    hasClicked.push(false);
  }

  scoreBox.innerHTML = score;
  resetGuess();
}

// what do do if a key tap is detected
function keyTapped(event) {
  let keyCode = event.keyCode;
  let key = String.fromCharCode(keyCode); // note that this is uppercase

  console.log(key + ' ' + '(' + keyCode + ') was pressed');

  if (event.keyCode >= 48 && event.keyCode <= 57) {
    // NUMBER
  } else if (event.keyCode >= 65 && event.keyCode <= 90) {
    // ALPHABET UPPER CASE
  } else if (event.keyCode >= 97 && event.keyCode <= 122) {
    // ALPHABET LOWER CASE
  } else {
    // CONTROL KEYS
    // delete: 8
    // forward delete: 46
    // enter: 13
    // arrow keys [UDLR]: 97, 40, 37, 39

    if (keyCode == 8) {
      backspace();
    } else if (keyCode == 13) {
      tapSubmit();
    }
  }
}

// what to do if the game is clicked/tapped
function tapDown(event) {
  let target = event.target;
  let isLetter = target.classList.contains('letter');

  if (isLetter) {
    let id = target.id;
    let isKeyLetter = target.classList.contains('keyLetter');
    let letter = target.innerHTML;

    if (isKeyLetter) {
      usesKey = true;
    }

    // add letter if it hasn't been used already
    if (!hasClicked[id]) {
      hasClicked[id] = true;
      guess.push(letter);
      guessId.push(id);
    }

    updateSelection();
  }
}

// removes the last letter
function backspace() {
  // do nothing if the guess is empty
  if (guess.length == 0) {
    return;
  }

  // remove the last letter
  let id = guessId.pop();
  guess.pop();
  hasClicked[id] = false;

  updateSelection();
}

// updates the button colors
function updateSelection() {
  for (var i = 0; i < keyword.length; i++) {
    if (hasClicked[i]) {
      document.getElementById(i).classList.remove('unselected');
      document.getElementById(i).classList.add('selected');
    } else {
      document.getElementById(i).classList.remove('selected');
      document.getElementById(i).classList.add('unselected');
    }
  }

  if (["INCORRECT", "CORRECT", "REPEAR"].includes(guessBox.innerHTML)) {
    guessBox.innerHTML = guessBox.innerHTML + '\u200b';
  } else {
    guessBox.innerHTML = guess.join('');
  }
}

// resets the guess
function resetGuess() {
  usesKey = false;
  guess = [];
  guessId = [];
  for(var i = 0; i < keyword.length; i++){
    hasClicked[i] = false;
  }

  if (score < aim[0]) {
    aimBox.innerHTML = "average: " + aim[0];
  } else if (score < aim[1]) {
    aimBox.innerHTML = "good: " + aim[1];
  } else {
    aimBox.innerHTML = "excellent: " + aim[2];
  }

  updateSelection();
}

// submit a guess
function tapSubmit() {
  let len = guess.length;
  let word = guess.join('');

  // no letters must be wrong
  if (!usesKey) {
    guessBox.innerHTML = "INCORRECT";
    resetGuess();
    return;
  }

  // has it been guessed already?
  for(var i = 0, length1 = wordList.length; i < length1; i++){
    if (word === wordList[i]) {
      guessBox.innerHTML = "REPEAT";
      resetGuess();
      return;
    }
  }

  console.log(inTrie(word));

  // check that the guess is actually a word with 3 or more letters
  if (isValid(word, 3)) {
    wordList.push(word);
    score = score + 1;
    scoreBox.innerHTML = score;
    guessBox.innerHTML = "CORRECT";
  } else {
    guessBox.innerHTML = "INCORRECT";
  }

  resetGuess();
}

// set up interactions with the game internals
function setupActions() {
  // TODO: be different depending on computer vs touchscreen
  document.addEventListener('keydown', keyTapped);
  document.addEventListener('click', tapDown);
  submitButton.onclick = tapSubmit;
  backButton.onclick = backspace;
}
