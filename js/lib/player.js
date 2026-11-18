import { storage } from './storage.js';
import { uid } from './dom.js';

/** Identidad del invitado en este dispositivo (para el ranking y los mensajes). */
export const player = {
  get id() {
    let id = storage.get('playerId');
    if (!id) {
      id = uid();
      storage.set('playerId', id);
    }
    return id;
  },
  get name() {
    return storage.get('jugador', '');
  },
  set name(value) {
    storage.set('jugador', String(value).trim().slice(0, 30));
  },
};
