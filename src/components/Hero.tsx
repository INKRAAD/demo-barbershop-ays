import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { useLang } from '../lib/i18n'
import { BIZ, TXT, wa } from '../lib/content'
import { gsap, scrollToId, useMedia, useReducedMotion } from '../lib/motion'
import { Magnetic, Star, WaIcon } from './ui'

const SunsetCanvas = lazy(() => import('./SunsetCanvas'))

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className="split-word" aria-hidden="true"><span className="split-inner hero-word">{w}</span>&nbsp;</span>
      ))}
    </>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()
  const mobile = useMedia('(max-width: 767px)')
  const root = useRef<HTMLElement>(null)
  const setRef = useRef(0)

  useLayoutEffect(() => {
    if (reduced) return
    const q = gsap.utils.selector(root)
    gsap.set(q('.hero-word'), { yPercent: 115 })
    gsap.set(q('.hero-logo'), { opacity: 0, scale: 1.12, filter: 'blur(10px)' })
    gsap.set(q('.hero-fade'), { opacity: 0, y: 24 })
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ delay: 0.05 })
    tl.to(q('.hero-logo'), { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'expo.out' })
      .to(q('.hero-word'), { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07 }, 0.15)
      .to(q('.hero-fade'), { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.5)
    return () => { tl.kill() }
  }, [ready, reduced])

  useEffect(() => {
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => { setRef.current = s.progress } },
      })
        .to(q('.hero-logo-wrap'), { yPercent: reduced ? 0 : -28, scale: reduced ? 1 : 0.82, ease: 'none' }, 0)
        .to(q('.hero-title'), { yPercent: reduced ? 0 : -35, ease: 'none' }, 0)
        .to(q('.hero-shade'), { opacity: 1, ease: 'none' }, 0)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="top" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden" aria-labelledby="hero-title">
      {/* fondo de respaldo si WebGL no carga */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#1B150B 0%,#3A2812 30%,#A16C30 52%,#DDBF6A 60%,#3A2812 61%,#1B150B 100%)' }} aria-hidden="true" />
      <Suspense fallback={null}>
        <SunsetCanvas setRef={setRef} reduced={reduced} mobile={mobile} />
      </Suspense>
      <div className="hero-shade pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-espresso opacity-0" aria-hidden="true" />

      <div className="hero-logo-wrap pointer-events-none absolute inset-x-0 top-[9%] flex justify-center md:top-[8%]">
        <img src="/brand/ays-logo.svg" alt="Logo de Barbershop A&S: maestro barbero de barba blanca y lentes, letras A y S, tijera y peine, 'Barbershop – Desde 1991'" className="hero-logo w-[min(80vw,46vh)] drop-shadow-[0_20px_60px_rgba(27,21,11,0.6)] md:w-[min(46vw,50vh)]" fetchPriority="high" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-espresso via-espresso/85 to-transparent md:hidden" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1500px] flex-col gap-6 px-5 pb-8 md:flex-row md:items-end md:justify-between md:px-10 md:pb-12">
        <div className="hero-title">
          <p className="hero-fade kicker mb-4">{t(TXT.heroKicker)}</p>
          <h1 id="hero-title" className="display text-[clamp(2.7rem,6.4vw,7.2rem)] text-hueso" aria-label={`${t(TXT.heroTitle1)} ${t(TXT.heroTitle2)} ${t(TXT.heroTitle3)}`}>
            <span className="block"><Words text={t(TXT.heroTitle1)} /> <span className="text-dorado"><Words text={t(TXT.heroTitle2)} /></span></span>
            <span className="block"><Words text={t(TXT.heroTitle3)} /></span>
          </h1>
        </div>
        <div className="max-w-sm space-y-5 md:pb-3">
          <p className="hero-fade text-[0.98rem] leading-relaxed text-hueso/85">{t(TXT.heroSub)}</p>
          <div className="hero-fade flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={wa(lang)} target="_blank" rel="noopener" className="btn-primary" data-cursor="WhatsApp"><WaIcon className="h-5 w-5" />{t(TXT.reservar)}</a>
            </Magnetic>
          </div>
          <a href="#resenas" onClick={(e) => { e.preventDefault(); scrollToId('resenas') }} className="hero-fade group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-hueso/80">
            <span className="text-2xl font-bold tracking-normal text-dorado">{BIZ.rating}</span>
            <span className="flex text-dorado">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3.5 w-3.5" />)}</span>
            <span className="group-hover:text-dorado">{BIZ.reviews} {t(TXT.heroReviews)}</span>
          </a>
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-hueso/50 xl:block">{t(TXT.scroll)} ↓</div>
    </section>
  )
}
