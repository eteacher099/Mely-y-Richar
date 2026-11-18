/**
 * Cliente de puntajes → Google Apps Script → Google Sheets.
 *
 * - POST con Content-Type text/plain para evitar el preflight CORS
 *   (Apps Script no responde a OPTIONS).
 * - Si no hay red, el puntaje queda en una cola local y se reintenta
 *   al cargar la página o al volver la conexión (flushQueue).
 * - Cada envío lleva un id único; el script ignora duplicados, así que
 *   reintentar es seguro.
 */
import { CONFIG } from '../config.js';
import { storage } from './storage.js';
import { player } from './player.js';
import { uid } from './dom.js';

const cfg = CONFIG.scores ?? {};
const QUEUE_KEY = 'scoreQueue';
const BEST_KEY = 'best';
const MAX_QUEUE = 50;
const TIMEOUT_MS = 8000;

export const scoresEnabled = Boolean(cfg.endpoint);

/** El servidor respondió pero rechazó los datos: no tiene sentido reintentar. */
class RejectedError extends Error {}

async function request(url, options = {}) {
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

const post = entry => request(cfg.endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({ ...entry, token: cfg.token || '' }),
});

function enqueue(entry) {
  const queue = storage.get(QUEUE_KEY, []);
  queue.push(entry);
  storage.set(QUEUE_KEY, queue.slice(-MAX_QUEUE));
}

function rememberBest(game, score) {
  const best = storage.get(BEST_KEY, {});
  if (best[game] == null || score > best[game]) {
    best[game] = score;
    storage.set(BEST_KEY, best);
  }
}

/** Mejor puntaje de este dispositivo para un juego (o null). */
export const bestScore = game => storage.get(BEST_KEY, {})[game] ?? null;

/**
 * Registra un puntaje. Nunca lanza.
 * @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected'}>}
 */
export async function submitScore({ game, score, max = null, durationMs = null }) {
  rememberBest(game, score);
  if (!scoresEnabled) return { status: 'local' };

  const entry = {
    action: 'score',
    id: uid(),
    playerId: player.id,
    nombre: player.name || 'Invitado',
    juego: game,
    puntaje: score,
    maximo: max,
    duracionMs: durationMs,
  };

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

/** Reenvía los puntajes que quedaron pendientes por falta de conexión. */
export async function flushQueue() {
  const pending = storage.get(QUEUE_KEY, []);
  if (!scoresEnabled || flushing || !pending.length) return;
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

/**
 * Top de un juego: [{pos, nombre, puntaje, maximo, me}]
 * Lanza si no hay conexión; quien lo use debe tratarlo como opcional.
 */
export async function getLeaderboard(game, limit = cfg.rankingSize ?? 5) {
  if (!scoresEnabled) return [];
  const url = new URL(cfg.endpoint);
  url.search = new URLSearchParams({ action: 'leaderboard', game, limit, player: player.id });
  const data = await request(url);
  return data.rows ?? [];
}
