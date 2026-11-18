/**
 * Router por hash (#home, #itin, ...) y "layout" común.
 *
 * Contrato de una vista (js/views/*.js): una función que devuelve
 *   { html: string, bar?: boolean = true, wave?: boolean = true, mount?: (root) => (cleanup | void) }
 * - html  : se inserta en #app (todo dato variable debe pasar por esc()).
 * - bar   : muestra la barra superior (inicio + menú).
 * - wave  : muestra las olas al pie de la pantalla.
 * - mount : enlaza eventos después de pintar; puede devolver una función
 *           de limpieza (timers, etc.) que se ejecuta al cambiar de vista.
 */
import { $ } from './lib/dom.js';
import { icon } from './lib/icons.js';
import { routes, DEFAULT_ROUTE } from './views/index.js';

const app = $('#app');
const menu = $('#menu');

const WAVE = '<div class="wave" aria-hidden="true"></div>';
const topBar = () => `
  <div class="bar">
    <a class="ib" href="#home" aria-label="Inicio">${icon('home', 30)}</a>
    <button class="ib" type="button" data-menu-toggle aria-controls="menu" aria-expanded="false" aria-label="Abrir menú">${icon('menu', 30)}</button>
  </div>`;

let cleanup = null;

function setMenu(open) {
  menu.hidden = !open;
  const toggle = $('[data-menu-toggle]', app);
  toggle?.setAttribute('aria-expanded', String(open));
  if (open) $('a', menu)?.focus();
  else if (document.activeElement && menu.contains(document.activeElement)) toggle?.focus();
}

function render() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
  menu.hidden = true;

  const view = routes[location.hash.slice(1)] ?? routes[DEFAULT_ROUTE];
  const { html, mount, bar = true, wave = true } = view();
  app.innerHTML = (bar ? topBar() : '') + html + (wave ? WAVE : '');
  window.scrollTo(0, 0);
  cleanup = mount?.(app) ?? null;
}

export function startRouter() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-menu-toggle]')) setMenu(menu.hidden);
    else if (e.target.closest('[data-menu-close], #menu a')) setMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) setMenu(false);
  });
  addEventListener('hashchange', render);
  render();
}
