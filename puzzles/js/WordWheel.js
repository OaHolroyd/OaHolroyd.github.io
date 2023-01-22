/* jshint esversion: 6 */

class WordWheel {
  constructor() {
    // random seed
    let seed = Random.seed();

    // game setup
    this.keyWord = en_gb_9[Math.floor(Random.rand(seed)*en_gb_9.length)];

    // loop through until there are enough words
    const tol = 50;
    var nwords;
    this.letters = this.keyWord.toUpperCase().split('');
    Random.shuffle(this.letters, seed);

    for(var i = 0; i < this.keyWord.length; i++){
      // circshift
      this.letters.push(this.letters.shift());
      this.keyLetter = this.letters[0];
      this.wordList = [];
      this.#getWordList();
      nwords = this.wordList.length;

      if (nwords > tol) {
        break;
      }
    }

    // set the aim
    // TODO: improve threshholds
    this.aim = [Math.floor(0.20 * nwords),
                Math.floor(0.25 * nwords),
                Math.floor(0.30 * nwords),
                nwords];
    console.log(this.aim);

    // player data
    this.guessList = [];
    this.keyWordGuessed = false;
  }

  // player score
  get score() {
    return this.guessList.length;
  }


  /* ================== */
  /*   PUBLIC METHODS   */
  /* ================== */
  // checks a guess and adds it if it is good. Returns 'good', 'bad', or 'rep'
  checkGuess(word) {
    let lWord = word.toLowerCase();

    // word is too short
    if (lWord.length < 3) {
      console.log('too short');
      return 'bad';
    }

    // word doesn't contain the key letter
    if (!lWord.includes(this.keyLetter.toLowerCase())) {
      console.log('doesn\'t include a '+ this.keyLetter);
      return 'bad';
    }

    // guessed already
    for(var i = 0, N = this.guessList.length; i < N; i++){
      if (lWord === this.guessList[i]) {
        console.log('repeat');
        return 'rep';
      }
    }

    // check it is a word in wordList
    if (this.wordList.includes(lWord)) {
      this.guessList.push(lWord);

      // might also be a 9 letter word
      if (lWord.length == 9) {
        this.keyWordGuessed = true;
      }
      console.log('good');
      return 'good';
    }
    console.log('fallthrough');
    return 'bad';
  }


  /* =================== */
  /*   PRIVATE METHODS   */
  /* =================== */
  // fill the wordList list
  #getWordList() {
    // set up the prefix tree
    var trie = new Trie();
    for(var i = 0, N = en_gb.length; i < N; i++){
      trie.insert(en_gb[i]);
    }

    // fill wordList
    for (var i in this.keyWord) {
      var path = [];
      var pathWord = "";
      this.#dfs(trie, i, path, pathWord);
    }

    // minimum 3 letters long
    i = this.wordList.length;
    while (i--) {
      if (this.wordList[i].length < 3) {
        this.wordList.splice(i, 1);
      }
    }

    // doesn't contain key letter
    i = this.wordList.length;
    while (i--) {
      if (!this.wordList[i].includes(this.keyLetter.toLowerCase())) {
        this.wordList.splice(i, 1);
      }
    }
  }

  // depth first search
  #dfs(trie, i, path, pathWord) {
    // add the new letter
    var letter = this.keyWord[i].toLowerCase();
    var newPathWord = JSON.parse(JSON.stringify(pathWord));
    var newPath = JSON.parse(JSON.stringify(path));
    newPathWord = newPathWord + letter;
    newPath.push(i);

    // add the word if it both valid and new
    if (trie.contains(newPathWord) && !this.wordList.includes(newPathWord)) {
      this.wordList.push(newPathWord);
    }

    // if it's not a prefix, stop here
    if (!trie.contains(newPathWord, true)) {
      return;
    }

    // recurse for the other letters
    for (var j in this.keyWord) {
      if (!newPath.includes(j)) {
        this.#dfs(trie, j, newPath, newPathWord);
      }
    }
  }
}
