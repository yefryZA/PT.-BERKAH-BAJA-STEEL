const CACHE_NAME = 'kas-lestari-v1';
// Daftarkan aset lokal yang mau di-cache agar instan saat dibuka
const assetsToCache = [
  'index.html',
  'manifest.json'
];

// Tahap Install: Menyimpan aset ke dalam cache HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Aktivasi: Membersihkan cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Tahap Fetch: Mengambil data dari cache dulu, jika tidak ada baru ambil dari internet
self.addEventListener('fetch', (event) => {
  // Biar Firebase RTDB tidak ikut ter-cache (karena Firebase tipenya realtime/websockets)
  if (event.request.url.includes('firebase') || event.request.url.includes('firebasedatabase')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});