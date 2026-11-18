/**
 * Elección del menú de la cena → Google Sheets (pestaña "Menu", una fila por invitado).
 * La última elección de cada dispositivo (playerId) reemplaza a la anterior.
 */
import { storage } from './storage.js';
import { player } from './player.js';
import { uid } from './dom.js';
import { send } from './api.js';

const CHOICE_KEY = 'menuChoice';

/** Última elección guardada en este dispositivo (o null). */
export const savedMenuChoice = () => storage.get(CHOICE_KEY, null);

/**
 * Guarda la elección local y la envía. Nunca lanza.
 * @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected'}>}
 */
export function saveMenuChoice({ nombre, plato, postre, restricciones = '' }) {
  const choice = { nombre, plato, postre, restricciones, d: Date.now() };
  storage.set(CHOICE_KEY, choice);
  return send({ action: 'menu', id: uid(), playerId: player.id, nombre, plato, postre, restricciones });
}
