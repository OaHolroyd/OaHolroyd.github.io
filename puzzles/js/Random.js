/* jshint esversion: 6 */

class Random {
  // returns the day seed (just days since epoch)
  static seed() {
    var now = new Date();
    var day = Math.floor(now/8.64e7);
    return day;
  }


  // repeatably shuffles an array using a seed
  static shuffle(array, seed) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Random.rand(seed) * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      ++seed;
    }

    return array;
  }

  // returns a (bad) seeded random number
  static rand(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
}
