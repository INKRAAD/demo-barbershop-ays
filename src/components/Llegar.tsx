// "Baja al sótano": storytelling de cómo llegar. Un dial de ascensor vintage marca AV → 1 → S → 18 mientras bajas.
import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lib/i18n'
import { BIZ, HORARIO, LLEGAR, TXT, estadoAhora } from '../lib/content'
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion'
import { Reveal, SplitReveal } from './ui'

const ANG = [-66, -22, 22, 66]

function Dial({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 320 200" className="w-full max-w-[420px]" role="img" aria-label={`Indicador de piso: ${LLEGAR[active].piso}`}>
      <defs>
        <radialGradient id="dialbg" cx="0.5" cy="0.9" r="0.9"><stop offset="0" stopColor="#3A2812" /><stop offset="1" stopColor="#1B150B" /></radialGradient>
      </defs>
      <path d="M20 180 A140 140 0 0 1 300 180 Z" fill="url(#dialbg)" stroke="#A16C30" strokeWidth="2" />
      <path d="M38 180 A122 122 0 0 1 282 180" fill="none" stroke="#A16C30" strokeOpacity="0.4" strokeDasharray="2 6" />
      {LLEGAR.map((s, i) => {
        const a = (ANG[i] - 90) * (Math.PI / 180)
        const x = 160 + Math.cos(a) * 104, y = 180 + Math.sin(a) * 104
        return <text key={s.piso} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontFamily="Courier Prime, monospace" fontWeight="700" fontSize={i === active ? 24 : 18} fill={i === active ? '#DDBF6A' : '#F9F8EC'} fillOpacity={i === active ? 1 : 0.45} style={{ transition: 'all .5s' }}>{s.piso}</text>
      })}
      <g style={{ transform: `rotate(${ANG[active]}deg)`, transformOrigin: '160px 180px', transition: 'transform 1.1s cubic-bezier(.34,1.56,.64,1)' }}>
        <path d="M157 180 L160 92 L163 180 Z" fill="#DDBF6A" />
      </g>
      <circle cx="160" cy="180" r="12" fill="#A16C30" stroke="#DDBF6A" strokeWidth="2" />
    </svg>
  )
}

export default function Llegar() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const ahora = estadoAhora()
  useEffect(() => {
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      q('.ll-step').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && setActive(i) })
      })
      if (!prefersReduced()) {
        const path = q('.ll-path')[0] as unknown as SVGPathElement | undefined
        if (path) {
          const len = path.getTotalLength()
          gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: q('.ll-steps')[0], start: 'top 60%', end: 'bottom 60%', scrub: true } })
        }
      }
    }, root)
    return () => ctx.revert()
  }, [lang])

  return (
    <section id="llegar" ref={root} className="relative bg-gradient-to-b from-espresso via-tabaco/30 to-espresso py-28 md:py-40" aria-labelledby="llegar-title">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="kicker mb-6">{t(TXT.llegarKicker)}</p>
        <SplitReveal as="h2" id="llegar-title" text={t(TXT.llegarTitle)} className="display block max-w-5xl text-[clamp(2.6rem,5.6vw,6.2rem)] text-hueso" />

        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="lg:sticky lg:top-[18vh] lg:h-[64vh]">
            <Dial active={active} />
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-hueso/70" aria-live="polite">
              <span className="text-dorado">{LLEGAR[active].n}</span> · {t(LLEGAR[active].t)}
            </p>
            <address className="mt-10 not-italic">
              <div className="display text-3xl text-hueso md:text-4xl">{BIZ.direccion}</div>
              <div className="mt-2 font-mono text-sm uppercase tracking-[0.18em] text-hueso/60">{BIZ.distrito}</div>
            </address>
          </div>
          <div className="ll-steps relative">
            <svg className="pointer-events-none absolute -left-6 top-0 hidden h-full w-10 md:block" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
              <path className="ll-path" d="M20 0 V200 H32 V320 H8 V440 H32 V560 H8 V680 H32 V800 H20 V1000" fill="none" stroke="#DDBF6A" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            {LLEGAR.map((s, i) => (
              <div key={s.n} className={`ll-step flex min-h-[44vh] flex-col justify-center border-l border-hueso/10 pl-8 transition-opacity duration-500 md:pl-12 ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                <span className="font-mono text-sm font-bold text-dorado">{s.n} — {lang === 'es' ? 'Piso' : 'Floor'} {s.piso}</span>
                <h3 className="display mt-3 text-[clamp(2rem,3.6vw,3.6rem)] text-hueso">{t(s.t)}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-hueso/75">{t(s.p)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-hueso/10 bg-tabaco">
            <iframe title={lang === 'es' ? 'Mapa: Barbershop A&S, Av. José Pardo 620, Miraflores' : 'Map: Barbershop A&S, Av. José Pardo 620, Miraflores'} src={BIZ.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.6)_saturate(0.7)_brightness(0.8)_contrast(1.1)]" />
          </Reveal>
          <Reveal className="flex flex-col justify-between gap-8 rounded-[28px] bg-hueso p-8 text-espresso md:p-10">
            <div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="display text-4xl">{t(TXT.horarioTitle)}</h3>
                <span className={`rounded-full px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.14em] ${ahora.abierto ? 'bg-espresso text-dorado' : 'bg-oxido/15 text-oxido'}`}>
                  ● {ahora.abierto ? t(TXT.abiertoAhora) : t(TXT.cerradoAhora)}
                </span>
              </div>
              <dl className="mt-6 divide-y divide-espresso/10 font-mono text-sm">
                {HORARIO.map((h) => {
                  const hoy = h.d.includes(ahora.dia)
                  return (
                    <div key={h.label.es} className={`flex justify-between gap-4 py-3 ${hoy ? 'font-bold text-oxido' : ''}`}>
                      <dt>{t(h.label)}{hoy && <span className="ml-2 text-[0.65rem] uppercase tracking-[0.14em]">· {t(TXT.hoy)}</span>}</dt>
                      <dd>{h.h ?? t(TXT.cerrado)}</dd>
                    </div>
                  )
                })}
              </dl>
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-espresso/50">{lang === 'es' ? 'Fuente: ficha de Google' : 'Source: Google listing'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={BIZ.maps} target="_blank" rel="noopener" className="btn-primary !bg-espresso !text-hueso hover:!bg-oxido">{t(TXT.abrirMaps)} ↗</a>
              <a href={BIZ.telHref} className="btn-ghost !border-espresso/30 !text-espresso hover:!bg-espresso hover:!text-hueso">{t(TXT.llamar)} {BIZ.telefono}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
