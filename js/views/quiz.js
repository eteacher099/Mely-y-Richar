import { $, $$, esc } from '../lib/dom.js';
import { submitScore, answerPoints } from '../lib/scores.js';
import { scorePanelHtml, mountScorePanel } from '../components/score-panel.js';

const FEEDBACK_MS = 1000;

const shuffle = arr => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** Baraja preguntas y opciones, recalculando el índice de la respuesta correcta. */
export function shuffleQuestions(questions) {
  return shuffle(questions).map(({ q, o, a }) => {
    const order = shuffle(o.map((_, i) => i));
    return { q, o: order.map(i => o[i]), a: order.indexOf(a) };
  });
}

/**
 * Crea una vista de trivia. Puntaje: cada acierto vale answerPoints(ms) — 50 base + hasta 150
 * por rapidez (ver lib/scores.js); los errores valen 0. El ranking ordena por puntos.
 * @param {{game: string, title: string, questions: {q: string, o: string[], a: number}[], shuffle?: boolean}} opts
 *   game:    id con el que se guarda el puntaje (debe existir en GAMES de google-scripts/scores.gs)
 *   shuffle: barajar preguntas y opciones en cada partida
 */
export function createQuiz({ game, title, questions: source, shuffle: mix = false }) {
  return () => {
    const questions = mix ? shuffleQuestions(source) : source;

    return {
      html: `
        <section class="s sea">
          <h2>${esc(title)}</h2>
          <p class="quiz-hint">Responde rápido: ¡entre más rápido aciertes, más puntos! ⚡</p>
          <div id="quiz"></div>
        </section>`,

      mount(root) {
        const box = $('#quiz', root);
        const total = questions.length;
        const startedAt = Date.now();
        const times = [];
        let index = 0;
        let correct = 0;
        let points = 0;
        let askedAt = 0;
        let pending;

        const ask = () => {
          const q = questions[index];
          box.innerHTML = `
            <div class="quiz-hud">
              <span>Pregunta ${index + 1} de ${total}</span>
              <b class="pill">Puntos: ${points}</b>
            </div>
            <p class="q">${esc(q.q)}</p>
            ${q.o.map((opt, j) => `<button type="button" class="o" data-j="${j}">${esc(opt)}</button>`).join('')}
            <p class="quiz-feedback" aria-live="polite"></p>`;
          askedAt = performance.now();
        };

        const finish = () => {
          const avg = times.reduce((a, b) => a + b, 0) / times.length / 1000;
          box.innerHTML = `
            <div class="result-emoji" aria-hidden="true">${correct === total ? '🏆' : '🎉'}</div>
            <p class="q">${points} puntos</p>
            <p class="quiz-summary">Acertaste <b>${correct} de ${total}</b> · Tiempo promedio <b>${avg.toFixed(1)} s</b></p>
            ${scorePanelHtml()}
            <a class="btn" href="#juego">Más juegos</a>`;
          mountScorePanel(box, game, submitScore({
            game, score: points, max: total, correct, durationMs: Date.now() - startedAt,
          }));
        };

        box.addEventListener('click', e => {
          const btn = e.target.closest('.o');
          if (!btn || btn.disabled) return;

          const ms = performance.now() - askedAt;
          times.push(ms);
          const q = questions[index];
          const options = $$('.o', box);
          options.forEach(o => { o.disabled = true; });
          const feedback = $('.quiz-feedback', box);

          if (Number(btn.dataset.j) === q.a) {
            const gained = answerPoints(ms);
            correct++;
            points += gained;
            btn.classList.add('ok');
            feedback.textContent = `+${gained} · ${(ms / 1000).toFixed(1)} s`;
            feedback.className = 'quiz-feedback is-ok';
          } else {
            btn.classList.add('no');
            options[q.a]?.classList.add('ok');
            feedback.textContent = `+0 · ${(ms / 1000).toFixed(1)} s`;
            feedback.className = 'quiz-feedback is-bad';
          }
          $('.quiz-hud .pill', box).textContent = `Puntos: ${points}`;

          index++;
          pending = setTimeout(index < total ? ask : finish, FEEDBACK_MS);
        });

        ask();
        return () => clearTimeout(pending);
      },
    };
  };
}
