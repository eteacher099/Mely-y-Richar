/**
 * El nombre del jugador es obligatorio para los juegos con ranking.
 * withPlayerName(view) muestra primero "¿Quién juega?" si este dispositivo aún no tiene nombre;
 * al guardarlo vuelve a pintar la ruta actual y arranca el juego.
 */
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { player } from '../lib/player.js';

export const MIN_NAME = 2;

/** Valida un nombre; devuelve el mensaje de error o '' si es válido. */
export function nameError(value) {
  const name = String(value || '').trim();
  if (!name) return 'Escribe tu nombre para jugar.';
  if (name.length < MIN_NAME) return `Tu nombre debe tener al menos ${MIN_NAME} letras.`;
  return '';
}

export function withPlayerName(view) {
  return () => {
    if (!nameError(player.name)) return view();

    return {
      html: `
        <section class="s sea">
          <h2>¿Quién juega?</h2>
          <p class="sub">Escribe tu nombre para aparecer en el ranking.</p>
          <form class="name-gate" id="ng" novalidate>
            <label class="field-label" for="ng-name">Tu nombre</label>
            <input type="text" id="ng-name" maxlength="30" autocomplete="given-name" required
              value="${esc(player.name)}" aria-describedby="ng-error">
            <p class="form-error" id="ng-error" aria-live="polite"></p>
            <button type="submit" class="btn btn--sun btn--big">${icon('play', 28)}Empezar</button>
          </form>
          <p><a class="link" href="#juego">← Volver a juegos</a></p>
        </section>`,

      mount(root) {
        const form = $('#ng', root);
        const input = $('#ng-name', root);
        const error = $('#ng-error', root);
        input.focus();
        form.addEventListener('submit', e => {
          e.preventDefault();
          const msg = nameError(input.value);
          if (msg) {
            error.textContent = msg;
            input.setAttribute('aria-invalid', 'true');
            input.focus();
            return;
          }
          player.name = input.value;
          // Vuelve a pintar la misma ruta: ahora sí arranca el juego.
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
      },
    };
  };
}
