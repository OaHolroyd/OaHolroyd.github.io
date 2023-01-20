/* jshint esversion: 6 */
// NOTE: requires a dictionary to be loaded

// checks if a word is in the dictionary by iterating over it
function isValid(word) {
  const N = en_gb.length;
  word = word.toLowerCase();

  for(var i = 0; i < N; i++){
    if (word === en_gb[i]) {
      return true;
    }
  }

  return false;
}
