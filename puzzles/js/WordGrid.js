/* jshint esversion: 6 */

class WordGrid {
  constructor() {
    // set id (for storage)
    this.id = 'word-grid';

    // daily seed
    this.seed = Random.seed(); // (for storage)

    // game setup
    this.grid = [];
    this.#getGrid();

    // find all of the words
    this.wordList = [];
    this.#getWordList();

    // player data
    this.guessList = [];
  }

  // aims
  get aim() {
    let nwords = this.wordList.length;
    return [Math.floor(0.30 * nwords),
            Math.floor(0.40 * nwords),
            Math.floor(0.50 * nwords),
            nwords];
  }

  // player score
  get score() {
    return this.guessList.length;
  }

  // whether the game has been completed
  get isCompleted() {
    return this.score >= this.aim[2];
  }


  /* ================== */
  /*   PUBLIC METHODS   */
  /* ================== */
  // checks a guess and adds it if it is good. Returns 'good', 'bad', or 'rep'
  checkGuess(word) {
    let lWord = word.toLowerCase();

    // word is too short
    if (lWord.length < 3) {
      return 'bad';
    }

    // guessed already
    for(var i = 0, N = this.guessList.length; i < N; i++){
      if (lWord === this.guessList[i]) {
        return 'rep';
      }
    }

    // check it is a word in wordList
    if (this.wordList.includes(lWord)) {
      this.guessList.push(lWord);
      return 'good';
    }
    return 'bad';
  }


  /* =================== */
  /*   PRIVATE METHODS   */
  /* =================== */
  // select the grid
  #getGrid() {
    // define and shuffle the dice
    var rseed = this.seed;
    let dice = [['A', 'A', 'E', 'E', 'G', 'N'],
                ['A', 'B', 'B', 'J', 'O', 'O'],
                ['A', 'C', 'H', 'O', 'P', 'S'],
                ['A', 'F', 'F', 'K', 'P', 'S'],
                ['A', 'O', 'O', 'T', 'T', 'W'],
                ['C', 'I', 'M', 'O', 'T', 'U'],
                ['D', 'E', 'I', 'L', 'R', 'X'],
                ['D', 'E', 'L', 'R', 'V', 'Y'],
                ['D', 'I', 'S', 'T', 'T', 'Y'],
                ['E', 'E', 'G', 'H', 'N', 'W'],
                ['E', 'E', 'I', 'N', 'S', 'U'],
                ['E', 'H', 'R', 'T', 'V', 'W'],
                ['E', 'I', 'O', 'S', 'S', 'T'],
                ['E', 'L', 'R', 'T', 'T', 'Y'],
                ['H', 'I', 'M', 'N', 'U', 'Qu'],
                ['H', 'L', 'N', 'N', 'R', 'Z']];
    Random.shuffle(dice, rseed);

    // fill the grid
    for (var i = 0; i < 4; i++) {
      let row = [];
      for (var j = 0; j < 4; j++) {
        Random.shuffle(dice[4*i+j], rseed++);
        console.log(dice[4*i+j]);
        row.push(dice[4*i+j][0])
      }
      this.grid.push(row);
    }
  }

  // fill the wordList list
  #getWordList() {
    // set up the prefix tree
    var trie = new Trie();
    for(var i = 0, N = en_gb.length; i < N; i++){
      trie.insert(en_gb[i]);
    }

    // fill wordList
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var path = [];
        var pathWord = "";
        this.#dfs(trie, i, j, path, pathWord);
      }
    }

    // minimum 3 letters long
    i = this.wordList.length;
    while (i--) {
      if (this.wordList[i].length < 3) {
        this.wordList.splice(i, 1);
      }
    }
  }

  // depth first search
  #dfs(trie, i, j, path, pathWord) {
    // add the new letter
    var letter = this.grid[i][j].toLowerCase();
    var newPathWord = JSON.parse(JSON.stringify(pathWord));
    var newPath = JSON.parse(JSON.stringify(path));
    newPathWord = newPathWord + letter;
    newPath.push([i, j]);

    // add the word if it both valid and new
    if (trie.contains(newPathWord) && !this.wordList.includes(newPathWord)) {
      this.wordList.push(newPathWord);
    }

    // if it's not a prefix, stop here
    if (!trie.contains(newPathWord, true)) {
      return;
    }

    // recurse for the other letters
    for (var k = i-1; k <= i+1; k++) {
      for (var l = j-1; l <= j+1; l++) {
        let permitted = true;
        for (let pair of newPath) {
          if (pair[0] == k && pair[1] == l) {
            permitted = false;
            break;
          }
        }

        if (permitted && k >=0 && k < 4 && l >=0 && l < 4) {
          this.#dfs(trie, k, l, newPath, newPathWord);
        }
      }
    }
  }
}
