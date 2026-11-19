import { coupleName } from './config.js';
import { startRouter } from './router.js';
import { flushQueue } from './lib/api.js';
import { registerServiceWorker } from './lib/sw-register.js';

document.title = `${coupleName} · Nuestra Boda`;

startRouter();

// Reintenta puntajes / elecciones de menú que no se pudieron enviar (p. ej. sin señal en el salón).
flushQueue();
addEventListener('online', flushQueue);

// Caché versionada (sw.js + version.js) y aviso de "nueva versión".
registerServiceWorker();

// Versión visible al pie del menú (útil para saber qué versión tiene cada invitado).
const versionEl = document.getElementById('app-version');
const { APP_VERSION, APP_BUILD } = globalThis;   // definidos por version.js
if (versionEl && APP_VERSION) {
  versionEl.textContent = `v${APP_VERSION}${APP_BUILD && APP_BUILD !== 'dev' ? ` · ${APP_BUILD}` : ''}`;
}
