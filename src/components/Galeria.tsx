import { useEffect, useRef } from 'react'
import { useLang } from '../lib/i18n'
import { GALERIA, TXT } from '../lib/content'
import { gsap, prefersReduced } from '../lib/motion'
import { SplitReveal } from './ui'

const LAYOUT = ['md:col-span-7 aspect-[16/11]', 'md:col-span-5 aspect-[4/5] md:mt-24', 'md:col-span-5 aspect-[4/3]', 'md:col-span-4 aspect-[3/4] md:-mt-16', 'md:col-span-3 aspect-[3/4] md:mt-20', 'md:col-span-12 aspect-[21/9]']

export default function Galeria() {
  const { t, lang } = useLang()
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (prefersReduced()) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      q('.gl-item').forEach((el, i) => {
        gsap.fromTo(el.querySelector('img'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.out', delay: (i % 2) * 0.1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40" aria-labelledby="galeria-title">
      <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker mb-6">{t(TXT.galeriaKicker)}</p>
          <SplitReveal as="h2" id="galeria-title" text={t(TXT.galeriaTitle)} className="display block text-[clamp(2.6rem,5.4vw,6rem)] text-hueso" />
        </div>
        <p className="max-w-sm font-mono text-[0.7rem] leading-relaxed tracking-wide text-hueso/55"><span className="tag-ejemplo mr-2">{t(TXT.ejemplo)}</span>{t(TXT.galeriaNota)}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-8">
        {GALERIA.map((g, i) => (
          <figure key={g.img + i} className={`gl-item group relative overflow-hidden rounded-[24px] bg-tabaco ${LAYOUT[i]}`}>
            <img src={`/img/${g.img}-1600.webp`} srcSet={`/img/${g.img}-800.webp 800w, /img/${g.img}-1600.webp 1600w`} sizes={i === 5 ? '100vw' : '(min-width:768px) 50vw, 100vw'} alt={t(g.alt)} loading="lazy"
              className="sepia-photo absolute inset-0 h-[116%] w-full -translate-y-[8%] object-cover transition-[filter,transform] duration-700 group-hover:[filter:sepia(0.1)_saturate(1.05)]" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-espresso/90 to-transparent p-5 pt-14 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-hueso/80 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              {lang === 'es' ? 'Foto' : 'Photo'}: <a href={g.url} target="_blank" rel="noopener" className="underline decoration-dorado/60 underline-offset-4 hover:text-dorado">{g.credito}</a> / Unsplash
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
