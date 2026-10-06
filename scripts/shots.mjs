// Capturas con Chromium headless (playwright-core + Google Chrome del sistema) y chequeo de errores de consola.
// Uso: URL=http://localhost:4318/ node scripts/shots.mjs [desktop|mobile|all]
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import sharp from 'sharp'

const URL = process.env.URL ?? 'http://localhost:4318/'
const OUT = new globalThis.URL('../screenshots/', import.meta.url).pathname
fs.mkdirSync(OUT, { recursive: true })
const what = process.argv[2] ?? 'all'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--no-sandbox'],
})
const errors = []

// Recorre la página para disparar los reveals (once) y luego captura por bloques y une con sharp.
async function walk(page) {
  const H = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = await page.evaluate(() => innerHeight)
  for (let y = 0; y < H; y += Math.round(vh * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(260)
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await sleep(1200)
}
async function stitchFull(page, outPath) {
  const { H, W, dpr, vh } = await page.evaluate(() => ({ H: document.documentElement.scrollHeight, W: document.documentElement.clientWidth, dpr: devicePixelRatio, vh: innerHeight }))
  const tiles = []
  for (let y = 0; y < H; y += vh) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await sleep(900)
    const real = await page.evaluate(() => scrollY)
    const buf = await page.screenshot({ type: 'png' })
    tiles.push({ input: buf, top: Math.round(real * dpr), left: 0 })
  }
  await sharp({ create: { width: Math.round(W * dpr), height: Math.round(H * dpr), channels: 4, background: '#1B150B' } })
    .composite(tiles).png({ compressionLevel: 9 }).toFile(outPath)
  // versión liviana para el README
  await sharp(outPath).resize({ width: Math.min(1000, Math.round(W * dpr)) }).jpeg({ quality: 78 }).toFile(outPath.replace('.png', '.jpg'))
}

async function run(name, viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: opts.dpr ?? 1, isMobile: !!opts.mobile, hasTouch: !!opts.mobile, reducedMotion: opts.reduced ? 'reduce' : 'no-preference' })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${name}] console: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`[${name}] pageerror: ${e.message}`))
  page.on('requestfailed', (r) => { if (!r.url().includes('google.com/maps')) errors.push(`[${name}] requestfailed: ${r.url()} ${r.failure()?.errorText}`) })
  await page.goto(URL + (opts.query ?? ''), { waitUntil: 'networkidle' })
  if (opts.preloader) { await sleep(1300); await page.screenshot({ path: `${OUT}preloader-${name}.png` }) }
  await sleep(4200)
  await page.screenshot({ path: `${OUT}${name}-hero.png` })
  if (opts.full) {
    await walk(page)
    // Lenis/ScrollTrigger: desactivar animación de scroll suave para que scrollTo sea inmediato
    await stitchFull(page, `${OUT}${name}-full.png`)
  }
  if (opts.extra) await opts.extra(page, name)
  await ctx.close()
}

if (what === 'desktop' || what === 'all') {
  await run('desktop-1440', { width: 1440, height: 900 }, { full: true, preloader: true,
    extra: async (page, name) => {
      for (const id of ['oficio', 'servicios', 'resenas', 'llegar', 'reserva']) {
        await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id)
        await sleep(1600)
        await page.screenshot({ path: `${OUT}${name}-${id}.png` })
      }
      // ritual (scroll horizontal fijado): a mitad del recorrido
      await page.evaluate(() => { const el = document.querySelector('#oficio').nextElementSibling; window.scrollTo(0, el.getBoundingClientRect().top + scrollY + innerHeight * 1.2) })
      await sleep(1600)
      await page.screenshot({ path: `${OUT}${name}-ritual.png` })
    } })
}
if (what === 'mobile' || what === 'all') {
  await run('mobile-390', { width: 390, height: 844 }, { full: true, dpr: 2, mobile: true, preloader: true,
    extra: async (page, name) => {
      await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800)
      await page.click('button[aria-controls="menu-movil"]'); await sleep(1200)
      await page.screenshot({ path: `${OUT}${name}-menu.png` })
    } })
}
if (what === 'en') {
  await run('desktop-1440-en', { width: 1440, height: 900 }, { query: '?lang=en' })
}
if (what === 'reduced') {
  await run('desktop-1440-reduced', { width: 1440, height: 900 }, { reduced: true })
}
await browser.close()
fs.writeFileSync(OUT + 'console-errors.txt', errors.join('\n') || 'Sin errores de consola')
console.log(errors.length ? errors.join('\n') : 'Sin errores de consola')
