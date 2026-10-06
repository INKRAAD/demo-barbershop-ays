import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang, T } from './content'

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (x: T) => string }>({ lang: 'es', setLang: () => {}, t: (x) => x.es })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const q = new URLSearchParams(location.search).get('lang')
    return q === 'en' ? 'en' : 'es'
  })
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang, t: (x) => x[lang] }}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
