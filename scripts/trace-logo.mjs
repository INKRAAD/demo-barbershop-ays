// Recrea en SVG vectorial el logo OFICIAL de Barbershop A&S (foto de perfil de Facebook, 943×960).
// 1) scripts/logo-work/masks.py separa las capas crema y óxido del original (sin el fondo de atardecer
//    ni los artefactos de captura) y potrace las vectoriza (ilustración, A, S, tijera y peine).
// 2) Los textos en arco 'BARBERSHOP' y 'DESDE 1991' se recomponen con Courier Prime Bold
//    (slab de máquina de escribir, OFL) letra por letra en la posición y ángulo medidos en el original.
import opentype from 'opentype.js'
import fs from 'node:fs'

const W = './scripts/logo-work/'
const font = (() => {
  const b = fs.readFileSync('node_modules/@fontsource/courier-prime/files/courier-prime-latin-700-normal.woff')
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
})()

const CREAM = '#F9F8EC', RUST = '#662A0B', ESPRESSO = '#1B150B'

// centroides medidos (px del original) — ver README
const TOP = { c: [520.3, 791.4], letters: 'BARBERSHOP', pts: [[272.9,153.7],[324.3,128.3],[377.4,105.1],[431.3,91.1],[484.5,88.2],[542.4,86.0],[595.0,90.8],[651.0,104.0],[707.5,125.8],[758.3,151.2]], cap: 35 }
const BOT = { c: [522.9, 313.2], letters: 'DESDE1991', pts: [[328.3,753.2],[375.1,778.0],[419.0,794.1],[468.6,807.4],[518.1,811.4],[596.0,803.5],[640.5,789.4],[682.8,772.6],[723.2,751.7]], cap: 31 }

const f2 = (n) => (Number.isFinite(n) ? +n.toFixed(2) : 0)
const pathData = (p) => p.commands.map((c) =>
  c.type === 'Z' ? 'Z'
  : c.type === 'Q' ? `Q${f2(c.x1)} ${f2(c.y1)} ${f2(c.x)} ${f2(c.y)}`
  : c.type === 'C' ? `C${f2(c.x1)} ${f2(c.y1)} ${f2(c.x2)} ${f2(c.y2)} ${f2(c.x)} ${f2(c.y)}`
  : `${c.type}${f2(c.x)} ${f2(c.y)}`).join('')

function arcText({ c, letters, pts, cap }, top) {
  const capH = font.charToGlyph('H').getBoundingBox().y2
  const size = (cap / capH) * font.unitsPerEm
  return [...letters].map((ch, i) => {
    const [x, y] = pts[i]
    const phi = Math.atan2(y - c[1], x - c[0]) * 180 / Math.PI
    const rot = top ? phi + 90 : phi - 90
    const p = font.getPath(ch, 0, 0, size)
    const bb = p.getBoundingBox()
    const gx = (bb.x1 + bb.x2) / 2, gy = (bb.y1 + bb.y2) / 2
    return `<path transform="translate(${x} ${y}) rotate(${rot.toFixed(2)}) translate(${(-gx).toFixed(2)} ${(-gy).toFixed(2)})" d="${pathData(p)}"/>`
  }).join('\n    ')
}

const potracePaths = (f) => {
  const s = fs.readFileSync(W + f, 'utf8')
  return [...s.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, ' ')).join(' ')
}
const cream = potracePaths('cream.svg'), rust = potracePaths('rust.svg')
const traced = (d, fill) => `<g transform="scale(0.333333) translate(0 2880) scale(1 -1)" fill="${fill}"><path d="${d}"/></g>`
const text = (fill) => `<g fill="${fill}">\n    ${arcText(TOP, true)}\n    ${arcText(BOT, false)}\n  </g>`

const VB = '40 50 880 820'
const svg = ({ bg, face = RUST, ink = CREAM, title = 'Barbershop A&amp;S — Desde 1991' }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${title}">
  <title>${title}</title>${bg ? `\n  <rect x="40" y="50" width="880" height="820" fill="${bg}"/>` : ''}
  ${face ? traced(rust, face) : ''}
  ${traced(cream, ink)}
  ${text(ink)}
</svg>
`
const out = [
  ['ays-logo.svg', svg({})],                                   // color, fondo transparente (para fondos oscuros)
  ['ays-logo-fondo.svg', svg({ bg: ESPRESSO })],               // color sobre espresso
  ['ays-logo-crema.svg', svg({ face: null })],                 // monocromo crema (stencil)
  ['ays-logo-espresso.svg', svg({ face: null, ink: ESPRESSO })], // monocromo oscuro (para fondos claros)
]
for (const [f, s] of out) {
  fs.writeFileSync('public/brand/' + f, s)
  fs.writeFileSync('../brand/' + f, s)
}
console.log('ok', out.map(([f, s]) => `${f} ${(s.length / 1024).toFixed(1)}kB`).join(', '))
