/* ==================================================================
   EDITA AQUÍ TUS DATOS
   Todo el contenido de la invitación sale de este objeto.
   ================================================================== */
export const CONFIG = {
  nombres: ['Meli', 'Richi'],
  fecha: '2027-03-20T16:00:00',          // fecha y hora de la ceremonia (hora local)
  lugar: 'Salón Playa Azul',
  mapa: 'https://maps.google.com/?q=Salon+Playa+Azul',
  playlist: 'https://open.spotify.com/',  // enlace a la playlist colaborativa de Spotify
  perro: 'Tesla',
  portada: 'img/couple.svg',              // ilustración de portada; cámbiala por img/portada.jpg/.png si tienes arte final

  // [icono, hora, actividad]
  itinerario: [
    ['💍', '4:00 PM', 'Ceremonia'],
    ['🍸', '5:00 PM', 'Cóctel'],
    ['🍴', '7:00 PM', 'Cena'],
    ['🎵', '9:00 PM', 'Fiesta'],
    ['⭐', '12:00 AM', '¡Hasta el final!'],
  ],

  // q = pregunta, o = opciones, a = índice de la respuesta correcta
  trivia: [
    { q: '¿Dónde se conocieron Meli y Richi?', o: ['En la playa', 'En la universidad', 'En una fiesta'], a: 0 },
    { q: '¿Cómo se llama nuestro perrito?', o: ['Tesla', 'Edison', 'Newton'], a: 0 },
    { q: '¿Quién dijo "te quiero" primero?', o: ['Meli', 'Richi', 'Los dos a la vez'], a: 1 },
    { q: '¿Cuál es nuestro plan favorito?', o: ['Ir al cine', 'Viajar', 'Cocinar en casa'], a: 1 },
  ],
  marina: [
    { q: '¿Cuántos corazones tiene un pulpo?', o: ['1', '3', '8'], a: 1 },
    { q: '¿Cuál es el mamífero más grande del mar?', o: ['Tiburón ballena', 'Ballena azul', 'Orca'], a: 1 },
    { q: '¿Qué animal marino nunca duerme profundamente?', o: ['Delfín', 'Tortuga', 'Pez globo'], a: 0 },
  ],

  bingo: ['Foto con los novios', 'Alguien llora', 'Baile de papás', 'Brindis', 'Foto con Tesla',
    'Lanzan el ramo', 'Selfie grupal', 'Canción de playa', 'Abrazo a los novios'],

  vestimenta: 'Casual elegante (azul, blanco y toques de rojo y amarillo)',
  faq: [
    ['¿Puedo llevar acompañante?', 'Solo las personas indicadas en tu invitación.'],
    ['¿Habrá estacionamiento?', 'Sí, el salón cuenta con estacionamiento.'],
    ['¿Se permiten niños?', 'Escríbenos y lo coordinamos.'],
  ],

  // Ranking de juegos en Google Sheets (ver google-scripts/README.md).
  // Con endpoint vacío los puntajes solo se guardan en el dispositivo.
  scores: {
    endpoint: 'https://script.google.com/macros/s/AKfycbwOkKk-sJMk-tqW-Pw3yB_eCMx5M4SLRAx8tg7dUokQty8vl3hvSPxjIaJPcB2B_MP2_w/exec',      // URL ".../exec" del Web App de Apps Script
    token: '',         // opcional: debe coincidir con SCORES_TOKEN del script
    rankingSize: 10,    // cuántos puestos mostrar al terminar un juego
  },
};
/* ================================================================== */

export const coupleName = CONFIG.nombres.join(' & ');
