# API de la invitación (Google Apps Script → Google Sheets)

`scores.gs` guarda en una hoja de cálculo los puntajes de los juegos (trivia, trivia marina y
"Encuentra a Tesla"), devuelve el ranking y registra la elección del **menú de boda** de cada invitado. Se publica como **Web App** y la invitación
le habla por `fetch`.

| Archivo | Qué es |
|---|---|
| `scores.gs` | Código del Web App (`doGet` / `doPost`) |
| `appsscript.json` | Manifiesto: runtime V8, zona horaria y permisos del Web App |

> **Actualización (menú de boda):** si ya tenías el Web App publicado, pega el `scores.gs`
> nuevo en el editor, ejecuta `setup()` una vez (crea `Menu` y rehace `Resumen menú`; corrige el
> `#ERROR!` de la versión anterior que usaba `QUERY`) y luego
> **Implementar → Gestionar implementaciones → ✏ → Nueva versión**. La URL `/exec` no cambia.

## 1. Crear la hoja y pegar el script

1. Crea una hoja nueva en Google Sheets (p. ej. **"Boda Mely & Richar"**).
2. Menú **Extensiones → Apps Script**. Así el script queda *vinculado* a esa hoja.
3. Borra el contenido de `Código.gs` y pega todo `scores.gs`.
4. (Opcional) **Configuración del proyecto ⚙ → "Mostrar el archivo de manifiesto appsscript.json"**
   y pega `appsscript.json`. Ajusta `timeZone` si la boda no es en Colombia
   (p. ej. `America/Mexico_City`).
5. Selecciona la función **`setup`** y pulsa **Ejecutar**. Acepta los permisos.
   Se crean las pestañas `Scores`, `Menu` y `Resumen menú`.

## 2. Publicar ("postear") el Web App

1. **Implementar → Nueva implementación → Tipo: Aplicación web**.
2. *Ejecutar como*: **Yo**. *Quién tiene acceso*: **Cualquier persona**.
3. **Implementar** y copia la URL que termina en **`/exec`**.

## 3. Enlazarlo con la invitación

En [`js/config.js`](../js/config.js):

```js
scores: {
  endpoint: 'https://script.google.com/macros/s/AKfy.../exec',
  token: '',
  rankingSize: 5,
},
```

Listo: al terminar un juego el puntaje se envía y se muestra el ranking.

## 4. Probar

```bash
URL="https://script.google.com/macros/s/AKfy.../exec"

# Health check
curl -L "$URL"

# Guardar un puntaje
curl -L -H "Content-Type: text/plain" \
  -d '{"action":"score","id":"prueba-1","playerId":"p1","nombre":"Prueba","juego":"tesla","puntaje":300}' \
  "$URL"

# Ranking
curl -L "$URL?action=leaderboard&game=tesla&limit=5"

# Guardar una elección del menú (repetirlo con el mismo playerId reemplaza la fila)
curl -L -H "Content-Type: text/plain" \
  -d '{"action":"menu","id":"prueba-m1","playerId":"p1","nombre":"Prueba","plato":"Poke de Salmón","postre":"Flan de Coco","restricciones":""}' \
  "$URL"
```

`-L` es necesario: Apps Script responde con una redirección.
Borra las filas de prueba de la hoja antes de la boda.

## Actualizar el código sin cambiar la URL

Si editas `scores.gs`, **Implementar → Gestionar implementaciones → ✏ Editar →
Versión: Nueva versión → Implementar**. Si creas una *nueva implementación*,
la URL cambia y hay que actualizar `js/config.js`.

## Opcional

- **Token anti-spam**: en *Configuración del proyecto → Propiedades de la secuencia de
  comandos* agrega `SCORES_TOKEN = <algo>` y pon el mismo valor en `scores.token`.
  No es seguridad real (el token es visible en el sitio); solo frena envíos al azar.
- **Script no vinculado**: si creaste el script desde script.google.com, agrega la
  propiedad `SPREADSHEET_ID` con el id de la hoja (está en su URL).
- **clasp**: `npm i -g @google/clasp`, `clasp login`, `clasp clone <scriptId>` en esta
  carpeta y luego `clasp push` para subir cambios (no subas `.clasp.json` si no quieres
  publicar el scriptId).

## Contrato de la API

| Método | Parámetros | Respuesta |
|---|---|---|
| `GET` | — | `{ ok, service, games }` |
| `GET` | `action=leaderboard&game=<id>&limit=<1-50>&player=<playerId>` | `{ ok, rows: [{ pos, nombre, puntaje, maximo, nivel, me }] }` |
| `POST` | body JSON `{ action:'score', id, playerId, nombre, juego, puntaje, maximo?, nivel?, duracionMs?, token? }` | `{ ok, saved }` · `{ ok, duplicate }` · `{ ok:false, error }` |
| `POST` | body JSON `{ action:'menu', id, playerId, nombre, plato, postre, restricciones?, token? }` | `{ ok, saved, updated? }` · `{ ok:false, error }` |

Pestañas que crea el script: `Scores` (puntajes), `Menu` (una fila por invitado) y
`Resumen menú` (conteo por plato y por postre + lista de alergias/restricciones).

`Resumen menú` se **reescribe con valores** (sin fórmulas) cada vez que alguien guarda su
elección, así funciona igual en hojas en español o en inglés. Si editas o borras filas de
`Menu` a mano, usa el menú de la hoja **Boda → Actualizar resumen del menú**.

- El ranking muestra el **mejor puntaje por jugador**; en empate gana quien lo logró primero.
  Se cachea 30 s.
- Juegos válidos y puntaje máximo: constante `GAMES` en `scores.gs`. Si agregas un juego
  nuevo en la invitación, regístralo ahí también.
- `id` es único por envío: el script ignora duplicados, así los reintentos offline son seguros.
- Los textos que empiezan con `= + - @` se guardan como texto (evita inyección de fórmulas).
