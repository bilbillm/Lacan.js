import { Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import { getPanelText, panels, type TheoryGroup } from './panels'
import { visualizationRegistry } from '../theory/visualizationRegistry'

interface TheoryIndexProps {
  language: Language
  onOpenPanel: (panelId: string, trigger: HTMLButtonElement) => void
}

function TheoryGroupList({
  group,
  language,
  onOpenPanel,
}: TheoryIndexProps & { group: TheoryGroup }) {
  const reduceMotion = useReducedMotion()
  const groupPanels = panels.filter((panel) => panel.group === group)

  return (
    <div className="theory-group" data-group={group}>
      <div className="theory-group-heading">
        <span>{group === 'core' ? 'A' : 'B'}</span>
        <h3>{uiCopy.theory.groups[group][language]}</h3>
        <span>04</span>
      </div>

      <div className="theory-grid">
        {groupPanels.map((panel, index) => {
          const text = getPanelText(panel, language)
          const Visualization = visualizationRegistry[panel.visualizationKey]
          const itemNumber = String(panels.indexOf(panel) + 1).padStart(2, '0')

          return (
            <motion.article
              key={panel.id}
              className="theory-index-item"
              data-accent={panel.accent}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.5 }}
            >
              <button
                type="button"
                className="theory-index-button"
                data-testid={`panel-card-${panel.id}`}
                data-panel-id={panel.id}
                aria-label={`${uiCopy.theory.openPanel[language]}: ${text.title}`}
                onClick={(event) => onOpenPanel(panel.id, event.currentTarget)}
              >
                <span className="theory-item-number">{itemNumber}</span>
                <span className="theory-item-copy">
                  <span className="theory-item-eyebrow">{text.eyebrow}</span>
                  <strong>{text.indexTitle}</strong>
                  <span className="theory-item-summary">{text.summary}</span>
                </span>
                <span className="theory-item-icon" aria-hidden="true"><ArrowUpRight /></span>
                <span className="theory-item-visual" aria-hidden="true">
                  <Suspense fallback={<span className="visualization-fallback">{itemNumber}</span>}>
                    <Visualization mode="preview" language={language} active />
                  </Suspense>
                </span>
              </button>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}

export default function TheoryIndex({ language, onOpenPanel }: TheoryIndexProps) {
  return (
    <section id="theory" className="page-section theory-index-section" data-section="theory" data-testid="panel-gallery" aria-labelledby="theory-title">
      <div className="section-heading">
        <span className="section-number">{uiCopy.theory.sectionNumber}</span>
        <div>
          <p className="section-eyebrow">{uiCopy.theory.eyebrow[language]}</p>
          <h2 id="theory-title">{uiCopy.theory.title[language]}</h2>
        </div>
        <p>{uiCopy.theory.intro[language]}</p>
      </div>

      <TheoryGroupList group="core" language={language} onOpenPanel={onOpenPanel} />
      <TheoryGroupList group="extended" language={language} onOpenPanel={onOpenPanel} />
    </section>
  )
}
