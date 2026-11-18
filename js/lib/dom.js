export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa texto antes de insertarlo en un template HTML. Úsalo con TODO dato variable. */
export const esc = value => String(value).replace(/[&<>"']/g, c => ESCAPES[c]);

/** "Ahora", "Hace 5 min", "Hace 3 h", "Hace 2 d". */
export function timeAgo(timestamp) {
  const minutes = Math.floor((Date.now() - timestamp) / 6e4);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} h`;
  return `Hace ${Math.floor(minutes / 1440)} d`;
}

/** Id aleatorio; randomUUID solo existe en contextos seguros (https / localhost). */
export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
