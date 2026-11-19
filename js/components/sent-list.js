/**
 * Lista "Tus mensajes" / "Tus sugerencias": lo que este invitado envió, con su estado.
 */
import { esc, timeAgo } from '../lib/dom.js';
import { itemStatus } from '../lib/notes.js';

const CHIPS = {
  sent: '<span class="chip chip--ok">✓ Enviado</span>',
  queued: '<span class="chip chip--wait">📶 Pendiente</span>',
  local: '<span class="chip chip--local">Solo en este teléfono</span>',
};

/** Mensajes al terminar de enviar (status de send()). */
export const SEND_RESULT = {
  sent: '✓ ¡Enviado! Les llegó a los novios.',
  queued: '📶 Sin conexión: lo enviaremos cuando vuelva el internet.',
  local: '✓ Guardado en este teléfono.',
  rejected: 'No pudimos enviarlo 😕 Revisa tu nombre y el texto, e inténtalo de nuevo.',
};

export function sentItemHtml(item) {
  return `
    <li class="sent-item">
      <p>${esc(item.texto)}</p>
      <div class="sent-meta">${CHIPS[itemStatus(item)]}${item.d ? `<small>${timeAgo(item.d)}</small>` : ''}</div>
    </li>`;
}

export function sentListHtml(items, title) {
  return items.length
    ? `<p class="sent-title">${esc(title)}</p><ul class="sent-list">${items.map(sentItemHtml).join('')}</ul>`
    : '';
}
