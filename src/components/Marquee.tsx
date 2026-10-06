import { useLang } from '../lib/i18n'
import { TXT } from '../lib/content'
import { Scissors } from './ui'

export default function Marquee() {
  const { lang } = useLang()
  const items = TXT.marquee[lang]
  const row = [...items, ...items]
  return (
    <div className="relative z-10 -rotate-1 border-y border-dorado/30 bg-dorado py-4 text-espresso" aria-label={items.join(' · ')}>
      <div className="overflow-hidden" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {row.map((w, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 font-mono text-lg font-bold uppercase tracking-[0.2em] md:text-2xl">
                  {w}<Scissors className="h-4 w-12 text-oxido" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
