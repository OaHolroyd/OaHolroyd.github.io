/* update the name of the cache */
var cacheName = 'puzzles';

/* ensure that this contains everything */
// TODO: should probably glob to automatically update this list
var filesToCache = [
  '/',
  '/index.html',
  '/word-wheel.html',
  '/css/style.css',
  '/css/word-wheel.css',
  '/js/main.js',
  'en-gb-9.js',
  'en-gb.js',
  'main.js',
  'Random.js',
  'Trie.js',
  'word-wheel-view.js',
  'WordWheel.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
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
