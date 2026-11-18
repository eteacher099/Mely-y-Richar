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

/**
 * Registra un puntaje. Nunca lanza.
 * @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected'}>}
 */
export function submitScore({ game, score, max = null, level = null, durationMs = null }) {
  rememberBest(game, score);
  return send({
    action: 'score',
    id: uid(),
    playerId: player.id,
    nombre: player.name || 'Invitado',
    juego: game,
    puntaje: score,
    maximo: max,
    nivel: level,
    duracionMs: durationMs,
  });
}

/**
 * Top de un juego: [{pos, nombre, puntaje, maximo, nivel, me}]
 * Lanza si no hay conexión; quien lo use debe tratarlo como opcional.
 */
export async function getLeaderboard(game, limit = CONFIG.scores?.rankingSize ?? 5) {
  if (!apiEnabled) return [];
  const data = await get({ action: 'leaderboard', game, limit, player: player.id });
  return data.rows ?? [];
}
