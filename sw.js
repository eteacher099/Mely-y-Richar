/*
 * Service Worker de la invitación: caché versionada para que las visitas siguientes carguen
 * al instante desde el teléfono. Versión en version.js (ver comentarios allí).
 *
 * Estrategias:
 *   - Archivos propios (HTML, CSS, JS, SVG): caché primero; lo que no esté se baja y se guarda.
 *     Una versión nueva usa otra caché, así que nunca se mezclan archivos de dos versiones.
 *   - Google Fonts: caché propia que se revalida en segundo plano.
 *   - Apps Script (script.google.com / googleusercontent.com): SIEMPRE red, nunca caché.
 *   - En local (APP_BUILD = 'dev'): red primero, para ver los cambios al recargar.
 */
importScripts('version.js');

const PREFIX = 'boda-';
const CACHE = `${PREFIX}${self.APP_VERSION}+${self.APP_BUILD}`;
const FONTS = `${PREFIX}fonts`;
const DEV = self.APP_BUILD === 'dev';

// Lo mínimo para abrir la invitación sin red; el resto se guarda la primera vez que se usa.
const SHELL = [
  './',
  'index.html',
  'version.js',
  'css/base.css',
  'css/components.css',
  'css/views.css',
  'js/main.js',
  'img/couple.svg',
  'img/beach.svg',
];

self.addEventListener('install', event => {
  // No se activa solo: la página muestra "Hay una nueva versión" y decide (mensaje SKIP_WAITING).
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.startsWith(PREFIX) && k !== CACHE && k !== FONTS)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'GET_VERSION') event.source?.postMessage({ type: 'VERSION', cache: CACHE });
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (/(^|\.)script\.google\.com$|googleusercontent\.com$/.test(url.hostname)) return;   // API: red
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONTS));
    return;
  }
  if (url.origin !== self.location.origin) return;

  event.respondWith(DEV ? networkFirst(req) : cacheFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: true })
    || (req.mode === 'navigate' && await cache.match('index.html'));
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  const update = fetch(req)
    .then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; })
    .catch(() => hit);
  return hit || update;
}
