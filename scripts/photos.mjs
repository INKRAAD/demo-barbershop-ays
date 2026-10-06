// Optimiza las fotos de Unsplash (licencia Unsplash) descargadas en /tmp a WebP en public/img.
import sharp from 'sharp'
const list = [
  ['1759408174379-58ebeeab4217', 'oficio-maestro'],     // NYPL — barbero con lentes (archivo)
  ['1759408174071-f2971472dc73', 'salon-archivo'],      // NYPL — interior de barbería (archivo)
  ['1761931403671-d020a14928d9', 'ritual-tijera'],      // Josh Marty — tijera y peine
  ['1761148438883-e34e0289a214', 'ritual-navaja'],      // Antonio Reynoso — navaja
  ['1596362601603-b74f6ef166e4', 'herramientas'],       // Sinval Carvalho — flatlay
  ['1675342656322-80aeeb53ae4a', 'corte-film'],         // Quan Jing — film B/N
  ['1761931403807-f33fc582b1f5', 'estacion'],           // Josh Marty — estación
]
for (const [id, name] of list) {
  for (const w of [1600, 800]) {
    await sharp(`/tmp/u-${id}.jpg`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(`public/img/${name}-${w}.webp`)
  }
}
console.log('ok')
