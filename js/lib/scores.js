/**
 * Puntajes de los juegos → Google Sheets (pestaña "Scores").
 * El transporte, la cola offline y los reintentos están en ./api.js.
 */
import { CONFIG } from '../config.js';
import { storage } from './storage.js';
import { player } from './player.js';
import { uid } from './dom.js';
import { apiEnabled, send, get } from './api.js';

const BEST_KEY = 'best';

function rememberBest(game, score) {
  const best = storage.get(BEST_KEY, {});
  if (best[game] == null || score > best[game]) {
    best[game] = score;
    storage.set(BEST_KEY, best);
  }
}

/** Mejor puntaje de este dispositivo para un juego (o null). */
export const bestScore = game => storage.get(BEST_KEY, {})[game] ?? null;

/** Ventana del bono de rapidez: responder al instante = 1, desde 10 s = 0. */
export const SPEED_WINDOW_MS = 10000;
export const speedFactor = ms => Math.max(0, 1 - ms / SPEED_WINDOW_MS);

/**
 * Puntos por un acierto (trivias): 50 base + hasta 150 por rapidez.
 * Al instante = 200; 5 s = 125; 10 s o más = 50. Es la misma escala que Tesla en nivel 1.
 */
export const answerPoints = ms => Math.round(50 + 150 * speedFactor(ms));

/**
 * Registra un puntaje. Nunca lanza.
 * @param {{game: string, score: number, max?: number, correct?: number, level?: number, durationMs?: number}} p
 *   score: puntos (lo que ordena el ranking) · max/correct: preguntas y aciertos (trivias) · level: nivel (Tesla)
 * @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected'}>}
 */
export function submitScore({ game, score, max = null, correct = null, level = null, durationMs = null }) {
  rememberBest(game, score);
  forgetRanking(game);
  return send({
    action: 'score',
    id: uid(),
    playerId: player.id,
    nombre: player.name || 'Invitado',
    juego: game,
    puntaje: score,
    maximo: max,
    aciertos: correct,
    nivel: level,
    duracionMs: durationMs,
  });
}

/* Rankings en memoria 30 s: al volver al hub no se vuelve a esperar al Apps Script
   (el script también cachea 30 s). Un puntaje nuevo invalida el de su juego. */
const RANK_TTL_MS = 30000;
const rankCache = new Map();
const forgetRanking = game => {
  for (const key of rankCache.keys()) if (key.startsWith(`${game}:`)) rankCache.delete(key);
};

/**
 * Top de un juego: [{pos, nombre, puntaje, maximo, aciertos, nivel, me}]
 * Lanza si no hay conexión; quien lo use debe tratarlo como opcional.
 * @param {{fresh?: boolean}} opts fresh: ignora la memoria (p. ej. justo después de jugar)
 */
export async function getLeaderboard(game, limit = CONFIG.scores?.rankingSize ?? 5, { fresh = false } = {}) {
  if (!apiEnabled) return [];
  const key = `${game}:${limit}`;
  const hit = rankCache.get(key);
  if (!fresh && hit && Date.now() - hit.at < RANK_TTL_MS) return hit.rows;
  const data = await get({ action: 'leaderboard', game, limit, player: player.id });
  const rows = data.rows ?? [];
  rankCache.set(key, { rows, at: Date.now() });
  return rows;
}
