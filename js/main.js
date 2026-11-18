import { coupleName } from './config.js';
import { startRouter } from './router.js';
import { flushQueue } from './lib/api.js';

document.title = `${coupleName} · Nuestra Boda`;

startRouter();

// Reintenta puntajes / elecciones de menú que no se pudieron enviar (p. ej. sin señal en el salón).
flushQueue();
addEventListener('online', flushQueue);
