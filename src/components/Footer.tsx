import { useLang } from '../lib/i18n'
import { BIZ, TXT, wa } from '../lib/content'
import { scrollToId } from '../lib/motion'
import { Scissors, Comb } from './ui'

export default function Footer() {
  const { t, lang } = useLang()
  return (
    <footer className="relative border-t border-hueso/10 bg-[#120e07] pb-10 pt-20">
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:grid-cols-[auto_1fr_1fr_1fr] md:px-10">
        <img src="/brand/ays-logo.svg" alt="Barbershop A&S — desde 1991" className="w-40" loading="lazy" />
        <div>
          <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-dorado">{lang === 'es' ? 'Visítanos' : 'Visit us'}</h3>
          <address className="mt-4 not-italic leading-relaxed text-hueso/80">{BIZ.direccion}<br />{BIZ.distrito}</address>
          <a href={BIZ.maps} target="_blank" rel="noopener" className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.14em] text-hueso/60 underline decoration-dorado/50 underline-offset-4 hover:text-dorado">Google Maps ↗</a>
        </div>
        <div>
          <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-dorado">{lang === 'es' ? 'Contacto' : 'Contact'}</h3>
          <ul className="mt-4 space-y-2 text-hueso/80">
            <li><a href={wa(lang)} target="_blank" rel="noopener" className="hover:text-dorado">WhatsApp {BIZ.telefono}</a></li>
            <li><a href={BIZ.telHref} className="hover:text-dorado">{lang === 'es' ? 'Tel.' : 'Phone'} {BIZ.telefono}</a></li>
            <li><a href={`mailto:${BIZ.email}`} className="break-all hover:text-dorado">{BIZ.email}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.22em] text-dorado">{lang === 'es' ? 'Redes' : 'Social'}</h3>
          <ul className="mt-4 space-y-2 text-hueso/80">
            <li><a href={BIZ.facebook} target="_blank" rel="noopener" className="hover:text-dorado">Facebook · /ASBarbershop</a></li>
            <li><a href={BIZ.instagram} target="_blank" rel="noopener" className="hover:text-dorado">Instagram · @ays_barbershop_since_1987</a></li>
          </ul>
          <button onClick={() => scrollToId('top')} className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-hueso/60 hover:text-dorado">↑ {lang === 'es' ? 'Volver arriba' : 'Back to top'}</button>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-[1500px] items-center gap-6 px-5 text-cobre md:px-10" aria-hidden="true">
        <Scissors className="h-4 w-14" /><div className="h-px flex-1 bg-cobre/40" /><Comb className="h-4 w-16" />
      </div>
      <div className="mx-auto mt-8 flex max-w-[1500px] flex-col gap-3 px-5 font-mono text-[0.66rem] leading-relaxed tracking-wide text-hueso/50 md:flex-row md:justify-between md:px-10">
        <p className="max-w-3xl">{t(TXT.footerDemo)}</p>
        <p>{lang === 'es' ? 'Fotos: Unsplash (ver créditos en galería)' : 'Photos: Unsplash (credits in gallery)'} · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
