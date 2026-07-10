import { Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import { getPanelText, type TheoryPanelDefinition } from './panels'
import { visualizationRegistry } from '../theory/visualizationRegistry'

interface TheoryDossierProps {
  panel: TheoryPanelDefinition
  language: Language
  onClose: () => void
}

const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function TheoryDossier({ panel, language, onClose }: TheoryDossierProps) {
  const reduceMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [activeInsightId, setActiveInsightId] = useState<string | null>(null)
  const text = getPanelText(panel, language)
  const activeInsight = activeInsightId ? panel.insights[activeInsightId] : undefined
  const Visualization = visualizationRegistry[panel.visualizationKey]

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="dossier-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        className="theory-dossier"
        data-testid="focus-view"
        data-accent={panel.accent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        initial={reduceMotion ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
        transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="dossier-header">
          <a href="#top" className="dossier-brand" onClick={(event) => event.preventDefault()}>LACAN.JS</a>
          <span>{text.eyebrow}</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="dossier-close"
            data-testid="mobile-focus-close"
            aria-label={uiCopy.dossier.close[language]}
            title={uiCopy.dossier.close[language]}
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="dossier-layout">
          <div className="dossier-visual-stage">
            <Suspense fallback={<div className="dossier-loading">{text.shortTitle}</div>}>
              <Visualization
                mode="detail"
                language={language}
                active
                onInsightChange={setActiveInsightId}
              />
            </Suspense>
          </div>

          <div className="dossier-copy">
            <p className="dossier-eyebrow">{text.shortTitle}</p>
            <h2 id="dossier-title">{text.title}</h2>
            <p className="dossier-lead">{text.summary}</p>
            <p className="dossier-body">{text.body}</p>

            <div className="dossier-interaction" data-testid={activeInsight ? 'focus-secondary' : undefined} aria-live="polite">
              <span>{uiCopy.dossier.interaction[language]}</span>
              {activeInsight ? (
                <motion.div key={activeInsightId} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <h3>{activeInsight.title[language]}</h3>
                  <p>{activeInsight.body[language]}</p>
                </motion.div>
              ) : (
                <div>
                  <h3>{text.interactionHint}</h3>
                  <p>{uiCopy.dossier.waiting[language]}</p>
                </div>
              )}
            </div>

            <footer className="dossier-source">
              <span>{uiCopy.dossier.source[language]}</span>
              <cite>{text.source}</cite>
            </footer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
