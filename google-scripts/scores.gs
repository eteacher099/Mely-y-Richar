/**
 * Boda Mely & Richar — API de la invitación (puntajes, menú de la cena, mensajes y canciones).
 * Google Apps Script publicado como Web App; guarda en una hoja de Google Sheets.
 *
 * Endpoints (URL .../exec de la implementación):
 *   GET  ?action=leaderboard&game=tesla&limit=5&player=<playerId>
 *        → { ok, rows: [{ pos, nombre, puntaje, maximo, aciertos, nivel, me }] }   (mejor puntaje por jugador)
 *   GET  (sin action)
 *        → { ok, service, games }                                   (health check)
 *   POST body JSON (Content-Type: text/plain):
 *        { action: 'score', id, playerId, nombre, juego, puntaje, maximo?, aciertos?, nivel?, duracionMs?, token? }
 *        Trivias: puntaje = puntos por rapidez, maximo = nº de preguntas, aciertos = respuestas correctas.
 *        → { ok, saved } | { ok, duplicate } | { ok: false, error }
 *   POST body JSON (Content-Type: text/plain):
 *        { action: 'menu', id, playerId, nombre, plato, postre, restricciones?, token? }
 *        → { ok, saved, updated? } | { ok: false, error }
 *        Una fila por invitado (playerId) en la pestaña "Menu": la última elección reemplaza a la anterior.
 *        La pestaña "Resumen menú" se reescribe con valores (conteo por plato y postre,
 *        restricciones) en cada elección; también desde el menú de la hoja "Boda".
 *   POST body JSON (Content-Type: text/plain):
 *        { action: 'message', id, playerId, nombre, texto, token? }     → pestaña "Mensajes"
 *        { action: 'song',    id, playerId, nombre, cancion, token? }   → pestaña "Canciones"
 *        → { ok, saved } | { ok, duplicate } | { ok: false, error: missing_name|missing_text|missing_id }
 *        Privados: solo los novios los leen en la hoja (no hay GET).
 *
 * Script Properties opcionales (Configuración del proyecto → Propiedades de la secuencia de comandos):
 *   SPREADSHEET_ID  id de la hoja si el script NO está vinculado a ella.
 *   SCORES_TOKEN    si se define, cada POST debe traer el mismo `token`
 *                   (filtro básico anti-spam; el token es visible en el sitio).
 *
 * Instalación y despliegue: ver README.md en esta carpeta.
 */

const SHEET_NAME = 'Scores';
const HEADERS = ['Fecha', 'ID', 'Jugador ID', 'Nombre', 'Juego', 'Puntaje', 'Máximo', 'Duración (s)', 'Nivel', 'Aciertos'];
const COL = { fecha: 0, id: 1, playerId: 2, nombre: 3, juego: 4, puntaje: 5, maximo: 6, nivel: 8, aciertos: 9 };

/** Juegos aceptados y puntaje máximo posible (validación básica anti-trampa). */
const GAMES = {
  trivia: { maxScore: 10000, maxQuestions: 50 },   // (50..200) puntos por acierto según rapidez
  marina: { maxScore: 10000, maxQuestions: 50 },
  tesla: { maxScore: 200000, maxLevel: 200 },   // nivel × (50..200) por perrito, en 60 s
};

const MENU_SHEET = 'Menu';
const MENU_HEADERS = ['Fecha', 'Jugador ID', 'Nombre', 'Plato principal', 'Postre', 'Alergias / restricciones'];
const SUMMARY_SHEET = 'Resumen menú';

/**
 * Notas privadas para los novios (solo se leen en la hoja; no hay GET público).
 *   message → pestaña "Mensajes"   ·   song → pestaña "Canciones"
 */
const NOTES = {
  message: { sheet: 'Mensajes', headers: ['Fecha', 'ID', 'Jugador ID', 'Nombre', 'Mensaje'], field: 'texto', max: 300 },
  song: { sheet: 'Canciones', headers: ['Fecha', 'ID', 'Jugador ID', 'Nombre', 'Canción'], field: 'cancion', max: 100 },
};

const MAX_LIMIT = 50;
const CACHE_SECONDS = 30;
const CACHE_ROWS = 100;

/* ------------------------------------------------------------------ */
/* Entradas HTTP                                                        */
/* ------------------------------------------------------------------ */

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'leaderboard') {
      return json_({ ok: true, rows: leaderboard_(p.game, p.limit, p.player) });
    }
    return json_({ ok: true, service: 'boda-scores', games: Object.keys(GAMES) });
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    checkToken_(body.token);
    if (body.action === 'score') return json_(Object.assign({ ok: true }, saveScore_(body)));
    if (body.action === 'menu') return json_(Object.assign({ ok: true }, saveMenu_(body)));
    if (body.action === 'message') return json_(Object.assign({ ok: true }, saveNote_(NOTES.message, body)));
    if (body.action === 'song') return json_(Object.assign({ ok: true }, saveNote_(NOTES.song, body)));
    throw new Error('unknown_action');
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

/** Ejecuta esto una vez desde el editor para crear la hoja y autorizar permisos. */
function setup() {
  const sheet = getSheet_();
  refreshMenuSummary_();   // crea "Menu" y reescribe "Resumen menú" (corrige el #ERROR! de versiones con QUERY)
  Object.keys(NOTES).forEach(k => getOrCreateSheet_(getSpreadsheet_(), NOTES[k].sheet, NOTES[k].headers));
  const header = sheet.getRange(1, 1, 1, HEADERS.length);
  const current = header.getValues()[0];
  if (current.some((v, i) => v !== HEADERS[i])) header.setValues([HEADERS]).setFontWeight('bold');
  Logger.log('Hoja lista: %s (pestañas Scores, Menu, Resumen menú, Mensajes y Canciones)', sheet.getParent().getUrl());
}

/* ------------------------------------------------------------------ */
/* Lógica                                                               */
/* ------------------------------------------------------------------ */

function saveScore_(b) {
  const game = String(b.juego || '');
  const rules = GAMES[game];
  if (!rules) throw new Error('invalid_game');

  const score = Number(b.puntaje);
  if (!Number.isInteger(score) || score < 0 || score > rules.maxScore) throw new Error('invalid_score');

  const present = v => v !== null && v !== undefined && v !== '';

  // maximo = nº de preguntas (trivias). Versiones anteriores enviaban puntaje = aciertos ≤ maximo.
  let max = '';
  if (present(b.maximo)) {
    max = Number(b.maximo);
    if (!Number.isInteger(max) || max < 0 || max > (rules.maxQuestions || rules.maxScore)) throw new Error('invalid_max');
  }

  let hits = '';
  if (present(b.aciertos)) {
    hits = Number(b.aciertos);
    const limit = max === '' ? rules.maxQuestions : max;
    if (!rules.maxQuestions || !Number.isInteger(hits) || hits < 0 || hits > limit) throw new Error('invalid_hits');
    if (score > hits * 200) throw new Error('invalid_score');   // máximo 200 puntos por acierto
  }

  const id = cleanText_(b.id, 64);
  if (!id) throw new Error('missing_id');
  const playerId = cleanText_(b.playerId, 64) || 'anon';
  const name = cleanText_(b.nombre, 30) || 'Invitado';
  const ms = Number(b.duracionMs);
  const seconds = ms > 0 && ms < 864e5 ? Math.round(ms / 100) / 10 : '';

  let level = '';
  if (b.nivel !== null && b.nivel !== undefined && b.nivel !== '') {
    level = Number(b.nivel);
    if (!rules.maxLevel || !Number.isInteger(level) || level < 1 || level > rules.maxLevel) throw new Error('invalid_level');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    if (isDuplicate_(sheet, id)) return { duplicate: true };
    sheet.appendRow([new Date(), id, playerId, name, game, score, max, seconds, level, hits]);
  } finally {
    lock.releaseLock();
  }

  CacheService.getScriptCache().remove(cacheKey_(game));
  return { saved: true };
}

function saveMenu_(b) {
  const playerId = cleanText_(b.playerId, 64);
  const nombre = cleanText_(b.nombre, 60);
  const plato = cleanText_(b.plato, 60);
  const postre = cleanText_(b.postre, 60);
  const restricciones = cleanText_(b.restricciones, 300);
  if (!playerId) throw new Error('missing_player');
  if (!nombre || !plato || !postre) throw new Error('missing_fields');

  const row = [new Date(), playerId, nombre, plato, postre, restricciones];
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = ensureMenuSheets_();
    const last = sheet.getLastRow();
    const found = last < 2 ? null : sheet.getRange(2, 2, last - 1, 1)
      .createTextFinder(playerId).matchEntireCell(true).findNext();
    if (found) sheet.getRange(found.getRow(), 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
    refreshMenuSummary_();
    return found ? { saved: true, updated: true } : { saved: true };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Guarda un mensaje o una canción sugerida (una fila por envío, deduplicado por id).
 * @param {{sheet: string, headers: string[], field: string, max: number}} kind  NOTES.message | NOTES.song
 */
function saveNote_(kind, b) {
  const id = cleanText_(b.id, 64);
  if (!id) throw new Error('missing_id');
  const rawName = String(b.nombre == null ? '' : b.nombre).trim();
  if (rawName.length < 2) throw new Error('missing_name');
  const name = cleanText_(rawName, 30);
  const text = cleanText_(String(b[kind.field] == null ? '' : b[kind.field]).replace(/\s+/g, ' '), kind.max);
  if (!text) throw new Error('missing_text');
  const playerId = cleanText_(b.playerId, 64) || 'anon';

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getOrCreateSheet_(getSpreadsheet_(), kind.sheet, kind.headers);
    if (isDuplicate_(sheet, id)) return { duplicate: true };
    sheet.appendRow([new Date(), id, playerId, name, text]);
    return { saved: true };
  } finally {
    lock.releaseLock();
  }
}

/** Crea (si falta) la pestaña "Menu". */
function ensureMenuSheets_() {
  return getOrCreateSheet_(getSpreadsheet_(), MENU_SHEET, MENU_HEADERS);
}

/**
 * Reescribe la pestaña "Resumen menú" con VALORES calculados aquí (sin fórmulas,
 * para que funcione igual en hojas en español —separador ";"— o en inglés).
 *   A:B  Plato principal | Cantidad      (de mayor a menor)
 *   D:E  Postre | Cantidad
 *   G    Invitados que eligieron, fecha de actualización
 *   I:J  Nombre | Alergias / restricciones (solo quienes escribieron algo)
 */
function refreshMenuSummary_() {
  const ss = getSpreadsheet_();
  const menu = getOrCreateSheet_(ss, MENU_SHEET, MENU_HEADERS);
  const sum = ss.getSheetByName(SUMMARY_SHEET) || ss.insertSheet(SUMMARY_SHEET);

  const last = menu.getLastRow();
  const rows = last < 2 ? [] : menu.getRange(2, 1, last - 1, MENU_HEADERS.length).getValues();

  const tally = col => {
    const counts = {};
    rows.forEach(r => {
      const key = String(r[col]).trim();
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    return Object.keys(counts)
      .map(k => [asText_(k), counts[k]])
      .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  };
  const notes = rows
    .filter(r => String(r[5]).trim())
    .map(r => [asText_(r[2]), asText_(r[5])]);

  const write = (row, col, values) =>
    sum.getRange(row, col, values.length, values[0].length).setValues(values);

  sum.clear();
  write(1, 1, [['Plato principal', 'Cantidad']].concat(tally(3)));
  write(1, 4, [['Postre', 'Cantidad']].concat(tally(4)));
  write(1, 7, [['Invitados que eligieron'], [rows.length], [''], ['Actualizado'], [new Date()]]);
  write(1, 9, [['Nombre', 'Alergias / restricciones']].concat(notes));
  sum.getRange(1, 1, 1, 10).setFontWeight('bold');
  sum.setFrozenRows(1);
}

/** Menú "Boda" en la hoja para refrescar el resumen a mano (p. ej. tras borrar filas). */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Boda')
    .addItem('Actualizar resumen del menú', 'refreshMenuSummary')
    .addToUi();
}

function refreshMenuSummary() {
  refreshMenuSummary_();
}

/** Al reescribir textos de invitados, evita que "=…" se interprete como fórmula. */
function asText_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function leaderboard_(game, limit, me) {
  if (!GAMES[game]) throw new Error('invalid_game');
  const n = Math.min(Math.max(parseInt(limit, 10) || 10, 1), MAX_LIMIT);

  const cache = CacheService.getScriptCache();
  const key = cacheKey_(game);
  let best = JSON.parse(cache.get(key) || 'null');
  if (!best) {
    best = bestByPlayer_(game).slice(0, CACHE_ROWS);
    cache.put(key, JSON.stringify(best), CACHE_SECONDS);
  }

  return best.slice(0, n).map((r, i) => ({
    pos: i + 1,
    nombre: r.nombre,
    puntaje: r.puntaje,
    maximo: r.maximo,
    aciertos: r.aciertos,
    nivel: r.nivel,
    me: Boolean(me) && r.playerId === me,
  }));
}

/** Mejor puntaje de cada jugador; empate → gana quien lo logró primero. */
function bestByPlayer_(game) {
  const sheet = getSheet_();
  const last = sheet.getLastRow();
  if (last < 2) return [];

  const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const byPlayer = {};
  rows.forEach(row => {
    if (row[COL.juego] !== game) return;
    const entry = {
      playerId: String(row[COL.playerId]),
      nombre: String(row[COL.nombre]).replace(/^'/, ''),
      puntaje: Number(row[COL.puntaje]),
      maximo: row[COL.maximo] === '' ? null : Number(row[COL.maximo]),
      nivel: row[COL.nivel] === '' || row[COL.nivel] === undefined ? null : Number(row[COL.nivel]),
      aciertos: row[COL.aciertos] === '' || row[COL.aciertos] === undefined ? null : Number(row[COL.aciertos]),
      t: new Date(row[COL.fecha]).getTime() || 0,
    };
    const prev = byPlayer[entry.playerId];
    if (!prev || entry.puntaje > prev.puntaje || (entry.puntaje === prev.puntaje && entry.t < prev.t)) {
      byPlayer[entry.playerId] = entry;
    }
  });

  return Object.keys(byPlayer)
    .map(k => byPlayer[k])
    .sort((a, b) => b.puntaje - a.puntaje || a.t - b.t);
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                           */
/* ------------------------------------------------------------------ */

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('no_spreadsheet: vincula el script a una hoja o define SPREADSHEET_ID');
  return ss;
}

function getSheet_() {
  return getOrCreateSheet_(getSpreadsheet_(), SHEET_NAME, HEADERS);
}

function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function isDuplicate_(sheet, id) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  return sheet.getRange(2, COL.id + 1, last - 1, 1)
    .createTextFinder(id)
    .matchEntireCell(true)
    .findNext() !== null;
}

function checkToken_(token) {
  const expected = PropertiesService.getScriptProperties().getProperty('SCORES_TOKEN');
  if (expected && token !== expected) throw new Error('unauthorized');
}

/**
 * Limpia texto del usuario: quita caracteres de control, recorta y
 * neutraliza fórmulas (=, +, -, @) para evitar inyección en Sheets.
 */
function cleanText_(value, maxLength) {
  const text = String(value == null ? '' : value)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function cacheKey_(game) {
  return 'leaderboard:' + game;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
