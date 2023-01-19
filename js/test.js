/* jshint esversion: 6 */

var score = 0;
var wordlist = [];

var usesKey = false; // does the current guess use the key letter?
var hasClicked = []; // which letters have been clicked
var guess = []; // records the guess

var keyword = '';
var keyletter = '';
var letters = [];

// elements
const board = document.getElementById('board');
const guessBox = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const scoreBox = document.getElementById('score');

// set everything up
setupGame(0);
setupActions();



// shuffle an array in place
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// set up the game
function setupGame(seed) {
  // reset the players progress
  score = 0;
  wordlist = [];

  usesKey = false;
  hasClicked = [];
  guess = [];

  // set up the game variables
  // TODO: use seed to randomly select the word and keyletter
  keyword = 'simpleton';
  letters = keyword.toUpperCase().split('');
  shuffle(letters);
  keyletter = letters[0];
  const N = letters.length;

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
}

// what do do if a key tap is detected
function keyTapped(event) {
  let keyCode = event.keyCode;
  let key = String.fromCharCode(keyCode); // note that this is uppercase

  console.log(key + ' ' + '(' + keyCode + ') was pressed');

  if (event.keyCode >= 48 && event.keyCode <= 57) {
    // number
  } else if (event.keyCode >= 65 && event.keyCode <= 90) {
    // alphabet upper case
  } else if (event.keyCode >= 97 && event.keyCode <= 122) {
    // alphabet lower case
  } else {
    // control key
    // delete: 8
    // forward delete: 46
    // enter: 13
    // arrow keys [UDLR]: 97, 40, 37, 39
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

      // update the guess
      guessBox.innerHTML = guess.join('');
    }
    console.log(guess + usesKey);
  }
}

// resets the guess
function resetGuess() {
  usesKey = false;
  guess = [];
  for(var i = 0; i < keyword.length; i++){
    hasClicked[i] = false;
  }
}

// submit a guess
function tapSubmit() {
  let len = guess.length;
  let word = guess.join('');

  // no letters must be wrong
  if (len < 1 || !usesKey) {
    guessBox.innerHTML = "INCORRECT";
    resetGuess();
    return;
  }

  // TODO: check that the guess is actually a word
  if (true) {
    wordlist.push(word);
    score = score + 1;
    scoreBox.innerHTML = score;
    guessBox.innerHTML = "CORRECT";
  }

  resetGuess();
}


// set up interactions with the game internals
function setupActions() {
  // TODO: be different depending on computer vs touchscreen
  document.addEventListener('keydown', keyTapped);
  document.addEventListener('click', tapDown);
  submitButton.onclick = tapSubmit;
}



// // This is javascript array of objects, each object has 1 property - buttonText.
// // You can add more properties.
// const elements = [
//     { buttonText: 'Button 1' },
//     { buttonText: 'Button 2' },
//     { buttonText: 'Button 3' }
// ];
// // Get parent div in which you want to add buttons
// const parent = document.getElementById('buttons-container');

// var count = 0

// // In for loop, set 'i' to be lower than number length of array.
// for(let i = 0; i < elements.length; i++) {
//     // Create button node and add innerHTML (innerHTML is stuff that goes between <></> tags).
//     // Since 'elements' is an array, you select current iteration of it with [i]
//     let button = document.createElement('button');
//     button.innerHTML = elements[i].buttonText;
//     button.onclick = function () {
//                          count += i;
//                          document.getElementById('count').innerHTML = count
//                      };
//     parent.appendChild(button);
// }
