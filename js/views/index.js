/**
 * Registro de rutas: hash → vista.
 * Para agregar una pantalla: crea js/views/mi-vista.js, regístrala aquí
 * y (si aplica) agrega el enlace en el <nav id="menu"> de index.html.
 */
import { CONFIG } from '../config.js';
import home from './home.js';
import itinerario from './itinerario.js';
import juegos from './juegos.js';
import { createQuiz } from './quiz.js';
import tesla from './tesla.js';
import bingo from './bingo.js';
import playlist from './playlist.js';
import album from './album.js';
import mensajes from './mensajes.js';
import info from './info.js';
import menu from './menu.js';
import historia from './historia.js';
import { withPlayerName } from '../components/name-gate.js';

export const DEFAULT_ROUTE = 'home';

// Los juegos con ranking exigen nombre (withPlayerName pide "¿Quién juega?" si falta).
export const routes = {
  home,
  itin: itinerario,
  juego: juegos,
  trivia: withPlayerName(createQuiz({ game: 'trivia', title: 'Wedding Game', questions: CONFIG.trivia })),
  marina: withPlayerName(createQuiz({ game: 'marina', title: 'Trivia Marina', questions: CONFIG.marina, shuffle: true })),
  tesla: withPlayerName(tesla),
  bingo,
  playlist,
  album,
  mensajes,
  info,
  carta: menu,      // no usar #menu: choca con <nav id="menu">
  historia,
};
