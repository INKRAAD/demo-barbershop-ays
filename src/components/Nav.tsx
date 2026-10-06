import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '../lib/i18n'
import { NAV, TXT, wa } from '../lib/content'
import { scrollToId } from '../lib/motion'
import { Magnetic, WaIcon } from './ui'

export default function Nav() {
  const { t, lang, setLang } = useLang()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    let last = scrollY
    const f = () => {
      const y = scrollY
      setSolid(y > 80)
      setHidden(y > last && y > innerHeight * 0.6)
      last = y
    }
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [])
  const go = (id: string) => { setOpen(false); scrollToId(id) }
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? '-translate-y-full' : ''} ${solid ? 'bg-espresso/80 backdrop-blur-md' : ''}`}>
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-3 md:px-10" aria-label="Principal">
          <a href="#top" onClick={(e) => { e.preventDefault(); go('top') }} className="flex items-center gap-3" data-cursor="Inicio" aria-label="Barbershop A&S — inicio">
            <img src="/brand/ays-logo.svg" alt="" className="h-12 w-auto md:h-14" />
            <span className="hidden font-mono text-[0.7rem] font-bold uppercase leading-tight tracking-[0.25em] text-hueso/80 sm:block">Barbershop<br />A&amp;S · 1991</span>
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id) }} className="group relative font-mono text-xs font-bold uppercase tracking-[0.22em] text-hueso/85 hover:text-dorado">
                  {t(n.label)}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-dorado transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="rounded-full border border-hueso/30 px-3 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-hueso/85 hover:border-dorado hover:text-dorado" aria-label={lang === 'es' ? 'View in English' : 'Ver en español'}>
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <Magnetic className="max-[359px]:hidden">
              <a href={wa(lang)} target="_blank" rel="noopener" className="btn-primary !py-3" data-cursor="WhatsApp">
                <WaIcon className="h-4 w-4" />{t(TXT.reservarCorto)}
              </a>
            </Magnetic>
            <button className="grid h-11 w-11 place-items-center rounded-full border border-hueso/30 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu-movil" aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-hueso transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-5 bg-hueso transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div id="menu-movil" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-tabaco px-6 pb-10 pt-28 lg:hidden">
            <ul className="space-y-3">
              {NAV.map((n, i) => (
                <motion.li key={n.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); go(n.id) }} className="display block text-5xl text-hueso">{t(n.label)}</a>
                </motion.li>
              ))}
            </ul>
            <a href={wa(lang)} target="_blank" rel="noopener" className="btn-primary justify-center"><WaIcon className="h-5 w-5" />{t(TXT.reservar)}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
