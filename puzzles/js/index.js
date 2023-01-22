/* jshint esversion: 6 */

const puzzles = [
  'Word Wheel',
];

updateColorScheme();
setUpActions();
setUpLinks();

/* ========================================================================== */
/*   FUNCTIONS                                                                */
/* ========================================================================== */
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

// set up interactions with the game internals
function setUpActions() {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateColorScheme);
}

// fill the list with all of the available puzzles
function setUpLinks() {
  let puzzleList = document.getElementById('puzzleList');

  for (puzzle of puzzles) {
    // get names
    let displayName = puzzle;
    let fileName = puzzle.replace(/ /g, "-").toLowerCase();

    // create elements
    let box = document.createElement('div');
    box.classList.add('responsive');

    let link = document.createElement('a');
    link.href = fileName + '.html';

    let imgBox = document.createElement('div');
    imgBox.classList.add('gallery');

    let img = document.createElement('img');
    img.src = 'images/' + fileName + '.png'; // TODO: what if this doesn't exist?
    img.alt = fileName;
    img.onerror = "this.onerror=null;this.src='images/puzzles-512.png';"
    // TODO: also set width and height?

    let desc = document.createElement('div');
    desc.classList.add('desc');
    desc.innerHTML = displayName;

    // assemble
    imgBox.appendChild(img);
    imgBox.appendChild(desc);
    link.appendChild(imgBox);
    box.appendChild(link);
    puzzleList.appendChild(box);
  }

  // final "coming soon" box
  let displayName = 'coming soon';
  let fileName = 'puzzles-512';

  let box = document.createElement('div');
  box.classList.add('responsive');
  let link = document.createElement('a');
  link.href = fileName + '.html';
  let imgBox = document.createElement('div');
  imgBox.classList.add('gallery');
  let img = document.createElement('img');
  img.src = 'images/' + fileName + '.png'; // TODO: what if this doesn't exist?
  img.alt = fileName;
  // TODO: also set width and height?
  let desc = document.createElement('div');
  desc.classList.add('desc');
  desc.innerHTML = displayName;

  imgBox.appendChild(img);
  imgBox.appendChild(desc);
  link.appendChild(imgBox);
  box.appendChild(link);
  puzzleList.appendChild(box);

  // finish list
  let end = document.createElement('div');
  end.classList.add('clearfix');
  puzzleList.appendChild(box);
}
