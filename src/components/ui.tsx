import { Fragment, useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { gsap, ScrollTrigger, prefersReduced, isTouch } from '../lib/motion'

// Botón/enlace magnético (desktop): sigue sutilmente al cursor
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 }), sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const move = (e: React.PointerEvent) => {
    if (isTouch() || prefersReduced() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * strength)
    y.set((e.clientY - r.top - r.height / 2) * strength)
  }
  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

// Texto dividido en palabras que suben al entrar en pantalla (accesible: aria-label en el contenedor)
export function SplitReveal({ text, as = 'span', className = '', delay = 0, stagger = 0.06, start = 'top 85%', immediate = false, id }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; start?: string; immediate?: boolean; id?: string }) {
  const Tag = as as 'span'
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const words = el.querySelectorAll('.split-inner')
    const ctx = gsap.context(() => {
      gsap.fromTo(words, { yPercent: 110, rotate: 4 }, {
        yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger, delay,
        scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [text, delay, stagger, start, immediate])
  return (
    <Tag ref={ref as React.RefObject<HTMLSpanElement>} id={id} className={className} aria-label={text}>
      {text.split(' ').map((w, i, arr) => (
        <Fragment key={i + w}>
          <span className="split-word" aria-hidden="true"><span className="split-inner">{w}</span></span>
          {i < arr.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

// Aparición simple con scroll
export function Reveal({ children, className = '', y = 40, delay = 0 }: { children: ReactNode; className?: string; y?: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { y, opacity: 0, duration: 1.1, delay, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } })
    })
    return () => ctx.revert()
  }, [y, delay])
  return <div ref={ref} className={className}>{children}</div>
}

// Contador que sube al entrar en pantalla
export function Counter({ to, decimals = 0, className = '' }: { to: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(prefersReduced() ? to : 0)
  useEffect(() => {
    if (prefersReduced() || !ref.current) return
    const o = { n: 0 }
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { n: to, duration: 2, ease: 'power3.out', onUpdate: () => setV(o.n) }),
    })
    return () => st.kill()
  }, [to])
  return <span ref={ref} className={className}>{v.toLocaleString('es-PE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
}

// Efecto "máquina de escribir / scramble" para etiquetas en Courier
export function Typewriter({ text, className = '', speed = 38 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [out, setOut] = useState(prefersReduced() ? text : '')
  useEffect(() => {
    if (prefersReduced() || !ref.current) { setOut(text); return }
    let i = 0, id = 0
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 92%', once: true,
      onEnter: () => {
        id = window.setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(id) }, speed)
      },
    })
    return () => { st.kill(); clearInterval(id) }
  }, [text, speed])
  return <span ref={ref} className={className} aria-label={text}><span aria-hidden="true">{out}<span className="opacity-60">{out.length < text.length ? '▌' : ''}</span></span></span>
}

export const Star = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
)
export const WaIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.3 1.41.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.7-.17 1.38z" /></svg>
)
export const Scissors = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 12h34" /><path d="M36 12l14-7" /><path d="M36 12l14 7" /><circle cx="55" cy="5" r="4.5" /><circle cx="55" cy="19" r="4.5" />
  </svg>
)
export const Comb = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 20" className={className} aria-hidden="true" fill="currentColor">
    <rect x="2" y="2" width="60" height="5" rx="1.5" />{Array.from({ length: 15 }, (_, i) => <rect key={i} x={4 + i * 3.9} y="7" width="1.8" height={i % 5 === 0 ? 11 : 9} rx="0.6" />)}
  </svg>
)
