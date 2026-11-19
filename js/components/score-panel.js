/**
 * Panel que se muestra al terminar un juego: estado del envío,
 * mejor puntaje local y ranking global (si Google Sheets está configurado).
 */
import { esc } from '../lib/dom.js';
import { bestScore, getLeaderboard } from '../lib/scores.js';

const MESSAGES = {
  sent: '✓ ¡Puntaje guardado en el ranking!',
  queued: '📶 Sin conexión: enviaremos tu puntaje cuando vuelva el internet.',
  rejected: 'No pudimos guardar tu puntaje 😕',
};

export const scorePanelHtml = () =>
  '<div class="score-panel" data-score-panel aria-live="polite"><p class="status">Guardando puntaje…</p></div>';

const rankingHtml = rows => `
  <p class="ranking-title">🏆 Ranking</p>
  <ol class="ranking">
    ${rows.map(r => `
      <li class="${r.me ? 'me' : ''}">
        <span>${esc(r.pos)}. ${esc(r.nombre)}${r.me ? ' (tú)' : ''}</span>
        <b>${esc(r.puntaje)}${r.aciertos != null && r.maximo ? ` <small>· ${esc(r.aciertos)}/${esc(r.maximo)}</small>` : ''}${r.nivel ? ` <small>· Nv ${esc(r.nivel)}</small>` : ''}</b>
      </li>`).join('')}
  </ol>`;

/**
 * @param {Element} root       contenedor que incluye scorePanelHtml()
 * @param {string} game        id del juego
 * @param {Promise} submission resultado de submitScore()
 */
export async function mountScorePanel(root, game, submission) {
  const panel = root.querySelector('[data-score-panel]');
  if (!panel) return;

  const { status } = await submission;
  if (!panel.isConnected) return;

  const best = bestScore(game);
  panel.innerHTML =
    (MESSAGES[status] ? `<p class="status">${MESSAGES[status]}</p>` : '') +
    (best != null ? `<p class="status">Tu mejor puntaje: ${esc(best)}</p>` : '');

  if (status === 'local') return;
  try {
    const rows = await getLeaderboard(game);
    if (panel.isConnected && rows.length) panel.insertAdjacentHTML('beforeend', rankingHtml(rows));
  } catch {
    /* el ranking es opcional: si falla, no se muestra */
  }
}
