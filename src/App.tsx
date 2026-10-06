import { useCallback, useEffect, useState } from 'react'
import { useLang } from './lib/i18n'
import { TXT } from './lib/content'
import { ScrollTrigger, startSmoothScroll } from './lib/motion'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Oficio from './components/Oficio'
import Ritual from './components/Ritual'
import Servicios from './components/Servicios'
import Resenas from './components/Resenas'
import Galeria from './components/Galeria'
import Llegar from './components/Llegar'
import Reserva from './components/Reserva'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

export default function App() {
  const { t, lang } = useLang()
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  useEffect(() => startSmoothScroll(), [])
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(id)
  }, [lang, ready])
  useEffect(() => {
    const f = () => ScrollTrigger.refresh()
    window.addEventListener('load', f)
    return () => window.removeEventListener('load', f)
  }, [])
  return (
    <>
      <a href="#contenido" className="sr-only z-[100] rounded bg-dorado px-4 py-2 text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{t(TXT.skip)}</a>
      <Preloader onDone={onDone} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main id="contenido">
        <Hero ready={ready} />
        <Marquee />
        <Oficio />
        <Ritual />
        <Servicios />
        <Resenas />
        <Galeria />
        <Llegar />
        <Reserva />
      </main>
      <Footer />
    </>
  )
}
