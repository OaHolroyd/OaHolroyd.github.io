/* jshint esversion: 6 */
// NOTE: requires a dictionary to be loaded

var maxTrie = new Trie();

// checks if a word is in the dictionary by iterating over it
function isValid(word, minlen = 1) {
  const N = en_gb.length;
  word = word.toLowerCase();

  if (word.length < minlen) {
    return false;
  }

  for(var i = 0; i < N; i++){
    if (word === en_gb[i]) {
      return true;
    }
  }

  return false;
}

// returns false if not in tree, true if word is in tree (or, if prefix is
// true, returns true if word is a prefix in tree)
function inTrie(word, prefix = false) {
  // ensure the tree is filled
  const N = en_gb.length;
  if (maxTrie.isEmpty()) {
    for(var i = 0; i < N; i++){
      maxTrie.insert(en_gb[i]);
    }
  }

  return maxTrie.contains(word, prefix);
}

// returns all of the subwords in the trie that the word contains, with an
// optional index of a key character which must be used
function subwords(word, trie, key = -1) {
  var subs = [];

  // fill subs
  for (var i in word) {
    var path = [];
    var pathword = "";
    dfs(word, trie, i, path, pathword, subs);
  }

  // // minimum 3 letters
  i = subs.length;
  while (i--) {
    if (subs[i].length < 3) {
      subs.splice(i, 1);
    }
  }

  // doesn't contain key letter
  if (key >= 0) {
    i = subs.length;
    while (i--) {
      if (!subs[i].includes(word[key].toLowerCase())) {
        subs.splice(i, 1);
      }
    }
  }

  return subs;
}

function dfs(word, trie, i, path, pathword, words) {
  // add the new letter
  var letter = word[i].toLowerCase();
  var newPathword = JSON.parse(JSON.stringify(pathword));
  var newPath = JSON.parse(JSON.stringify(path));
  newPathword = newPathword + letter;
  newPath.push(i);

  // add the word if it both valid and new
  if (inTrie(newPathword) && !words.includes(newPathword)) {
    words.push(newPathword);
  }

  // if it's not a prefix, stop here
  if (!inTrie(newPathword, true)) {
    return;
  }

  // recurse for the other letters
  for (var j in word) {
    if (!newPath.includes(j)) {
      dfs(word, trie, j, newPath, newPathword, words);
    }
  }
}
