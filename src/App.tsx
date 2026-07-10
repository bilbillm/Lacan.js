import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import type { Language } from './i18n'
import { uiCopy } from './i18n'
import SiteNav from './components/app/SiteNav'
import SignifierHero from './components/app/SignifierHero'
import TheoryIndex from './components/app/TheoryIndex'
import TheoryDossier from './components/app/TheoryDossier'
import SiteFooter from './components/app/SiteFooter'
import { panelById } from './components/app/panels'

const TimelineView = lazy(() => import('./components/app/TimelineView'))
const BorromeanKnot2D = lazy(() => import('./components/BorromeanKnot2D'))

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="section-fallback" aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<'day' | 'night'>(() => {
    if (typeof window === 'undefined') return 'day'
    return window.localStorage.getItem('lacan-theme') === 'night' ? 'night' : 'day'
  })
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'zh'
    return window.localStorage.getItem('lacan-language') === 'en' ? 'en' : 'zh'
  })
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('')
  const selectedPanel = selectedPanelId ? panelById.get(selectedPanelId) : undefined

  useEffect(() => {
    window.localStorage.setItem('lacan-theme', theme)
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('lacan-language', language)
  }, [language])

  useEffect(() => {
    let frame = 0

    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
        const marker = window.innerHeight * 0.32
        const current = sections.find((section) => {
          const bounds = section.getBoundingClientRect()
          return bounds.top <= marker && bounds.bottom > marker
        })
        setActiveSection(current?.dataset.section ?? '')
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  const handleClosePanel = useCallback(() => {
    setSelectedPanelId(null)
  }, [])

  return (
    <div className="app-container" lang={language === 'zh' ? 'zh-CN' : 'en'} data-theme={theme}>
      <a className="skip-link" href="#main-content">{uiCopy.app.skipToContent[language]}</a>
      <SiteNav
        language={language}
        theme={theme}
        activeSection={activeSection}
        onToggleLanguage={() => setLanguage((current) => current === 'zh' ? 'en' : 'zh')}
        onToggleTheme={() => setTheme((current) => current === 'day' ? 'night' : 'day')}
      />

      <main id="main-content">
        <SignifierHero language={language} />
        <TheoryIndex language={language} onOpenPanel={(panelId) => setSelectedPanelId(panelId)} />
        <Suspense fallback={<SectionFallback label={uiCopy.timeline.title[language]} />}>
          <TimelineView language={language} />
        </Suspense>
        <Suspense fallback={<SectionFallback label={uiCopy.borromean.title[language]} />}>
          <BorromeanKnot2D language={language} />
        </Suspense>
      </main>

      <SiteFooter language={language} />

      <AnimatePresence>
        {selectedPanel && (
          <TheoryDossier
            key={selectedPanel.id}
            panel={selectedPanel}
            language={language}
            onClose={handleClosePanel}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
