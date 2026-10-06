import { useRef } from 'react'
import { motion } from 'motion/react'
import { useLang } from '../lib/i18n'
import { BIZ, RESENAS, TXT } from '../lib/content'
import { Counter, Reveal, SplitReveal, Star } from './ui'

function GoogleG({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export default function Resenas() {
  const { t, lang } = useLang()
  const drag = useRef<HTMLDivElement>(null)
  const destacada = RESENAS.find((r) => r.destacada)!
  const resto = RESENAS.filter((r) => !r.destacada)
  return (
    <section id="resenas" className="relative overflow-hidden bg-hueso py-28 text-espresso md:py-40" aria-labelledby="resenas-title">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="kicker mb-6 !text-oxido">{t(TXT.resenasKicker)}</p>
            <SplitReveal as="h2" id="resenas-title" text={t(TXT.resenasTitle)} className="display block text-[clamp(3rem,7vw,8rem)] text-espresso" />
          </div>
          <Reveal className="flex items-center gap-6 rounded-3xl border border-espresso/15 bg-white/60 p-6 md:p-8">
            <GoogleG className="h-12 w-12" />
            <div>
              <div className="flex items-baseline gap-3">
                <Counter to={BIZ.rating} decimals={1} className="font-mono text-6xl font-bold leading-none" />
                <span className="flex text-cobre">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5" />)}</span>
              </div>
              <div className="mt-2 font-mono text-sm uppercase tracking-[0.16em] text-espresso/70"><Counter to={BIZ.reviews} /> {t(TXT.heroReviews)}</div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <figure className="relative">
            <blockquote className="display relative max-w-5xl text-[clamp(2rem,4.6vw,4.8rem)] leading-[1.02] text-espresso" lang="en">
              {destacada.en}
            </blockquote>
            {lang === 'es' && <p className="mt-6 max-w-3xl font-display text-xl italic text-espresso/70">{destacada.es} <span className="font-mono text-xs not-italic uppercase tracking-[0.14em] text-espresso/50">· {t(TXT.traduccion)}</span></p>}
            <figcaption className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-oxido">{t(destacada.meta)}</figcaption>
          </figure>
        </Reveal>

        <div ref={drag} className="mt-20 overflow-hidden md:mt-24" data-cursor={lang === 'es' ? 'Arrastra' : 'Drag'}>
          <motion.div drag="x" dragConstraints={drag} dragElastic={0.12} className="flex w-max cursor-grab gap-5 active:cursor-grabbing md:gap-8">
            {resto.map((r, i) => (
              <figure key={i} className="flex w-[82vw] max-w-[440px] shrink-0 select-none flex-col justify-between rounded-[28px] bg-espresso p-8 text-hueso md:p-10">
                <div>
                  <div className="flex gap-1 text-dorado">{[0, 1, 2, 3, 4].map((k) => <Star key={k} className="h-4 w-4" />)}</div>
                  <blockquote className="mt-6 font-display text-2xl leading-snug" lang="en">“{r.en}”</blockquote>
                  {lang === 'es' && <p className="mt-4 text-[0.95rem] leading-relaxed text-hueso/65">{r.es} <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-hueso/45">· {t(TXT.traduccion)}</span></p>}
                </div>
                <figcaption className="mt-8 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-dorado"><GoogleG className="h-4 w-4" />{t(r.meta)}</figcaption>
              </figure>
            ))}
            <a href={BIZ.maps} target="_blank" rel="noopener" className="group flex w-[60vw] max-w-[320px] shrink-0 flex-col justify-end rounded-[28px] border border-espresso/20 p-8 transition-colors hover:bg-dorado md:p-10">
              <span className="display text-4xl">{t(TXT.verGoogle)}</span>
              <span className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-espresso/60 transition-transform group-hover:translate-x-2">{BIZ.reviews}+ {t(TXT.heroReviews)} →</span>
            </a>
          </motion.div>
        </div>
        <p className="mt-10 max-w-2xl font-mono text-[0.68rem] leading-relaxed tracking-wide text-espresso/60">{t(TXT.resenasFuente)}</p>
      </div>
    </section>
  )
}
