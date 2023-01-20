/* jshint esversion: 6 */
// NOTE: requires a dictionary to be loaded

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
