/* jshint esversion: 6 */

var wordGrid = new WordGrid();

var swipe = []; // swipe coordinates
var isSwiping = false;
var pt = [];
var hasClicked = []; // which letters have been clicked

// elements
const board = document.getElementById('board');
const canvas = document.getElementById('canvas');
const scoreBox = document.getElementById('score');
const listBox = document.getElementById('list');
var letterGrid = [];

setUpView();
DataBase.fetchGame(wordGrid, () => {
  // update the screen
  for (let i in wordGrid.guessList) {
    let item = document.createElement('li');
    item.innerHTML = wordGrid.guessList[i].toUpperCase();
    listBox.appendChild(item);
  }
  resetGuess();
  console.log(wordGrid.wordList);
});
updateColorScheme();
setUpActions();


/* ========================================================================== */
/*   FUNCTIONS                                                                */
/* ========================================================================== */
// sets up the html
function setUpView() {
  const tileSize = 22;

  // draw the grid
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      // create a letter div for each one
      let letter = document.createElement('div');
      letter.classList.add('letter');
      letter.innerHTML = wordGrid.grid[i][j];
      letter.id = 4*i+j;

      // work out the position
      let x = 25*j + 12.5 - tileSize/2;
      let y = 25*i + 12.5 - tileSize/2;
      letter.style.width = tileSize+'%';
      letter.style.left = x+'%';
      letter.style.top = y+'%';

      board.appendChild(letter);
      letterGrid.push(letter);
      hasClicked.push(false);
    }
  }

  resetGuess();
}

// update color scheme to match user scheme
function updateColorScheme() {
  // TODO: use color codes for the colors
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
    document.querySelector('meta[name="theme-color"]').setAttribute("content", 'black');
    document.documentElement.style.setProperty('--color-back', 'black');
    document.documentElement.style.setProperty('--color-fore', 'white');
    document.documentElement.style.setProperty('--color-min', 'darkgrey');
    document.documentElement.style.setProperty('--color-mid', 'grey');
    document.documentElement.style.setProperty('--color-max', 'lightgrey');
    document.documentElement.style.setProperty('--color-tintgood', 'lightgreen');
    document.documentElement.style.setProperty('--color-tintbad', 'lightred');
  } else {
    // light mode
    document.querySelector('meta[name="theme-color"]').setAttribute("content", 'white');
    document.documentElement.style.setProperty('--color-back', 'white');
    document.documentElement.style.setProperty('--color-fore', 'black');
    document.documentElement.style.setProperty('--color-min', 'lightgrey');
    document.documentElement.style.setProperty('--color-mid', 'grey');
    document.documentElement.style.setProperty('--color-max', 'darkgrey');
    document.documentElement.style.setProperty('--color-tintgood', 'darkgreen');
    document.documentElement.style.setProperty('--color-tintbad', 'darkred');
  }
}

function ij2xy(i, j) {
  let y = 10*(25 * i + 12.5);
  let x = 10*(25 * j + 12.5);
  return [x, y];
}

// updates the button colors
function updateSelection() {
  // highlight letters
  for (var i = 0; i < 16; i++) {
    if (hasClicked[i]) {
      letterGrid[i].classList.remove('unselected');
      letterGrid[i].classList.add('selected');
    } else {
      letterGrid[i].classList.remove('selected');
      letterGrid[i].classList.add('unselected');
    }
  }

  // draw line
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 1000, 1000);
  if (swipe.length > 0) {
    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.beginPath();
    let xy = ij2xy(swipe[0][0], swipe[0][1]);
    ctx.moveTo(xy[0], xy[1]);
    for (let pair of swipe) {
      xy = ij2xy(pair[0], pair[1]);
      console.log(xy);
      ctx.lineTo(xy[0], xy[1]);
    }

    xy = ij2xy(pt[0], pt[1]);
    ctx.lineTo(xy[0], xy[1]);
    console.log(pt);
    console.log(xy);
    ctx.stroke();
  }
}

// resets the guess
function resetGuess() {
  for(var i = 0; i < 16; i++){
    hasClicked[i] = false;
  }

  if (wordGrid.score < wordGrid.aim[0]) {
    scoreBox.innerHTML = wordGrid.score + " words, (average " + wordGrid.aim[0] + ")";
  } else if (wordGrid.score < wordGrid.aim[1]) {
    scoreBox.innerHTML = wordGrid.score + " words, (good " + wordGrid.aim[1] + ")";
  } else if (wordGrid.score < wordGrid.aim[2]) {
    scoreBox.innerHTML = wordGrid.score + " words, (excellent " + wordGrid.aim[2] + ")";
  } else {
    scoreBox.innerHTML = wordGrid.score + " words, (total " + wordGrid.aim[3] + ")";
  }

  updateSelection();
}

// flash good, rep, bad status for a guess
function flashStatus(status) {
  let anim = 'anim-' + status + ' 0.5s linear 1';
  for (var i in hasClicked) {
    if (hasClicked[i]) {
      letterGrid[i].style.animation = anim;
    }
  }
  setTimeout(function () {
    for (var i in hasClicked) {
      letterGrid[i].style.animation = null;
    }
  }, 500);
}

// checks to see if the index [i, j] can be added to the swipe
function checkIndex(i, j) {
  if (swipe.length == 0) {
    return true;
  }

  // have we had it already?
  for (let pair of swipe) {
    if (i == pair[0] && j == pair[1]) {
      return false;
    }
  }

  // does it neighbour the current one?
  let curr = swipe[swipe.length-1];
  if (Math.abs(i - curr[0]) > 1 || Math.abs(j - curr[1]) > 1) {
    return false;
  }

  return true;
}

// moves the drag and tries to grow the swipe
function dragMove(event) {
  // position of cursor relative to top left corner of board
  let x = event.changedTouches[0].clientX - board.offsetLeft;
  let y = event.changedTouches[0].clientY - board.offsetTop;

  // convert to tile units
  x = 4.0*x/board.offsetWidth;
  y = 4.0*y/board.offsetWidth;

  pt = [y-0.5, x-0.5];

  // attempt to convert to tile index
  let tol = isSwiping ? 0.2 : 0.5; // TODO: change depending on whether we are swiping or not
  let i = -1;
  if (Math.abs(y-Math.floor(y)-0.5) < tol) {
    i = Math.floor(y);
  }

  let j = -1;
  if (Math.abs(x-Math.floor(x)-0.5) < tol) {
    j = Math.floor(x);
  }

  // stop if we're not on a tile or are out of the board
  if (i < 0 || i > 3 || j < 0 || j > 3) {
    updateSelection();
    return;
  }

  if (swipe.length > 1) {
    // two or more previous tiles so can remove
    let prev = swipe[swipe.length-2];
    if (i == prev[0] && j == prev[1]) {
      // remove previous tile from the swipe
      let last = swipe.pop();
      hasClicked[4*last[0]+last[1]] = false;
    } else if (checkIndex(i, j)) {
      // add new tile to the swipe
      swipe.push([i, j]);
      hasClicked[4*i+j] = true;
      isSwiping = true;
    }
  } else if (checkIndex(i, j)) {
    // add new tile to the swipe
    swipe.push([i, j]);
    hasClicked[4*i+j] = true;
    isSwiping = true;
  }
  updateSelection();
}

// finish the swipe and sumbit the guess
function dragEnd(event) {
  // compute the word
  let word = "";
  for (let pair of swipe) {
    word += wordGrid.grid[pair[0]][pair[1]];
  }
  console.log(word);

  isSwiping = false;
  swipe = [];
  submit(word);
}

// submit a guess
function submit(word) {
  let status = wordGrid.checkGuess(word);
  flashStatus(status);

  if (status == 'good') {
    let item = document.createElement('li');
    item.innerHTML = word;
    listBox.appendChild(item);
    DataBase.saveGame(wordGrid);
  }

  resetGuess();
}

// set up interactions with the game internals
function setUpActions() {
  // TODO: be different depending on computer vs touchscreen
  board.addEventListener('touchmove', dragMove);
  board.addEventListener('touchend', dragEnd);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColorScheme);
}
