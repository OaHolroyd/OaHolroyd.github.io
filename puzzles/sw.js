/* update the name of the cache */
var cacheName = 'puzzles';

/* ensure that this contains everything */
// TODO: should probably glob to automatically update this list
var filesToCache = [
  '/',
  '/index.html',
  '/word-wheel.html',
  '/css/index.css',
  '/css/word-wheel.css',
  '/js/main.js',
  '/js/index.js',
  '/js/en-gb-9.js',
  '/js/en-gb.js',
  '/js/DataBase.js',
  '/js/Random.js',
  '/js/Trie.js',
  '/js/word-wheel-view.js',
  '/js/WordWheel.js',
  'images/word-wheel.png',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      const stack = [];
      filesToCache.forEach(file => stack.push(
          cache.add(file).catch(_=>console.error(`can't load ${file} to cache`))
      ));
      return Promise.all(stack);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
