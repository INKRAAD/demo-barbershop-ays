// Cursor personalizado: punto dorado + aro que crece sobre elementos interactivos y muestra una etiqueta (data-cursor)
import { useEffect, useRef, useState } from 'react'
import { isTouch, prefersReduced } from '../lib/motion'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null), layer = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (isTouch() || prefersReduced()) return
    setOn(true)
    document.documentElement.classList.add('has-cursor')
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0, hover = false, seen = false
    const move = (e: PointerEvent) => {
      if (!seen) { seen = true; rx = e.clientX; ry = e.clientY; layer.current?.style.setProperty('opacity', '1') }
      x = e.clientX; y = e.clientY
      const t = (e.target as HTMLElement).closest('a,button,[data-cursor]') as HTMLElement | null
      hover = !!t
      setLabel(t?.dataset.cursor ?? '')
    }
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${hover ? 1.9 : 1})`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor') }
  }, [])
  if (!on) return null
  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] opacity-0 transition-opacity duration-300">
      <div ref={ring} className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border border-dorado/70 transition-[scale,background] duration-300" style={{ background: label ? 'rgba(221,191,106,0.92)' : 'transparent' }}>
        {label && <span className="font-mono text-[6px] font-bold uppercase tracking-[0.12em] text-espresso">{label}</span>}
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-dorado" />
    </div>
  )
}
