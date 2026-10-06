import { useEffect, useRef } from 'react'
import { useLang } from '../lib/i18n'
import { BIZ, TXT } from '../lib/content'
import { gsap, prefersReduced } from '../lib/motion'
import { Counter, Reveal, SplitReveal, Star, Comb } from './ui'

export default function Oficio() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReduced()) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      gsap.fromTo(q('.of-img'), { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.15, ease: 'none', scrollTrigger: { trigger: q('.of-frame')[0], start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo(q('.of-frame'), { clipPath: 'inset(18% 12% 18% 12% round 200px 200px 0 0)' }, { clipPath: 'inset(0% 0% 0% 0% round 260px 260px 0 0)', ease: 'none', scrollTrigger: { trigger: q('.of-frame')[0], start: 'top 90%', end: 'top 25%', scrub: true } })
      gsap.fromTo(q('.mf-w'), { opacity: 0.16 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: q('.mf')[0], start: 'top 80%', end: 'bottom 45%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [lang])
  return (
    <section id="oficio" ref={root} className="relative mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40" aria-labelledby="oficio-title">
      <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <figure className="relative lg:sticky lg:top-24">
          <div className="of-frame relative aspect-[4/5] overflow-hidden rounded-t-[260px] bg-tabaco">
            <img src="/img/oficio-maestro-1600.webp" srcSet="/img/oficio-maestro-800.webp 800w, /img/oficio-maestro-1600.webp 1600w" sizes="(min-width:1024px) 40vw, 90vw" alt={lang === 'es' ? 'Barbero veterano de lentes cortando el pelo a un cliente (foto de archivo referencial)' : 'Veteran barber with glasses cutting a client’s hair (reference archive photo)'} className="of-img sepia-photo h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-hueso/55">
            <span>{lang === 'es' ? 'Foto de archivo referencial · NYPL / Unsplash' : 'Reference archive photo · NYPL / Unsplash'}</span>
            <span className="tag-ejemplo">{t(TXT.ejemplo)}</span>
          </figcaption>
        </figure>
        <div>
          <p className="kicker mb-6">{t(TXT.oficioKicker)}</p>
          <SplitReveal as="h2" id="oficio-title" text={t(TXT.oficioTitle)} className="display block text-[clamp(2.4rem,5vw,5.2rem)] text-hueso" />
          <p className="mf mt-12 font-display text-[clamp(1.35rem,2.2vw,2.1rem)] leading-[1.3] text-hueso" style={{ fontVariationSettings: '"opsz" 36' }}>
            {t(TXT.manifiesto).split(' ').map((w, i) => <span key={i} className="mf-w">{w} </span>)}
          </p>
          <Reveal className="mt-10 flex items-start gap-5 border-l border-dorado/40 pl-5">
            <p className="max-w-xl leading-relaxed text-hueso/75">{t(TXT.oficioP)}</p>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-hueso/10 bg-hueso/10 sm:grid-cols-3">
            <div className="bg-espresso p-6">
              <div className="font-mono text-4xl font-bold text-dorado">{BIZ.desde}</div>
              <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-hueso/65">{t(TXT.statDesde)}*</div>
            </div>
            <div className="bg-espresso p-6">
              <div className="flex items-center gap-2 font-mono text-4xl font-bold text-dorado"><Counter to={BIZ.rating} decimals={1} /><Star className="h-6 w-6" /></div>
              <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-hueso/65">{BIZ.reviews} {t(TXT.heroReviews)}</div>
            </div>
            <div className="bg-espresso p-6">
              <div className="font-mono text-4xl font-bold text-dorado"><Counter to={18276} /></div>
              <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-hueso/65">{t(TXT.statFb)}</div>
            </div>
          </div>
          <p className="mt-4 font-mono text-[0.65rem] leading-relaxed tracking-wide text-hueso/50">
            {lang === 'es'
              ? '* El logo dice "Desde 1991"; Instagram dice "since 1987". Año por confirmar con la barbería.'
              : '* The logo says "Since 1991"; Instagram says "since 1987". Year to be confirmed with the shop.'}
          </p>
          <Comb className="mt-14 h-5 w-28 text-cobre" />
        </div>
      </div>
    </section>
  )
}
