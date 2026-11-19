/* ==================================================================
   EDITA AQUÍ TUS DATOS
   Todo el contenido de la invitación sale de este objeto.
   ================================================================== */
export const CONFIG = {
  nombres: ['Mely', 'Richar'],
  ciudad: 'Cartagena de Indias',
  // Inicio de la boda (ceremonia civil). Con desfase de Colombia (-05:00) para que la
  // cuenta regresiva sea correcta aunque el invitado esté en otra zona horaria.
  fecha: '2026-12-19T11:00:00-05:00',
  fin: '2026-12-20T17:00:00-05:00',       // regreso a Cartagena del Día 2
  playlist: 'https://open.spotify.com/playlist/1ykF5w4hW8sWIJxIJ8FhoZ',  // playlist de Spotify "Boda Meli y Richi"
  perro: 'Tesla',
  portada: 'img/couple.svg',              // ilustración de portada; cámbiala por img/portada.jpg/.png si tienes arte final

  // Lugares (se usan en Itinerario e Información)
  lugares: {
    notaria: { nombre: 'Notaría 7 de Cartagena', detalle: 'Ceremonia civil · 11:00 AM', mapa: 'https://www.google.com/maps/search/?api=1&query=Notar%C3%ADa+7+de+Cartagena' },
    muelle: { nombre: 'Muelle La Bodeguita', detalle: 'Traslado a Tierra Bomba', mapa: 'https://www.google.com/maps/search/?api=1&query=Muelle+La+Bodeguita+Cartagena' },
    fenix: { nombre: 'Fénix Beach Club', detalle: 'Recepción · Tierra Bomba', mapa: 'https://www.google.com/maps?q=place_id:ChIJ3Sx6WNUo9o4RgrpHElrzJrU' },
    nautico: { nombre: 'Club Náutico', detalle: 'Boat Day · salida del catamarán', mapa: 'https://www.google.com/maps?q=place_id:ChIJb8CLp9ZDYw0RQl_1sv6Wb30' },
  },

  // Itinerario por día. lugar = clave de `lugares` (muestra "Ver mapa"); link = enlace interno.
  dias: [
    {
      titulo: 'Día 1',
      fecha: 'Sábado 19 de diciembre',
      corto: 'Sáb 19',
      dia: '2026-12-19',
      eventos: [
        { icono: '💍', hora: '11:00 AM', titulo: 'Ceremonia civil', detalle: 'En la Notaría 7 de Cartagena.', lugar: 'notaria' },
        { icono: '📸', hora: '12:00 M', titulo: 'Sesión de fotos y paseo por el Centro Histórico', detalle: 'Recorreremos juntos las calles del Centro Histórico de Cartagena capturando los primeros recuerdos de nuestro nuevo capítulo.' },
        { icono: '🍔', hora: '12:30 PM', titulo: 'Almuerzo: Mac Wedding', detalle: 'Un almuerzo delicioso y divertido para celebrar juntos.' },
        { icono: '🚤', hora: '5:00 PM', titulo: 'Traslado hacia Tierra Bomba', detalle: 'Nos encontraremos en el Muelle La Bodeguita.', lugar: 'muelle' },
        { icono: '🍹', hora: '5:30 PM', titulo: 'Llegada a Fénix Beach Club', detalle: 'Welcome drink frente al mar.', lugar: 'fenix' },
        { icono: '🍽️', hora: '7:30 PM', titulo: 'Cena y celebración', detalle: 'Disfrutaremos una cena a la carta, bebidas suaves y postre.', link: ['#carta', 'Elige tu plato →'] },
        { icono: '🌙', hora: '11:00 PM', titulo: 'Regreso a Cartagena' },
      ],
    },
    {
      titulo: 'Día 2',
      fecha: 'Domingo 20 de diciembre',
      corto: 'Dom 20',
      dia: '2026-12-20',
      eventos: [
        { icono: '⛵', hora: '8:30 AM', titulo: 'Salida en catamarán', detalle: 'Desde el Club Náutico.', lugar: 'nautico' },
        { icono: '🏝️', hora: '10:30 AM', titulo: 'Parada en Islas del Rosario', detalle: 'Tiempo para nadar y relajarse.' },
        { icono: '🏊', hora: '11:30 AM', titulo: 'Parada en La Piscinita', detalle: 'Un lugar donde el mar se vuelve tranquilo. Perfecto para disfrutar el paisaje y compartir.' },
        { icono: '🥂', hora: '12:30 PM', titulo: 'Almuerzo a bordo', detalle: 'Un momento para brindar, saborear y celebrar juntos.' },
        { icono: '🏖️', hora: '2:00 PM', titulo: 'Parada en Playa Blanca', detalle: 'Tiempo libre para disfrutar la playa, caminar por la arena y seguir creando recuerdos inolvidables.' },
        { icono: '🌅', hora: '5:00 PM', titulo: 'Regreso a Cartagena', detalle: 'Cerramos este fin de semana con el corazón lleno de alegría, recuerdos hermosos y el inicio de nuestro para siempre.' },
      ],
    },
  ],

  // Menú de la cena del Día 1 (Fénix Beach Club). Solo platos incluidos, sin costo adicional.
  menu: {
    whatsapp: '573105902167',   // con indicativo, solo dígitos (el de confirmación de la invitación de Canva); '' = sin botón
    // [nombre, descripción, emojis (máx. 3)] · 🌿 = vegetariano · 🥥 arroz con coco · 🍌 patacón/plátano
    principales: [
      ['Pasta Alfredo con Pollo', 'Pasta en salsa Alfredo con pollo.', '🍝🍗'],
      ['Tacos de Camarones', 'Camarones al ajillo, mojo de cebolla roja y alioli.', '🌮🦐'],
      ['Pasta de Mar', 'Salsa cremosa y atomatada con mix de mariscos.', '🍝🦐🐙'],
      ['Tacos de Pescado Blanco', 'Pescado apanado, repollo encurtido, cilantro y alioli.', '🌮🐟'],
      ['Paella de la Huerta', 'Preparación de arroz con vegetales.', '🥘🥦🌿'],
      ['Poke de Salmón', 'Salmón, arroz, aguacate, mango, pepino, lechugas y aderezo de yogur.', '🥗🐟🥭'],
      ['Pescado Isleño Entero', 'Acompañado de arroz con coco, patacones y ensalada.', '🐟🥥🍌'],
      ['Poke Costeño', 'Camarón apanado, arroz de coco, aguacate, tomate, cebolla, lechuga, chips de plátano y suero.', '🥗🦐🥥'],
      ['Filete de Corvina', 'A la sartén, con sabores cítricos; acompañado de arroz con coco y yuca con mojo.', '🐟🍋🥥'],
      ['Poke de Quinua', 'Quinua, aguacate, cebolla encurtida, zanahoria, pepino, coliflor, lechugas y aderezo ponzu.', '🥗🥑🌿'],
      ['Posta Negra Cartagenera', 'Tradicional preparación de posta de res con arroz con coco y plátano en tentación.', '🥩🥥🍌'],
      ['Poke Acevichado', 'Corvina, salsa acevichada, arroz, aguacate, maíz crocante, mango y chips de plátano.', '🥗🐟🌽'],
      ['Sancocho de Pescado', 'Al estilo de la isla, con posta de sierra local.', '🍲🐟'],
      ['Pizza Margarita', 'Pizza de estilo clásico.', '🍕🍅🌿'],
      ['Pollo con Salsa Criolla', 'Acompañado de arroz con coco y patacón.', '🍗🥥🍌'],
      ['Pizza Cuatro Quesos', 'Mozzarella, búfala, queso azul, brie y salsa napolitana.', '🍕🧀🌿'],
      ['Hamburguesa Vegana', 'Mezcla de vegetales, proteínas y granos.', '🍔🌿'],
      ['Pizza Hawaiana', 'Jamón, mozzarella, salsa napolitana y piña.', '🍕🍍'],
      ['Hamburguesa de Pescado', 'Robalo al grill con coleslaw de repollo morado y bastones de yuca.', '🍔🐟'],
      ['Uramaki de Salmón', 'Salmón, arroz, alga nori, queso crema, aguacate, masago y ajonjolí.', '🍣🐟🥑'],
      ['Hamburguesa Fénix', 'Carne de res con verduras y salsas de la casa, acompañada de papas rústicas.', '🍔🥩🍟'],
      ['Tempura Roll', 'Corvina, arroz, alga nori, queso crema, aguacate, camarón, mayonesa y sriracha.', '🍣🦐'],
      ['Tacos de Pollo', 'Pollo a la parrilla, piña asada, guacamole y mojo de cebolla blanca.', '🌮🍗🍍'],
      ['Camarón Sweet', 'Camarón, arroz, alga nori, plátano amarillo, kanikama y sweet chili.', '🍣🦐🍌'],
    ],
    // [nombre, nota, emojis]
    postres: [
      ['Arroz con Leche de la Abuela', '', '🍚🥛'],
      ['Cremoso Frío de Limón', '', '🍋🍮'],
      ['Flan de Coco', '', '🍮🥥'],
      ['Torta de Chocolate', '', '🍫🍰'],
      ['Copa de Helado', 'Vainilla o vegano.', '🍨🌿'],
      ['Helado de Pistacho', '', '🍨🥜'],
    ],
  },

  // q = pregunta, o = opciones, a = índice de la respuesta correcta
  trivia: [
    { q: '¿Dónde se conocieron Mely y Richar?', o: ['En la playa', 'En la universidad', 'En una fiesta'], a: 1 },
    { q: '¿Cómo se llama nuestro perrito?', o: ['Tesla', 'Edison', 'Newton'], a: 0 },
    { q: '¿Quién dijo "te quiero" primero?', o: ['Mely', 'Richar', 'Los dos a la vez'], a: 1 },
    { q: '¿Cuál es nuestro plan favorito?', o: ['Ir al cine', 'Viajar', 'Cocinar en casa'], a: 1 },
  ],
  // Trivia Marina: banco de preguntas; cada partida toma 10 al azar y baraja preguntas y opciones
  // (ver `pick` en views/index.js). Puedes agregar más: q = pregunta, o = opciones, a = índice correcto.
  marina: [
    { q: '¿Cuántos corazones tiene un pulpo?', o: ['1', '3', '8'], a: 1 },
    { q: '¿Cuántos brazos tiene un pulpo?', o: ['6', '8', '10'], a: 1 },
    { q: '¿De qué color es la sangre del pulpo?', o: ['Roja', 'Verde', 'Azul'], a: 2 },
    { q: '¿Cuál es el mamífero más grande del mar?', o: ['Tiburón ballena', 'Ballena azul', 'Orca'], a: 1 },
    { q: '¿Qué animal marino duerme con medio cerebro despierto?', o: ['Delfín', 'Tortuga', 'Pez globo'], a: 0 },
    { q: 'En los caballitos de mar, ¿quién lleva a las crías en su bolsa?', o: ['La hembra', 'El macho', 'Los dos por turnos'], a: 1 },
    { q: 'El coral es…', o: ['Una planta', 'Una roca', 'Un animal'], a: 2 },
    { q: '¿Qué pueden regenerar las estrellas de mar?', o: ['Sus brazos', 'Sus ojos', 'Nada'], a: 0 },
    { q: '¿Qué mar baña las costas de Cartagena?', o: ['Mar Caribe', 'Océano Pacífico', 'Mar Mediterráneo'], a: 0 },
    { q: '¿Qué parque nacional protege los arrecifes de las Islas del Rosario?', o: ['Tayrona', 'Corales del Rosario y San Bernardo', 'Isla Gorgona'], a: 1 },
    { q: '¿Cuál es el pez más grande del mundo?', o: ['Tiburón blanco', 'Tiburón ballena', 'Pez luna'], a: 1 },
    { q: '¿Cuál es el océano más grande del planeta?', o: ['Atlántico', 'Índico', 'Pacífico'], a: 2 },
    { q: '¿Qué parte de la Tierra está cubierta por océanos?', o: ['Cerca del 30 %', 'Cerca del 50 %', 'Cerca del 70 %'], a: 2 },
    { q: '¿Con qué respiran los peces?', o: ['Con pulmones', 'Con branquias', 'Por la piel'], a: 1 },
    { q: '¿Qué pez vive entre los tentáculos de las anémonas?', o: ['Pez payaso', 'Pez globo', 'Pez espada'], a: 0 },
    { q: '¿Qué usan los delfines para orientarse y cazar?', o: ['El olfato', 'La ecolocalización', 'Las estrellas'], a: 1 },
    { q: 'Las ballenas son…', o: ['Peces', 'Mamíferos', 'Reptiles'], a: 1 },
    { q: '¿Qué come principalmente la ballena azul?', o: ['Krill', 'Tiburones', 'Algas'], a: 0 },
    { q: '¿De qué está hecho el esqueleto de los tiburones?', o: ['Hueso', 'Cartílago', 'Coral'], a: 1 },
    { q: '¿Qué animal marino no tiene cerebro?', o: ['La medusa', 'El pulpo', 'El delfín'], a: 0 },
    { q: '¿Qué animal marino es famoso por cambiar de color para camuflarse?', o: ['El pulpo', 'La tortuga', 'El tiburón'], a: 0 },
    { q: '¿Cuántos brazos tiene normalmente una estrella de mar?', o: ['3', '5', '8'], a: 1 },
    { q: '¿Qué pez invasor amenaza los arrecifes del Caribe?', o: ['Pez león', 'Pez payaso', 'Mero'], a: 0 },
    { q: '¿Qué come el manatí, que también vive en el Caribe colombiano?', o: ['Peces', 'Plantas acuáticas', 'Cangrejos'], a: 1 },
    { q: '¿Qué tortuga marina es la más grande del mundo?', o: ['Tortuga laúd', 'Tortuga carey', 'Tortuga verde'], a: 0 },
    { q: '¿Cuánto puede vivir una tortuga marina?', o: ['Unos 5 años', 'Unos 15 años', 'Más de 50 años'], a: 2 },
    { q: '¿Qué ave se lanza en picada al mar para pescar en la bahía de Cartagena?', o: ['El pelícano', 'El flamenco', 'El colibrí'], a: 0 },
    { q: 'El caballito de mar es un…', o: ['Pez', 'Mamífero', 'Crustáceo'], a: 0 },
    { q: '¿Qué es el plancton?', o: ['Arena del fondo', 'Organismos diminutos que flotan', 'Un tipo de coral'], a: 1 },
    { q: '¿Qué animal marino es conocido como "inmortal"?', o: ['Una medusa', 'Una tortuga', 'Una ballena'], a: 0 },
    { q: '¿Cuál es considerado el pez más rápido del océano?', o: ['El pez vela', 'El pez payaso', 'El caballito de mar'], a: 0 },
    { q: '¿A qué departamento pertenecen las Islas del Rosario?', o: ['Magdalena', 'Bolívar', 'Sucre'], a: 1 },
  ],

  bingo: ['Foto con los novios', 'Alguien llora', 'Baile de papás', 'Brindis', 'Foto con Tesla',
    'Lanzan el ramo', 'Selfie grupal', 'Canción de playa', 'Abrazo a los novios'],

  intro: 'Después de tantos momentos juntos, llegó el día de decir “sí”. Queremos celebrarlo contigo en un fin de semana lleno de amor, sol y mar.',

  // Dress code por día
  vestimenta: [
    { dia: 'Día 1 · Sábado 19', estilo: 'White Party', tip: 'Look fresco, cómodo y acorde al ambiente playero.' },
    { dia: 'Día 2 · Domingo 20', estilo: 'Boat Day', tip: 'Look fresco y relajado. Lleva vestido de baño.' },
  ],

  // Confirmación de asistencia por WhatsApp
  rsvp: {
    whatsapp: '573105902167',
    mensaje: 'Hola, soy ________ y confirmo mi asistencia a su boda.',
  },

  // Planifica tu viaje: [título, texto, [[nombre, url], ...]]
  viaje: [
    ['✈️ Buscar vuelos', 'Las mejores opciones de vuelo hacia Cartagena (CTG).',
      [['Google Flights', 'https://www.google.com/travel/flights?gl=CO&hl=es'], ['Kayak', 'https://www.kayak.com.co/flights'], ['Skyscanner', 'https://www.skyscanner.com.co']]],
    ['🏨 Buscar alojamiento', 'Hoteles o apartamentos según tu presupuesto.',
      [['Airbnb', 'https://www.airbnb.com.co'], ['Booking', 'https://www.booking.com/index.es.html']]],
    ['🗺️ Explora Cartagena', 'Restaurantes, tours y actividades.',
      [['Tripadvisor', 'https://www.tripadvisor.co'], ['Civitatis', 'https://www.civitatis.com/es/']]],
  ],

  // Nuestra historia (un párrafo por elemento)
  historia: [
    'Nuestra historia no comenzó con un gran momento planeado, sino de la manera más bonita: con dos vidas que se encontraron en el momento justo y, casi sin darse cuenta, empezaron a convertirse en un hogar la una para la otra.',
    'Desde entonces, hemos crecido juntos, aprendiendo a apoyarnos en los momentos difíciles, a celebrar cada logro y a descubrir que el amor vive en los detalles más simples: una risa compartida, un desayuno sorpresa, los sueños planeados en voz baja y la tranquilidad de saber que siempre estamos el uno para el otro.',
    'Con el tiempo construimos algo que siempre soñamos: un hogar lleno de amor, complicidad y sueños, junto a nuestro perrito, que también hace parte de esta historia.',
    'Richar, con su dulzura, responsabilidad y forma tranquila de cuidar, se convirtió en el lugar seguro. Mely, con su creatividad, sensibilidad y alegría, es el corazón soñador que impulsa cada aventura.',
    'Y juntos encontramos el equilibrio perfecto: un amor que no solo se dice, sino que se demuestra todos los días.',
    'Hoy, después de tantos años eligiéndonos una y otra vez, damos un paso más en nuestra historia… y queremos celebrarlo rodeados de las personas que más queremos.',
  ],

  faq: [
    ['¿Puedo llevar acompañante?', 'Solo las personas indicadas en tu invitación.'],
    ['¿Se permiten niños?', 'Escríbenos y lo coordinamos.'],
  ],

  // Álbum compartido. Mientras `subir` esté vacío se muestra "Muy pronto".
  // Puede ser una carpeta de Drive (con permiso de edición), un álbum compartido de Google Fotos
  // o un Google Form con carga de archivos (ver TODO.md: "Álbum: elegir proveedor").
  album: {
    subir: '',   // link donde los invitados suben sus fotos y videos
    ver: '',     // link para ver el álbum (puede ser el mismo)
    nota: '',    // aviso opcional bajo el botón, p. ej. 'Necesitas una cuenta de Google'
  },

  // Google Sheets (ver google-scripts/README.md): ranking de juegos Y elecciones del menú.
  // Con endpoint vacío todo se guarda solo en el dispositivo.
  scores: {
    endpoint: 'https://script.google.com/macros/s/AKfycbydm0rwwnSBa83FvErwo4ERHV78x_r5_GVwegC4d52PbhZh4r4yA3wVchQ_6-z5NUDrkg/exec',   // URL ".../exec" del Web App de Apps Script
    token: '',         // opcional: debe coincidir con SCORES_TOKEN del script
    rankingSize: 10,    // cuántos puestos mostrar al terminar un juego
  },
};
/* ================================================================== */

export const coupleName = CONFIG.nombres.join(' & ');
