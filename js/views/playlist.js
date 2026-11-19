import { CONFIG, coupleName } from '../config.js';
import { $, esc } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { player } from '../lib/player.js';
import { suggestSong, history } from '../lib/notes.js';
import { nameError } from '../components/name-gate.js';
import { spinner } from '../components/spinner.js';
import { sentListHtml, SEND_RESULT } from '../components/sent-list.js';

export default function playlist() {
  return {
    html: `
      <section class="s sea">
        <img class="deco pl-hibiscus" src="img/hibiscus.svg" alt="">
        <img class="deco pl-surf" src="img/surfboard.svg" alt="">
        ${icon('music', 64, 'view-icon')}
        <h2>Nuestra Playlist</h2>
        <p class="sub">Dale play a la mejor banda sonora 🎵</p>

        <div class="player">
          <div class="row">
            <div class="cover" aria-hidden="true"></div>
            <div><b class="player-title">Nuestra Boda</b><br>${esc(coupleName)} ♡</div>
          </div>
          <div class="prog"><i></i></div>
          <div class="times" aria-hidden="true"><span>0:00</span><span>-3:24</span></div>
          <div class="ctl">
            ${icon('shuffle', 24)}${icon('prev', 28)}
            <button type="button" class="play" id="pl" aria-label="Reproducir">${icon('play', 30)}</button>
            ${icon('next', 28)}${icon('repeat', 24)}
          </div>
        </div>

        <a class="btn btn--sun spotify" href="${esc(CONFIG.playlist)}" target="_blank" rel="noopener">
          <span class="spotify-dot" aria-hidden="true">${icon('music', 16)}</span>Abrir en Spotify
        </a>

        <form class="card suggest note-form" id="song-form" novalidate>
          <b class="suggest-title">Sugiere una canción</b>
          <p class="suggest-hint">Los novios reciben tu sugerencia para la playlist 🎶</p>

          <label class="field-label" for="sg-name">Tu nombre <span aria-hidden="true">*</span></label>
          <input type="text" id="sg-name" maxlength="30" autocomplete="given-name" required
            aria-describedby="sg-name-error" value="${esc(player.name)}">
          <p class="form-error" id="sg-name-error" aria-live="polite"></p>

          <label class="field-label" for="sg">Canción <span aria-hidden="true">*</span></label>
          <input type="text" id="sg" placeholder="Canción – Artista" maxlength="100" required aria-describedby="sg-error">
          <p class="form-error" id="sg-error" aria-live="polite"></p>

          <button type="submit" class="btn btn--block">Enviar</button>
          <div class="note-status" id="sg-status" aria-live="polite"></div>
          <div id="sgl">${sentListHtml(history('song'), 'Tus sugerencias')}</div>
        </form>
      </section>`,

    mount(root) {
      const playBtn = $('#pl', root);
      let playing = false;
      playBtn.addEventListener('click', () => {
        playing = !playing;
        playBtn.innerHTML = playing ? '<b aria-hidden="true">❚❚</b>' : icon('play', 30);
        playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
      });

      const form = $('#song-form', root);
      const name = $('#sg-name', root);
      const song = $('#sg', root);
      const status = $('#sg-status', root);
      const btn = form.querySelector('button[type=submit]');

      const fieldError = (input, msg) => {
        $(`#${input.id}-error`, root).textContent = msg;
        if (msg) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      };
      name.addEventListener('input', () => { if (!nameError(name.value)) fieldError(name, ''); });
      song.addEventListener('input', () => { if (song.value.trim()) fieldError(song, ''); });

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const nErr = nameError(name.value);
        const sErr = song.value.trim() ? '' : 'Escribe la canción y el artista.';
        fieldError(name, nErr);
        fieldError(song, sErr);
        if (nErr || sErr) return (nErr ? name : song).focus();

        player.name = name.value;
        btn.disabled = true;
        status.innerHTML = spinner('Enviando tu sugerencia…', { small: true });
        const { status: result } = await suggestSong({ nombre: name.value.trim(), cancion: song.value.trim() });
        if (!form.isConnected) return;
        btn.disabled = false;
        status.innerHTML = `<p class="note-result ${result === 'rejected' ? 'is-error' : 'is-ok'}">${SEND_RESULT[result]}</p>`;
        if (result !== 'rejected') song.value = '';
        $('#sgl', root).innerHTML = sentListHtml(history('song'), 'Tus sugerencias');
      });
    },
  };
}
