import { lazy, Suspense } from 'react'
import { useLang } from '../lib/i18n'
import { SERVICIOS, TXT, wa } from '../lib/content'
import { useMedia, useReducedMotion } from '../lib/motion'
import { Reveal, SplitReveal, Scissors } from './ui'

const BarberPole = lazy(() => import('./BarberPole'))

export default function Servicios() {
  const { t, lang } = useLang()
  const desktop = useMedia('(min-width: 1024px)')
  const reduced = useReducedMotion()
  return (
    <section id="servicios" className="relative mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40" aria-labelledby="servicios-title">
      <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-20 lg:h-[82vh]">
          <p className="kicker mb-6">{t(TXT.serviciosKicker)}</p>
          <SplitReveal as="h2" id="servicios-title" text={t(TXT.serviciosTitle)} className="display block text-[clamp(2.6rem,5vw,5.4rem)] text-hueso" />
          <div className="relative mt-6 h-[52vh] max-lg:hidden">
            {desktop && !reduced ? (
              <Suspense fallback={<div className="pole-css mx-auto h-full w-16 rounded-full" />}>
                <BarberPole />
              </Suspense>
            ) : (
              <div className="pole-css mx-auto h-full w-16 rounded-full opacity-90" aria-hidden="true" />
            )}
          </div>
          <div className="mt-8 flex items-center gap-4 lg:hidden" aria-hidden="true">
            <div className="pole-css h-40 w-10 rounded-full" />
            <p className="max-w-[16rem] font-mono text-xs uppercase leading-relaxed tracking-[0.16em] text-hueso/60">{lang === 'es' ? 'El poste de barbero, en los colores de la casa.' : 'The barber pole, in the house colours.'}</p>
          </div>
        </div>
        <div>
          <ul className="border-t border-hueso/15">
            {SERVICIOS.map((s, i) => (
              <Reveal key={i} y={30} delay={i * 0.04}>
                <li className="group relative overflow-hidden border-b border-hueso/15">
                  <div className="absolute inset-0 origin-bottom scale-y-0 bg-oxido/60 transition-transform duration-500 ease-[var(--ease-barber)] group-hover:scale-y-100" aria-hidden="true" />
                  <div className="relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 py-7 md:gap-x-8 md:px-4">
                    <span className="font-mono text-sm text-cobre transition-colors group-hover:text-dorado">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="display flex flex-wrap items-center gap-3 text-[clamp(1.6rem,2.6vw,2.6rem)] text-hueso">
                        {t(s.t)}
                        {!s.real && <span className="tag-ejemplo not-italic" style={{ fontStyle: 'normal' }}>{t(TXT.porConfirmar)}</span>}
                      </h3>
                      <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-hueso/70 group-hover:text-hueso/90">{t(s.d)}</p>
                      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-hueso/55">⏱ {t(s.dur)}*</p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-dorado md:text-2xl">{s.precio === 'Incluida' && lang === 'en' ? 'Included' : s.precio}{s.precio.startsWith('S/') ? '*' : ''}</div>
                      {s.precio.startsWith('S/') && <span className="tag-ejemplo mt-2 inline-block">{t(TXT.ejemplo)}</span>}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[0.7rem] leading-relaxed tracking-wide text-hueso/55">{t(TXT.serviciosNota)}</p>
          <Reveal className="mt-12 flex flex-wrap items-center gap-6">
            <a href={wa(lang)} target="_blank" rel="noopener" className="btn-ghost" data-cursor="WhatsApp">{lang === 'es' ? 'Consultar precios por WhatsApp' : 'Ask for prices on WhatsApp'} →</a>
            <Scissors className="h-5 w-16 text-cobre" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
