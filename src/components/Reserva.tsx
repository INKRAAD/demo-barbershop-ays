// CTA final: arma el mensaje de WhatsApp eligiendo servicio y día (sin backend). Un "sol" sigue al cursor.
import { useRef, useState } from 'react'
import { useLang } from '../lib/i18n'
import { BIZ, SERVICIOS, TXT, wa } from '../lib/content'
import { Magnetic, SplitReveal, WaIcon } from './ui'

export default function Reserva() {
  const { t, lang } = useLang()
  const [srv, setSrv] = useState(0)
  const [dia, setDia] = useState(0)
  const glow = useRef<HTMLDivElement>(null)
  const dias = lang === 'es' ? ['Lo antes posible', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] : ['As soon as possible', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const extra = `${SERVICIOS[srv].t[lang]} · ${dias[dia]}`
  const move = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    glow.current?.style.setProperty('transform', `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%,-50%)`)
  }
  return (
    <section id="reserva" onPointerMove={move} className="relative overflow-hidden border-t border-hueso/10 py-28 md:py-44" aria-labelledby="reserva-title">
      <div ref={glow} className="pointer-events-none absolute left-0 top-0 h-[60vmax] w-[60vmax] rounded-full opacity-40 blur-3xl transition-transform duration-700 ease-out" style={{ background: 'radial-gradient(circle, #DDBF6A 0%, #A16C30 30%, transparent 65%)', transform: 'translate(50vw, 40%) translate(-50%,-50%)' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="kicker mb-8">{t(TXT.ctaKicker)}</p>
        <h2 id="reserva-title" className="display text-[clamp(3.6rem,13vw,15rem)] leading-[0.85] text-hueso" aria-label={`${t(TXT.ctaTitle1)} ${t(TXT.ctaTitle2)}`}>
          <SplitReveal text={t(TXT.ctaTitle1)} className="block" />
          <SplitReveal text={t(TXT.ctaTitle2)} className="block pl-[12vw] text-dorado" delay={0.1} />
        </h2>
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <p className="max-w-md text-lg leading-relaxed text-hueso/80">{t(TXT.ctaP)}</p>
          <div className="space-y-7 rounded-[28px] border border-hueso/15 bg-espresso/70 p-6 backdrop-blur md:p-8">
            <fieldset>
              <legend className="mb-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-hueso/60">{lang === 'es' ? '1 · Servicio' : '1 · Service'}</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICIOS.filter((s) => s.precio.startsWith('S/')).map((s) => {
                  const i = SERVICIOS.indexOf(s)
                  return (
                    <button key={i} type="button" onClick={() => setSrv(i)} aria-pressed={srv === i}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${srv === i ? 'border-dorado bg-dorado text-espresso' : 'border-hueso/25 text-hueso/85 hover:border-dorado'}`}>
                      {t(s.t)}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-hueso/60">{lang === 'es' ? '2 · Día preferido' : '2 · Preferred day'}</legend>
              <div className="flex flex-wrap gap-2">
                {dias.map((d, i) => (
                  <button key={d} type="button" onClick={() => setDia(i)} aria-pressed={dia === i}
                    className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${dia === i ? 'border-dorado bg-dorado text-espresso' : 'border-hueso/25 text-hueso/85 hover:border-dorado'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Magnetic strength={0.4}>
                <a href={wa(lang, extra)} target="_blank" rel="noopener" className="btn-primary !px-7 !py-5 !text-base" data-cursor="WhatsApp"><WaIcon className="h-6 w-6" />{t(TXT.reservar)}</a>
              </Magnetic>
              <a href={BIZ.telHref} className="font-mono text-sm tracking-[0.12em] text-hueso/75 underline decoration-dorado/50 underline-offset-4 hover:text-dorado">{BIZ.telefono}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
