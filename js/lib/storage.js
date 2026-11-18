/**
 * Envoltorio de localStorage con prefijo y JSON.
 * Nunca lanza: en modo privado o sin espacio devuelve el valor por defecto / false.
 */
const PREFIX = 'boda_';

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
