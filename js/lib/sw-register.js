/**
 * Registra el Service Worker (sw.js) y avisa cuando hay una versión nueva de la invitación.
 * Al tocar "Actualizar" se activa el SW nuevo y la página se recarga una vez.
 */
const SUPPORTED = 'serviceWorker' in navigator &&
  (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname));

function showUpdateToast(reg) {
  if (document.querySelector('.update-toast')) return;
  const toast = document.createElement('div');
  toast.className = 'update-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<span>✨ Hay una nueva versión de la invitación</span><button type="button">Actualizar</button>';
  toast.querySelector('button').addEventListener('click', () => {
    toast.querySelector('button').disabled = true;
    // Siempre la versión más reciente que esté esperando (si llegó otra mientras el aviso estaba visible).
    if (reg.waiting) reg.waiting.postMessage('SKIP_WAITING');
    else location.reload();                          // ya se activó: basta con recargar
  });
  document.body.appendChild(toast);
}

export function registerServiceWorker() {
  if (!SUPPORTED) return;

  // Cuando el SW nuevo toma el control, recarga una sola vez con los archivos nuevos.
  let reloading = false;
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;   // primera instalación: no hace falta recargar
    reloading = true;
    location.reload();
  });

  // updateViaCache 'none': al buscar versión nueva, sw.js y version.js (importScripts) se piden
  // siempre al servidor; si no, la caché HTTP (10 min en GitHub Pages) escondía el despliegue.
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateToast(reg);
    reg.addEventListener('updatefound', () => {
      const next = reg.installing;
      next?.addEventListener('statechange', () => {
        if (next.state === 'installed' && navigator.serviceWorker.controller) showUpdateToast(reg);
      });
    });
    // Busca versiones nuevas al volver a la pestaña y cada 30 min.
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update(); });
    setInterval(() => reg.update(), 30 * 60 * 1000);
  }).catch(() => { /* sin SW la invitación funciona igual, solo sin caché */ });
}
