/**
 * Cliente del Web App de Google Apps Script (google-scripts/scores.gs).
 * Lo usan los puntajes (action 'score') y el menú (action 'menu').
 *
 * - POST con Content-Type text/plain para evitar el preflight CORS
 *   (Apps Script no responde a OPTIONS). No cambiar a application/json.
 * - Sin red, la entrada queda en una cola local y se reintenta al cargar
 *   la página o al volver la conexión (flushQueue).
 * - Cada entrada lleva un id único; el script ignora duplicados.
 */
import { CONFIG } from '../config.js';
import { storage } from './storage.js';

const cfg = CONFIG.scores ?? {};
const QUEUE_KEY = 'scoreQueue';   // nombre histórico: guarda entradas de cualquier action
const MAX_QUEUE = 50;
const TIMEOUT_MS = 8000;

export const apiEnabled = Boolean(cfg.endpoint);

/** El servidor respondió pero rechazó los datos: no tiene sentido reintentar. */
export class RejectedError extends Error {}

export async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const data = await res.json();
    if (!data.ok) throw new RejectedError(data.error || 'rejected');
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export const post = entry => request(cfg.endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ ...entry, token: cfg.token || '' }),
});

/** GET al Web App con parámetros. */
export function get(params) {
  const url = new URL(cfg.endpoint);
  url.search = new URLSearchParams(params);
  return request(url);
}

function enqueue(entry) {
  const queue = storage.get(QUEUE_KEY, []);
  queue.push(entry);
  storage.set(QUEUE_KEY, queue.slice(-MAX_QUEUE));
}

/**
 * Envía una entrada; si no hay red la encola. Nunca lanza.
 * @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected'}>}
 */
export async function send(entry) {
  if (!apiEnabled) return { status: 'local' };
  try {
    await post(entry);
    flushQueue();
    return { status: 'sent' };
  } catch (err) {
    if (err instanceof RejectedError) return { status: 'rejected' };
    enqueue(entry);
    return { status: 'queued' };
  }
}

let flushing = false;

/** Reenvía las entradas que quedaron pendientes por falta de conexión. */
export async function flushQueue() {
  const pending = storage.get(QUEUE_KEY, []);
  if (!apiEnabled || flushing || !pending.length) return;
  flushing = true;
  const keep = [];
  try {
    for (let i = 0; i < pending.length; i++) {
      try {
        await post(pending[i]);
      } catch (err) {
        if (err instanceof RejectedError) continue;   // datos inválidos: se descartan
        keep.push(...pending.slice(i));               // sin red: se detiene y conserva el resto
        break;
      }
    }
  } finally {
    // Conserva lo que se haya encolado mientras se enviaba.
    const sent = new Set(pending.map(e => e.id));
    const added = storage.get(QUEUE_KEY, []).filter(e => !sent.has(e.id));
    storage.set(QUEUE_KEY, [...keep, ...added]);
    flushing = false;
  }
}
