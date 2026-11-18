# TODO

## 🚀 Para publicar el ranking
- [ ] Crear la hoja de Google Sheets y pegar `google-scripts/scores.gs` (ver `google-scripts/README.md`)
- [ ] Ejecutar `setup()` y autorizar permisos
- [x] Publicar como Web App (*Ejecutar como: Yo*, *Acceso: Cualquier persona*)
- [x] Pegar la URL `/exec` en `CONFIG.scores.endpoint` (`js/config.js`)
- [ ] Probar con `curl` y desde el celular; borrar las filas de prueba
- [ ] Confirmar `timeZone` en `google-scripts/appsscript.json` (está `America/Bogota`)
- [ ] (Opcional) Definir `SCORES_TOKEN` en el script y en `CONFIG.scores.token`

## ✏️ Contenido real (hoy hay datos de ejemplo)
- [ ] (Opcional) Reemplazar las ilustraciones SVG por el arte final en alta resolución
      (exportar del generador del storyboard y apuntar `CONFIG.portada` a ese archivo)
- [ ] Confirmar fecha/hora, nombre del salón y enlace de Google Maps
- [ ] Enlace real de la playlist colaborativa de Spotify
- [ ] Respuestas reales de la trivia de los novios (las actuales son supuestas)
- [ ] Revisar itinerario, dress code y FAQ

## 🐛 Funcionalidad incompleta
- [ ] **Mensajes**: solo se guardan en el teléfono del invitado → los novios nunca los leen.
      Enviarlos a Sheets con una acción `message` en el mismo Apps Script
- [ ] **Sugerencias de canciones**: mismo problema → acción `song` en el Apps Script
- [ ] **Álbum**: las fotos quedan en `localStorage` (~5 MB, solo las ve quien las sube).
      Opciones: subir a una carpeta de Google Drive vía Apps Script, o enlazar un álbum
      compartido de Google Fotos
- [ ] **Reproductor**: es decorativo (el ▶ no reproduce nada). Reemplazar por el embed
      de Spotify o quitar los controles
- [ ] Bingo: registrar en Sheets quién completó el cartón (opcional)
- [ ] Juegos: si el invitado entra directo a `#trivia` sin nombre, se guarda como
      "Invitado". Pedir el nombre en la pantalla de resultado
- [ ] Tesla: el perrito puede quedar tapado por otro emoji; evitar superposición

## ✨ Mejoras sugeridas
- [ ] RSVP / confirmación de asistencia (guardar en Sheets)
- [ ] Meta tags Open Graph + imagen para que el enlace se vea bonito en WhatsApp
- [ ] Favicon
- [ ] Botón "Agregar al calendario" (.ics / Google Calendar)
- [ ] Probar en iOS Safari y Android Chrome (safe areas, teclado, subida de fotos)
- [ ] Publicar el sitio (p. ej. GitHub Pages) y documentar la URL final

## ✅ Hecho
- [x] Separar el `index.html` monolítico en `css/` + módulos `js/` (config, router, vistas)
- [x] Corregir el choque de la clase `.sun`: los botones "▶ Jugar" y "Abrir en Spotify"
      quedaban con `position:absolute` y giraban → ahora `.sun-deco` / `.btn--sun`
- [x] Eliminar CSS muerto (`.couple-title`, `.name-first`, `.hero .pic`, `h1`, `.t`)
- [x] Nombres de los novios en la portada salen de `CONFIG.nombres`
- [x] Limpieza de timers al cambiar de pantalla (contrato `mount → cleanup`)
- [x] Menú accesible (Escape, `aria-expanded`, foco) sin `onclick` inline
- [x] Apps Script de puntajes con validación, deduplicado, lock y ranking cacheado
- [x] Cliente de puntajes con cola offline y ranking al terminar cada juego
- [x] `CLAUDE.md` y este `TODO.md`
- [x] Rediseño según el storyboard: portada con escena de playa e ilustración de Meli,
      Richi y Tesla; olas superiores, iconos, juego de Tesla con el perrito ilustrado
- [x] Ilustraciones SVG en `img/` (pareja, Tesla, playa, sol, palmeras, hibisco, etc.)
