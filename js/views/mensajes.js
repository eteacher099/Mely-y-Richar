import { $, esc, timeAgo } from '../lib/dom.js';
import { storage } from '../lib/storage.js';
import { player } from '../lib/player.js';

const messageCard = m => `
  <div class="card msg">${esc(m.t)} ❤️<br>– ${esc(m.n)} <small>${timeAgo(m.d)}</small></div>`;

export default function mensajes() {
  const messages = storage.get('msgs', []);

  return {
    html: `
      <section class="s sea">
        <h2>Mensajes</h2>
        <p class="sub">Deja un mensaje para los novios ♡</p>
        <input type="text" id="nm" placeholder="Tu nombre" maxlength="30" autocomplete="given-name" value="${esc(player.name)}">
        <input type="text" id="tx" placeholder="Escribe tu mensaje..." maxlength="200">
        <button type="button" class="btn btn--block" id="sb">✈ Enviar</button>
        <div class="msg-list" id="ml">${messages.map(messageCard).join('')}</div>
      </section>`,

    mount(root) {
      const name = $('#nm', root);
      const text = $('#tx', root);
      const list = $('#ml', root);

      const send = () => {
        const t = text.value.trim();
        if (!t) return;
        const m = { t, n: name.value.trim() || 'Anónimo', d: Date.now() };
        messages.unshift(m);
        storage.set('msgs', messages);
        list.insertAdjacentHTML('afterbegin', messageCard(m));
        text.value = '';
      };

      $('#sb', root).addEventListener('click', send);
      text.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    },
  };
}
