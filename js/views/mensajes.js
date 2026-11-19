/**
 * Mensajes para los novios: se envían a la hoja (pestaña "Mensajes") y son privados.
 * El invitado ve aquí solo lo que él envió, con su estado (enviado / pendiente).
 */
import { $, esc } from '../lib/dom.js';
import { player } from '../lib/player.js';
import { icon } from '../lib/icons.js';
import { sendMessage, history } from '../lib/notes.js';
import { nameError } from '../components/name-gate.js';
import { spinner } from '../components/spinner.js';
import { sentListHtml, SEND_RESULT } from '../components/sent-list.js';

const MAX = 300;

export default function mensajes() {
  return {
    html: `
      <section class="s sea">
        ${icon('mail', 64, 'view-icon')}
        <h2>Mensajes</h2>
        <p class="sub">Deja un mensaje para los novios ♡<br><small>Les llega directo a ellos 💌 (solo ellos lo leen)</small></p>

        <form id="msg-form" class="note-form" novalidate>
          <label class="field-label" for="nm">Tu nombre <span aria-hidden="true">*</span></label>
          <input type="text" id="nm" maxlength="30" autocomplete="given-name" required
            aria-describedby="nm-error" value="${esc(player.name)}">
          <p class="form-error" id="nm-error" aria-live="polite"></p>

          <label class="field-label" for="tx">Tu mensaje <span aria-hidden="true">*</span></label>
          <textarea id="tx" rows="4" maxlength="${MAX}" placeholder="Escribe tu mensaje..." required
            aria-describedby="tx-error"></textarea>
          <p class="form-error" id="tx-error" aria-live="polite"></p>

          <button type="submit" class="btn btn--block">${icon('send', 20)}Enviar</button>
          <div class="note-status" id="msg-status" aria-live="polite"></div>
        </form>

        <div id="msg-sent">${sentListHtml(history('message'), 'Tus mensajes')}</div>
        <div class="deco peek"><img src="img/tesla.svg" alt=""></div>
      </section>`,

    mount(root) {
      const form = $('#msg-form', root);
      const name = $('#nm', root);
      const text = $('#tx', root);
      const status = $('#msg-status', root);
      const btn = form.querySelector('button[type=submit]');

      const fieldError = (input, msg) => {
        $(`#${input.id}-error`, root).textContent = msg;
        if (msg) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      };
      name.addEventListener('input', () => { if (!nameError(name.value)) fieldError(name, ''); });
      text.addEventListener('input', () => { if (text.value.trim()) fieldError(text, ''); });

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const nErr = nameError(name.value);
        const tErr = text.value.trim() ? '' : 'Escribe tu mensaje.';
        fieldError(name, nErr);
        fieldError(text, tErr);
        if (nErr || tErr) return (nErr ? name : text).focus();

        player.name = name.value;
        btn.disabled = true;
        status.innerHTML = spinner('Enviando tu mensaje…');
        const { status: result } = await sendMessage({ nombre: name.value.trim(), texto: text.value.trim() });
        if (!form.isConnected) return;
        btn.disabled = false;
        status.innerHTML = `<p class="note-result ${result === 'rejected' ? 'is-error' : 'is-ok'}">${SEND_RESULT[result]}</p>`;
        if (result !== 'rejected') text.value = '';
        $('#msg-sent', root).innerHTML = sentListHtml(history('message'), 'Tus mensajes');
      });
    },
  };
}
