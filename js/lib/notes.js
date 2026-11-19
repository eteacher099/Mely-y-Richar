/**
 * Mensajes para los novios y canciones sugeridas → Google Sheets (pestañas "Mensajes" y
 * "Canciones"). Son PRIVADOS: solo los novios los leen en la hoja; cada invitado ve en la
 * invitación únicamente lo que él envió desde este dispositivo.
 *
 * Historial local: storage 'msgs' y 'sug' → [{ id, texto, nombre, d }].
 * Los ítems viejos (antes de conectar con Sheets) no tienen id y no se envían.
 */
import { storage } from './storage.js';
import { player } from './player.js';
import { uid } from './dom.js';
import { send, isQueued, apiEnabled } from './api.js';

const KINDS = {
  message: { key: 'msgs', field: 'texto' },
  song: { key: 'sug', field: 'cancion' },
};

/** Normaliza el historial (formatos viejos: {t, n, d} o un string) y lo devuelve, más nuevo primero. */
export function history(kind) {
  const raw = storage.get(KINDS[kind].key, []);
  return raw
    .map(x => (typeof x === 'string' ? { texto: x } : { id: x.id, texto: x.texto ?? x.t, nombre: x.nombre ?? x.n, d: x.d }))
    .filter(x => x.texto)
    .sort((a, b) => (b.d || 0) - (a.d || 0));
}

/** Estado de un ítem del historial: 'sent' | 'queued' | 'local'. */
export function itemStatus(item) {
  if (!item.id || !apiEnabled) return 'local';
  return isQueued(item.id) ? 'queued' : 'sent';
}

function save(kind, nombre, texto) {
  const { key, field } = KINDS[kind];
  const item = { id: uid(), texto, nombre, d: Date.now() };
  const list = storage.get(key, []);
  list.push(item);
  storage.set(key, list);
  return send({ action: kind, id: item.id, playerId: player.id, nombre, [field]: texto })
    .then(result => {
      // Rechazado por el servidor: no lo dejamos en el historial como si se hubiera enviado.
      if (result.status === 'rejected') storage.set(key, storage.get(key, []).filter(x => x.id !== item.id));
      return { ...result, item };
    });
}

/** @returns {Promise<{status: 'local'|'sent'|'queued'|'rejected', item}>} Nunca lanza. */
export const sendMessage = ({ nombre, texto }) => save('message', nombre, texto);
export const suggestSong = ({ nombre, cancion }) => save('song', nombre, cancion);
