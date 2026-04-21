// ============================================
//  SERVICE WORKER — KopKar MES PWA
//  Strategy: Cache-First untuk App Shell
//             Network-First untuk data dinamis
// ============================================

const CACHE_NAME = 'kopkar-mes-v1';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/css/style.css',
  '/js/login.js',
  '/js/dashboard.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Serif+Display:ital@0;1&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// ─── INSTALL: cache semua app shell ───
self.addEventListener('install', event => {
  console.log('[SW] Installing KopKar MES...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        // Cache satu per satu agar satu gagal tidak block semua
        return Promise.allSettled(
          CACHE_URLS.map(url =>
            cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE: hapus cache lama ───
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH: strategi hybrid ───
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET dan chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Google Fonts & CDN: Cache-First (jarang berubah)
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('unpkg.com')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // App Shell (HTML, CSS, JS lokal): Cache-First with network fallback
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname === '/'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: Network-First with cache fallback
  event.respondWith(networkFirst(request));
});

// ─── Strategi: Cache-First ───
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type !== 'opaque') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline fallback
    return offlineFallback(request);
  }
}

// ─── Strategi: Network-First ───
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

// ─── Offline Fallback ───
function offlineFallback(request) {
  const url = new URL(request.url);
  if (request.destination === 'document') {
    return caches.match('/index.html');
  }
  return new Response(
    JSON.stringify({ error: 'Offline', message: 'Tidak ada koneksi internet.' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// ─── Push Notification (opsional, untuk notifikasi cicilan) ───
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'KopKar MES', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/dashboard.html' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/dashboard.html')
  );
});
