// "El ritual": scroll horizontal fijado (desktop) con los 4 tiempos del corte. En móvil se apila en vertical.
import { useEffect, useRef } from 'react'
import { useLang } from '../lib/i18n'
import { RITUAL, TXT } from '../lib/content'
import { gsap, prefersReduced, useMedia } from '../lib/motion'
import { SplitReveal } from './ui'

export default function Ritual() {
  const { t, lang } = useLang()
  const desktop = useMedia('(min-width: 1024px)')
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!desktop || prefersReduced() || !track.current) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      const dist = () => track.current!.scrollWidth - innerWidth
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
      })
      q('.rt-card').forEach((card) => {
        const img = card.querySelector('.rt-img')
        gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
        gsap.from(card.querySelector('.rt-num'), { yPercent: 60, opacity: 0, ease: 'expo.out', duration: 1.2, scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 75%' } })
      })
      gsap.fromTo(q('.rt-progress'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [desktop, lang])

  return (
    <section ref={root} className="relative overflow-hidden bg-tabaco/40" aria-labelledby="ritual-title">
      <div className={desktop ? 'flex h-[100svh] items-center' : 'py-24'}>
        <div ref={track} className={desktop ? 'flex h-[78vh] items-stretch gap-8 pl-10 pr-[12vw]' : 'space-y-14 px-5'}>
          <div className={desktop ? 'flex w-[34vw] shrink-0 flex-col justify-end pb-6 pr-8' : ''}>
            <p className="kicker mb-6">{t(TXT.ritualKicker)}</p>
            <SplitReveal as="h2" id="ritual-title" text={t(TXT.ritualTitle)} className="display block text-[clamp(2.6rem,5.4vw,6rem)] text-hueso" />
            <p className="mt-8 max-w-md leading-relaxed text-hueso/70">
              {lang === 'es' ? 'Lo que cuentan las reseñas, convertido en método. Desliza para recorrer la silla.' : 'What the reviews describe, turned into a method. Scroll through the chair.'}
            </p>
          </div>
          {RITUAL.map((r) => (
            <article key={r.n} className={`rt-card group relative shrink-0 overflow-hidden rounded-[28px] bg-espresso ${desktop ? 'w-[min(46vw,640px)]' : 'aspect-[4/5] w-full'}`}>
              <div className="absolute inset-0 overflow-hidden">
                <img src={`/img/${r.img}-1600.webp`} srcSet={`/img/${r.img}-800.webp 800w, /img/${r.img}-1600.webp 1600w`} sizes="(min-width:1024px) 46vw, 92vw" alt={t(r.alt)} loading="lazy" className="rt-img sepia-photo h-full w-[120%] max-w-none object-cover transition-[filter] duration-700 group-hover:[filter:sepia(0.15)_saturate(1)]" style={{ marginLeft: '-10%' }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-7 md:p-10">
                <div className="flex items-start justify-between">
                  <span className="rt-num font-mono text-[clamp(4rem,8vw,7.5rem)] font-bold leading-none text-dorado/90">{r.n}</span>
                  {!r.real && <span className="tag-ejemplo mt-3">{t(TXT.porConfirmar)}</span>}
                </div>
                <div>
                  <h3 className="display text-[clamp(2rem,3.2vw,3.4rem)] text-hueso">{t(r.t)}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-hueso/80">{t(r.p)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {desktop && <div className="rt-progress absolute bottom-8 left-10 right-10 h-px origin-left bg-dorado/60" aria-hidden="true" />}
    </section>
  )
}
