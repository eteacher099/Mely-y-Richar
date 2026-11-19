/**
 * Spinner playero: una pelota de playa que gira y rebota sobre su sombra.
 * Se usa mientras se espera al Apps Script (guardar puntaje / menú, cargar rankings).
 *   spinner('Guardando puntaje…')           → tamaño normal
 *   spinner('Cargando…', { small: true })   → versión compacta (rankings)
 */
import { esc } from '../lib/dom.js';

// Pelota de 6 gajos (rojo, blanco, amarillo, blanco, azul, blanco) con brillo.
const BALL = `
  <svg class="bs-svg" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <g stroke="#14337A" stroke-width="1.2" stroke-linejoin="round">
      <path fill="#E2553F" d="M20 20 38 20A18 18 0 0 1 29 35.59Z"/>
      <path fill="#FFFFFF" d="M20 20 29 35.59A18 18 0 0 1 11 35.59Z"/>
      <path fill="#F7C64A" d="M20 20 11 35.59A18 18 0 0 1 2 20Z"/>
      <path fill="#FFFFFF" d="M20 20 2 20A18 18 0 0 1 11 4.41Z"/>
      <path fill="#2A5CAA" d="M20 20 11 4.41A18 18 0 0 1 29 4.41Z"/>
      <path fill="#FFFFFF" d="M20 20 29 4.41A18 18 0 0 1 38 20Z"/>
      <circle cx="20" cy="20" r="3.2" fill="#FFFFFF"/>
    </g>
    <circle cx="20" cy="20" r="18" fill="none" stroke="#14337A" stroke-width="1.6"/>
    <ellipse cx="13" cy="11" rx="4.5" ry="2.6" fill="#fff" opacity=".55" transform="rotate(-35 13 11)"/>
  </svg>`;

export function spinner(text = 'Cargando…', { small = false } = {}) {
  return `
    <div class="beach-spinner${small ? ' beach-spinner--sm' : ''}" role="status" aria-live="polite">
      <div class="bs-stage" aria-hidden="true">
        <div class="bs-ball">${BALL}</div>
        <div class="bs-shadow"></div>
        <div class="bs-waves"><i></i><i></i></div>
      </div>
      <span class="bs-text">${esc(text)}</span>
    </div>`;
}
