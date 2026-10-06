// Contenido de la demo. Fuente de los datos reales: /brand/brand.md (investigación 06-oct-2026).
// Todo lo marcado con `ejemplo: true` o comentado como EJEMPLO es contenido de muestra (NO verificado con el negocio).

export type Lang = 'es' | 'en'
export type T = Record<Lang, string>

export const BIZ = {
  nombre: 'Barbershop A&S',
  direccion: 'Av. José Pardo 620, sótano, tienda #18',
  distrito: 'Miraflores, Lima',
  telefono: '+51 977 556 341',
  telHref: 'tel:+51977556341',
  email: 'alonzotorres51@gmail.com',
  facebook: 'https://www.facebook.com/ASBarbershop/',
  instagram: 'https://www.instagram.com/ays_barbershop_since_1987/',
  maps: 'https://www.google.com/maps/search/?api=1&query=A+%26+S+Barber+Shop%2C+Av.+Jos%C3%A9+Pardo+620%2C+Miraflores%2C+Lima',
  mapsEmbed: 'https://www.google.com/maps?q=-12.118949,-77.035357&z=17&output=embed',
  rating: 4.9, // Google (vía Exa Places, snapshot ~mar-2026) — confirmar en vivo
  reviews: 507,
  fbFollowers: '18 mil', // 18.276 seguidores en Facebook (meta pública)
  desde: 1991, // según el logo oficial — IG dice 1987 y FB "46 años": POR CONFIRMAR
}

export const wa = (lang: Lang, extra = '') => {
  const msg = lang === 'es'
    ? `Hola A&S, quisiera reservar un corte${extra ? ` (${extra})` : ''}. ¿Qué horario tienen disponible?`
    : `Hi A&S, I'd like to book a haircut${extra ? ` (${extra})` : ''}. What times are available?`
  return `https://wa.me/51977556341?text=${encodeURIComponent(msg)}`
}

// Horario (Google). 0 = domingo
export const HORARIO: { d: number[]; label: T; h: string | null }[] = [
  { d: [1], label: { es: 'Lunes', en: 'Monday' }, h: '13:30 – 21:00' },
  { d: [2], label: { es: 'Martes', en: 'Tuesday' }, h: '9:00 – 21:00' },
  { d: [3, 4, 5, 6], label: { es: 'Miércoles a sábado', en: 'Wednesday – Saturday' }, h: '13:30 – 21:00' },
  { d: [0], label: { es: 'Domingo', en: 'Sunday' }, h: null },
]
const RANGOS: Record<number, [number, number] | null> = { 0: null, 1: [13.5, 21], 2: [9, 21], 3: [13.5, 21], 4: [13.5, 21], 5: [13.5, 21], 6: [13.5, 21] }
export function estadoAhora() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Lima', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.find((p) => p.type === 'weekday')!.value)
  const h = Number(parts.find((p) => p.type === 'hour')!.value) % 24 + Number(parts.find((p) => p.type === 'minute')!.value) / 60
  const r = RANGOS[wd]
  return { dia: wd, abierto: !!r && h >= r[0] && h < r[1] }
}

export const NAV: { id: string; label: T }[] = [
  { id: 'oficio', label: { es: 'El oficio', en: 'The craft' } },
  { id: 'servicios', label: { es: 'Servicios', en: 'Services' } },
  { id: 'resenas', label: { es: 'Reseñas', en: 'Reviews' } },
  { id: 'llegar', label: { es: 'Cómo llegar', en: 'Find us' } },
]

export const TXT = {
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  reservar: { es: 'Reservar por WhatsApp', en: 'Book on WhatsApp' },
  reservarCorto: { es: 'Reservar', en: 'Book' },
  loader: { es: 'Afilando la tijera', en: 'Sharpening the shears' },
  heroKicker: { es: 'Barbería clásica · Miraflores', en: 'Classic barbershop · Miraflores' },
  heroTitle1: { es: 'El barbero', en: 'The sculptor' },
  heroTitle2: { es: 'escultor', en: 'barber' },
  heroTitle3: { es: 'de Miraflores', en: 'of Miraflores' },
  heroSub: {
    es: 'Cortes a tijera pensados para la forma de tu rostro. Sin apuro, como se hacía antes — y como se sigue haciendo en el sótano de José Pardo 620.',
    en: 'Scissor cuts designed around the shape of your face. Unhurried, the way it used to be done — and still is, in the basement of José Pardo 620.',
  },
  heroReviews: { es: 'reseñas en Google', en: 'Google reviews' },
  scroll: { es: 'Desliza: el sol se pone, bajamos al sótano', en: 'Scroll: the sun sets, we head downstairs' },
  marquee: {
    es: ['¡Clásica!', 'Corte a tijera', 'Asesoría según tu rostro', 'Desde 1991', 'Miraflores', 'Sótano · Tienda 18'],
    en: ['Classic!', 'Scissor cuts', 'Face-shape consultation', 'Since 1991', 'Miraflores', 'Basement · Shop 18'],
  },
  oficioKicker: { es: 'El oficio', en: 'The craft' },
  oficioTitle: { es: 'Conoce a Alonso, el maestro detrás de la tijera', en: 'Meet Alonso, the master behind the shears' },
  manifiesto: {
    es: 'Antes de tocar la tijera, Alonso mira. Estudia tu rostro, la forma de tu cráneo, cómo cae tu pelo. Luego corta como quien esculpe: con calma, mechón a mechón, hasta que el corte resalta tus rasgos.',
    en: 'Before he picks up the shears, Alonso looks. He studies your face, the shape of your skull, the way your hair falls. Then he cuts like a sculptor: calmly, strand by strand, until the cut brings out your features.',
  },
  oficioP: {
    es: 'Barbería "¡CLÁSICA!", como se presenta en Facebook. Clientes de Miraflores y viajeros de todo el mundo bajan al sótano de José Pardo 620 por el mismo motivo: un corte hecho a la medida, sin prisa.',
    en: 'A "CLASSIC!" barbershop, as it calls itself on Facebook. Locals from Miraflores and travellers from all over the world come down to the basement of José Pardo 620 for the same reason: a made-to-measure cut, without rushing.',
  },
  statDesde: { es: 'año en el logo', en: 'year on the logo' },
  statRating: { es: 'en Google', en: 'on Google' },
  statFb: { es: 'seguidores en Facebook', en: 'Facebook followers' },
  ritualKicker: { es: 'El ritual A&S', en: 'The A&S ritual' },
  ritualTitle: { es: 'Cuatro tiempos, una silla', en: 'Four movements, one chair' },
  serviciosKicker: { es: 'Servicios', en: 'Services' },
  serviciosTitle: { es: 'La carta de la casa', en: 'The house menu' },
  serviciosNota: {
    es: '* Precios y duraciones de EJEMPLO para esta demo: A&S no publica tarifas. Confirmar con el negocio.',
    en: '* EXAMPLE prices and durations for this demo: A&S does not publish rates. To be confirmed with the shop.',
  },
  ejemplo: { es: 'Ejemplo', en: 'Example' },
  porConfirmar: { es: 'Por confirmar', en: 'To be confirmed' },
  resenasKicker: { es: 'Lo que dicen en Google', en: 'What Google reviewers say' },
  resenasTitle: { es: '“Como un escultor”', en: '“Like a sculptor”' },
  resenasFuente: {
    es: 'Reseñas reales de Google (autores no disponibles en la fuente). Cifra según espejo de Google Maps, mar-2026.',
    en: 'Real Google reviews (authors not available in the source). Figure from a Google Maps mirror, Mar-2026.',
  },
  traduccion: { es: 'Traducción libre', en: 'Original' },
  verGoogle: { es: 'Ver en Google Maps', en: 'See on Google Maps' },
  galeriaKicker: { es: 'Galería', en: 'Gallery' },
  galeriaTitle: { es: 'Tijera, peine y paciencia', en: 'Shears, comb and patience' },
  galeriaNota: {
    es: 'Fotos referenciales de Unsplash viradas a la paleta de la marca. En la versión final: fotos reales del Instagram @ays_barbershop_since_1987 (900 publicaciones).',
    en: 'Reference photos from Unsplash, toned to the brand palette. Final version: real photos from Instagram @ays_barbershop_since_1987 (900 posts).',
  },
  llegarKicker: { es: 'Cómo llegar', en: 'How to find us' },
  llegarTitle: { es: 'Baja al sótano. Te esperamos en la tienda 18.', en: 'Head downstairs. We are in shop 18.' },
  horarioTitle: { es: 'Horario', en: 'Opening hours' },
  cerrado: { es: 'Cerrado', en: 'Closed' },
  hoy: { es: 'Hoy', en: 'Today' },
  abiertoAhora: { es: 'Abierto ahora', en: 'Open now' },
  cerradoAhora: { es: 'Cerrado ahora', en: 'Closed now' },
  abrirMaps: { es: 'Abrir en Google Maps', en: 'Open in Google Maps' },
  llamar: { es: 'Llamar', en: 'Call' },
  ctaKicker: { es: 'Tu silla te espera', en: 'Your chair is waiting' },
  ctaTitle1: { es: 'Reserva tu', en: 'Book your' },
  ctaTitle2: { es: 'hora', en: 'time' },
  ctaP: {
    es: 'Escríbenos por WhatsApp, cuéntanos qué buscas y elige tu horario. Te respondemos desde la barbería.',
    en: 'Message us on WhatsApp, tell us what you are after and pick a time. We reply from the shop.',
  },
  footerDemo: {
    es: 'Demo conceptual NO oficial, creada por INKRAAD para presentar una propuesta a Barbershop A&S. Precios, duraciones y fotos son de ejemplo.',
    en: 'UNOFFICIAL concept demo created by INKRAAD as a proposal for Barbershop A&S. Prices, durations and photos are examples.',
  },
  idioma: { es: 'English', en: 'Español' },
}

export const RITUAL: { n: string; t: T; p: T; img: string; alt: T; real: boolean }[] = [
  {
    n: '01',
    t: { es: 'Diagnóstico', en: 'Diagnosis' },
    p: { es: 'Mirar antes de cortar: forma del rostro, del cráneo y del crecimiento del pelo. Te ayuda a elegir el corte que te queda.', en: 'Look before cutting: face shape, skull shape and how your hair grows. He helps you choose the cut that suits you.' },
    img: 'oficio-maestro', alt: { es: 'Barbero de lentes cortando el pelo a un cliente en una barbería antigua (foto de archivo)', en: 'Barber with glasses cutting a client’s hair in an old barbershop (archive photo)' }, real: true,
  },
  {
    n: '02',
    t: { es: 'Tijera, sin apuro', en: 'Shears, unhurried' },
    p: { es: 'Mechón a mechón. Una reseña cuenta que su corte duró cerca de dos horas — y lo dice como un elogio.', en: 'Strand by strand. One review says the cut took about two hours — and means it as praise.' },
    img: 'ritual-tijera', alt: { es: 'Manos de barbero cortando con tijera y peine', en: 'Barber’s hands cutting with shears and comb' }, real: true,
  },
  {
    n: '03',
    t: { es: 'Detalle y acabado', en: 'Detail & finish' },
    p: { es: 'Contornos, nuca y patillas definidos para que el corte “pronuncie” tus rasgos.', en: 'Outlines, neckline and sideburns refined so the cut “pronounces” your features.' },
    img: 'ritual-navaja', alt: { es: 'Barbero perfilando la barba de un cliente con navaja', en: 'Barber shaping a client’s beard with a straight razor' }, real: false,
  },
  {
    n: '04',
    t: { es: 'Para la casa', en: 'For home' },
    p: { es: 'Recomendación de productos para que el corte se mantenga igual de bien hasta tu próxima visita.', en: 'Product recommendations so your cut keeps looking right until your next visit.' },
    img: 'herramientas', alt: { es: 'Tijeras, navaja, peine y máquina sobre fondo naranja', en: 'Shears, razor, comb and clipper on an orange background' }, real: true,
  },
]

// Servicios: los dos primeros y "productos" son reales (brand.md); barba y afeitado NO están confirmados.
// PRECIOS Y DURACIONES: TODOS DE EJEMPLO.
export const SERVICIOS: { t: T; d: T; precio: string; dur: T; real: boolean }[] = [
  { t: { es: 'Corte clásico de caballero', en: 'Classic gentleman’s cut' }, d: { es: 'Corte a tijera con asesoría según la forma de tu rostro y cráneo.', en: 'Scissor cut with advice based on your face and skull shape.' }, precio: 'S/ 60', dur: { es: '60–120 min', en: '60–120 min' }, real: true },
  { t: { es: 'Asesoría de estilo', en: 'Style consultation' }, d: { es: 'Te ayuda a elegir el corte que mejor resalta tus rasgos. Incluida en cada corte.', en: 'Helps you choose the cut that best brings out your features. Included with every cut.' }, precio: 'Incluida', dur: { es: '15 min', en: '15 min' }, real: true },
  { t: { es: 'Recomendación de productos', en: 'Product recommendation' }, d: { es: 'Qué usar en casa para mantener el corte entre visitas.', en: 'What to use at home to keep your cut between visits.' }, precio: '—', dur: { es: 'Al terminar', en: 'After the cut' }, real: true },
  { t: { es: 'Arreglo de barba', en: 'Beard trim' }, d: { es: 'Perfilado y forma de barba y bigote. (Servicio por confirmar con la barbería.)', en: 'Beard and moustache shaping. (Service to be confirmed with the shop.)' }, precio: 'S/ 35', dur: { es: '30 min', en: '30 min' }, real: false },
  { t: { es: 'Afeitado clásico a navaja', en: 'Classic straight-razor shave' }, d: { es: 'Toalla caliente, espuma y navaja. (Servicio por confirmar con la barbería.)', en: 'Hot towel, lather and razor. (Service to be confirmed with the shop.)' }, precio: 'S/ 45', dur: { es: '40 min', en: '40 min' }, real: false },
]

export const RESENAS: { en: string; es: string; meta: T; destacada?: boolean }[] = [
  { en: 'Like a sculptor, he gently makes my style.', es: 'Como un escultor, va dando forma a mi estilo con delicadeza.', meta: { es: 'Google · 5★ · ene 2023', en: 'Google · 5★ · Jan 2023' }, destacada: true },
  { en: 'Alonso is a master of his craft… He ensures that your cut pronounces your facial features.', es: 'Alonso es un maestro de su oficio… Se asegura de que tu corte resalte los rasgos de tu rostro.', meta: { es: 'Google · 5★ · ene 2024', en: 'Google · 5★ · Jan 2024' } },
  { en: 'My favourite barbershop in Lima. The haircut is always spot on!', es: 'Mi barbería favorita en Lima. ¡El corte siempre queda perfecto!', meta: { es: 'Google · 5★ · feb 2026', en: 'Google · 5★ · Feb 2026' } },
  { en: '…they helped me choose a haircut based on the structure of my skull.', es: '…me ayudaron a elegir un corte según la estructura de mi cráneo.', meta: { es: 'Google · 5★ · nov 2025', en: 'Google · 5★ · Nov 2025' } },
]

export const GALERIA: { img: string; alt: T; credito: string; url: string; w: number; h: number }[] = [
  { img: 'salon-archivo', alt: { es: 'Interior de una barbería antigua con sillón y ventanales (archivo NYPL)', en: 'Interior of an old barbershop with chair and windows (NYPL archive)' }, credito: 'The New York Public Library', url: 'https://unsplash.com/photos/0eqUBcAeOtc', w: 1800, h: 1212 },
  { img: 'ritual-tijera', alt: { es: 'Corte con tijera y peine', en: 'Cutting with shears and comb' }, credito: 'Josh Marty', url: 'https://unsplash.com/photos/sdh4g0H-uXg', w: 1800, h: 2700 },
  { img: 'corte-film', alt: { es: 'Barbero cortando el pelo, fotografía en película blanco y negro', en: 'Barber cutting hair, black-and-white film photo' }, credito: 'Quan Jing', url: 'https://unsplash.com/photos/F9MfiGwHI9k', w: 1800, h: 1193 },
  { img: 'estacion', alt: { es: 'Estación de barbero con peines y máquinas', en: 'Barber station with combs and clippers' }, credito: 'Josh Marty', url: 'https://unsplash.com/photos/ciMmm8_xKYo', w: 1800, h: 2700 },
  { img: 'ritual-navaja', alt: { es: 'Afeitado de barba con navaja', en: 'Beard shave with a straight razor' }, credito: 'Antonio Reynoso', url: 'https://unsplash.com/photos/1Ig9rw7aC5g', w: 1800, h: 1200 },
  { img: 'oficio-maestro', alt: { es: 'Barbero veterano de lentes trabajando (archivo NYPL)', en: 'Veteran barber with glasses at work (NYPL archive)' }, credito: 'The New York Public Library', url: 'https://unsplash.com/photos/BQUJyA2C97g', w: 1800, h: 1206 },
]

export const LLEGAR: { n: string; piso: string; t: T; p: T }[] = [
  { n: '01', piso: 'AV', t: { es: 'Av. José Pardo 620', en: 'Av. José Pardo 620' }, p: { es: 'En Miraflores, sobre la avenida José Pardo, número 620.', en: 'In Miraflores, on José Pardo avenue, number 620.' } },
  { n: '02', piso: '1', t: { es: 'Entra al edificio', en: 'Step inside' }, p: { es: 'Ingresa por el número 620: la barbería está dentro, en el nivel inferior.', en: 'Go in at number 620: the barbershop is inside, on the lower level.' } },
  { n: '03', piso: 'S', t: { es: 'Baja al sótano', en: 'Go down to the basement' }, p: { es: 'Toma las escaleras hacia el sótano. Sí, lo bueno está abajo.', en: 'Take the stairs down to the basement. Yes, the good stuff is downstairs.' } },
  { n: '04', piso: '18', t: { es: 'Tienda #18', en: 'Shop #18' }, p: { es: 'Llegaste. Toma asiento: la tijera ya está afilada.', en: 'You made it. Take a seat: the shears are already sharp.' } },
]
