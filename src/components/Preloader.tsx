// Loader de marca: el logo "amanece" desde la línea del horizonte, contador en Courier y el telón se abre en dos (cielo / mar).
import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReduced } from '../lib/motion'
import { useLang } from '../lib/i18n'
import { TXT } from '../lib/content'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const { t } = useLang()
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const finish = () => { document.documentElement.style.overflow = ''; setGone(true); onDone() }
    if (prefersReduced()) {
      const id = setTimeout(finish, 350)
      return () => clearTimeout(id)
    }
    const o = { v: 0 }
    const q = gsap.utils.selector(root)
    const tl = gsap.timeline({ onComplete: finish })
    tl.fromTo(q('.pl-line'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.inOut' })
      .fromTo(q('.pl-logo'), { clipPath: 'inset(100% 0% 0% 0%)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.3, ease: 'expo.out' }, 0.35)
      .to(o, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => setN(Math.round(o.v)) }, 0.1)
      .to(q('.pl-logo'), { scale: 0.92, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to(q('.pl-meta'), { opacity: 0, duration: 0.3 }, '<')
      .to(q('.pl-top'), { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.1')
      .to(q('.pl-bot'), { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
      .to(q('.pl-line'), { scaleX: 0, opacity: 0, duration: 0.6, ease: 'expo.in' }, '<')
    return () => { tl.kill(); document.documentElement.style.overflow = '' }
  }, [onDone])
  if (gone) return null
  return (
    <div ref={root} className="fixed inset-0 z-[90]" role="status" aria-live="polite" aria-label={t(TXT.loader)}>
      <div className="pl-top absolute inset-x-0 top-0 h-[60%] bg-espresso" />
      <div className="pl-bot absolute inset-x-0 bottom-0 h-[40%] bg-espresso" />
      <div className="pl-line absolute inset-x-0 top-[60%] h-px origin-center bg-dorado/70" />
      <div className="absolute inset-x-0 top-[60%] flex -translate-y-full justify-center">
        <img src="/brand/ays-logo.svg" alt="" className="pl-logo mb-6 w-[min(56vw,320px)]" />
      </div>
      <div className="pl-meta absolute inset-x-0 top-[60%] mt-6 flex items-baseline justify-between px-6 font-mono text-xs uppercase tracking-[0.3em] text-hueso/70 md:px-12">
        <span>{t(TXT.loader)}…</span>
        <span className="text-dorado">{String(n).padStart(3, '0')}</span>
      </div>
    </div>
  )
}
