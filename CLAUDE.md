# CLAUDE.md

Invitación web de la boda de **Meli & Richi** (20 mar 2027). Sitio estático, móvil
primero, sin build ni dependencias: HTML + CSS + JavaScript con módulos ES nativos.
Los textos de la interfaz van en español.

## Ejecutar en local

Los módulos ES **no cargan con `file://`** (abrir `index.html` con doble clic deja la
pantalla en blanco). Usa un servidor estático:

```bash
npx serve .            # o
python -m http.server 8000
```

o la extensión *Live Server* de VS Code. No hay tests ni linter configurados.

## Estructura

```
index.html              Shell: <head>, #app, menú <nav id="menu">, carga js/main.js
css/
  base.css              Tokens (:root), reset, layout (#app, .s, .sea, h2, .wave)
  components.css        .bar, .btn, .card, inputs, .menu, details, .pill, ranking
  views.css             Estilos por pantalla (home, itinerario, juegos, playlist…)
js/
  config.js             ★ TODO el contenido editable (nombres, fecha, trivia, FAQ, scores)
  main.js               Arranque: título, router, reintento de puntajes pendientes
  router.js             Router por hash + barra superior + menú + ciclo de vida de vistas
  lib/dom.js            $, $$, esc (escape HTML), timeAgo, uid
  lib/storage.js        localStorage con prefijo "boda_" y JSON, nunca lanza
  lib/player.js         Nombre e id del invitado en este dispositivo
  lib/scores.js         Cliente de la API de puntajes (envío, cola offline, ranking)
  lib/icons.js          Iconos SVG inline (icon('camera', 56)), rayitos de sol y gaviota
  components/score-panel.js   Panel de resultado: estado del envío + ranking
  views/index.js        Registro de rutas hash → vista
  views/*.js            Una pantalla por archivo
img/                    Ilustraciones SVG del storyboard (ver abajo)
google-scripts/         Apps Script (Web App) que guarda puntajes en Google Sheets
TODO.md                 Pendientes del proyecto
```

## Arquitectura

**Rutas** (`js/views/index.js`): `#home`, `#itin`, `#juego`, `#trivia`, `#marina`,
`#tesla`, `#bingo`, `#playlist`, `#album`, `#mensajes`, `#info`. Hash desconocido → home.

**Contrato de una vista**: función que devuelve

```js
{ html: string, bar?: boolean, wave?: boolean /* ambos default true */, mount?: (root) => cleanup | void }
```

- `router.render()` ejecuta el cleanup anterior, pinta `bar + html + ola` en `#app` y
  llama a `mount(root)`.
- Todo `setInterval`/`setTimeout` de una vista **debe** limpiarse en el cleanup.
- Los eventos se enlazan en `mount` con `addEventListener` (sin `onclick` inline ni
  globales). Para actualizar la pantalla se modifica el DOM local; no se re-renderiza
  toda la vista.
- Las trivias se crean con `createQuiz({ game, title, questions })` (`views/quiz.js`).

**Agregar una pantalla**: crear `js/views/x.js`, registrarla en `views/index.js`,
añadir el enlace al `<nav id="menu">` de `index.html` y sus estilos en `css/views.css`.

## Diseño visual (storyboard)

El diseño sigue un storyboard ilustrado: playa, azul marino `--navy`, crema, títulos en
Kaushan Script, olas arriba (fondo de `.sea`) y abajo (`.wave`), rayitos de sol sobre los
títulos (`.sea h2::before`; se omiten si la pantalla tiene un `.view-icon`).

Ilustraciones en `img/`, todas SVG dibujadas a mano (nítidas en cualquier pantalla):
`couple.svg` (Meli, Richi y Tesla; portada y hub de juegos), `tesla.svg` (perrito del juego
y de Mensajes), `beach.svg` (fondo de portada, juego y carátula de la playlist) y
decoraciones (`sun`, `palm`, `palm-leaves`, `hibiscus`, `starfish`, `shell`, `surfboard`,
`lighthouse`). Las decoraciones usan `<img class="deco ...">` posicionadas en CSS;
dentro de `.sea` quedan detrás del contenido. Para usar arte final (PNG/JPG), cambiar
`CONFIG.portada`; si la imagen no carga, la portada vuelve a `img/couple.svg`.

## Puntajes → Google Sheets

Flujo: juego termina → `submitScore()` → `POST` al Web App → fila en la hoja `Scores`
→ `getLeaderboard()` → ranking en `score-panel`.

- Se activa al poner la URL `/exec` en `CONFIG.scores.endpoint`. Vacío = solo local
  (mejor puntaje por dispositivo).
- `POST` con `Content-Type: text/plain` a propósito: evita el preflight CORS, que
  Apps Script no soporta. No cambiar a `application/json`.
- Sin red, el envío va a la cola `boda_scoreQueue` y se reintenta al cargar o en el
  evento `online`. Cada envío tiene `id` único y el servidor deduplica.
- Los ids de juego (`trivia`, `marina`, `tesla`) deben coincidir con `GAMES` en
  `google-scripts/scores.gs`; un juego nuevo hay que registrarlo en ambos lados.
- Cambios en `scores.gs` requieren redesplegar como **nueva versión de la misma
  implementación** para conservar la URL (ver `google-scripts/README.md`).

## Convenciones

- **Seguridad**: todo dato variable en un template HTML pasa por `esc()`, incluidos los
  valores de `CONFIG` y lo que escriba el invitado.
- **Contenido** solo en `js/config.js`; las vistas no traen textos de datos fijos.
- **CSS**: colores desde las variables de `:root`; modificadores estilo `.btn--sun`,
  `.card--center`. No usar estilos inline salvo valores dinámicos (posiciones de
  Tesla, imagen de portada).
- No reutilizar el nombre de una clase para dos cosas: `.sun` servía a la vez para el
  sol decorativo (absolute + animación) y para el botón amarillo, y rompía los botones.
  Ahora son `.sun-deco` y `.btn--sun`.
- Ancho de diseño: 430 px (`#app`). Probar en móvil y respetar `env(safe-area-inset-*)`.
- Accesibilidad: emojis decorativos con `aria-hidden="true"`, botones con `type="button"`
  y `aria-label` cuando solo tienen icono.

## Limitaciones conocidas

Mensajes, sugerencias de canciones, fotos del álbum y el bingo se guardan **solo en el
`localStorage` del invitado**: los novios no los ven. Ver `TODO.md`.
