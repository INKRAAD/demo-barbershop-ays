import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export function useReducedMotion() {
  const [r, setR] = useState(prefersReduced)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    const f = () => setR(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return r
}

export function useMedia(q: string) {
  const [v, setV] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setV(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return v
}

// Lenis + ScrollTrigger sincronizados (desactivado con prefers-reduced-motion)
let lenis: Lenis | null = null
export const getLenis = () => lenis
export const scrollState = { velocity: 0, progress: 0 }

export function startSmoothScroll() {
  if (prefersReduced()) {
    const f = () => { scrollState.progress = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) }
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 })
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity
    scrollState.progress = l.progress
    ScrollTrigger.update()
  })
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -10, duration: 1.6 })
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
}
