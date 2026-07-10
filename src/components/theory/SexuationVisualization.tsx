import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { TheoryVisualizationProps } from './types'

type FormulaKey = 'left_exception' | 'left_all' | 'right_no_exception' | 'right_not_all'

const formulae: Array<{ key: FormulaKey; formula: string; label: { zh: string; en: string }; side: 'left' | 'right' }> = [
  { key: 'left_exception', formula: '∃x ¬Φx', label: { zh: '存在一个例外', en: 'an exception exists' }, side: 'left' },
  { key: 'left_all', formula: '∀x Φx', label: { zh: '所有都受制', en: 'all are submitted' }, side: 'left' },
  { key: 'right_no_exception', formula: '¬∃x ¬Φx', label: { zh: '不存在例外', en: 'no exception exists' }, side: 'right' },
  { key: 'right_not_all', formula: '¬∀x Φx', label: { zh: '并非全部', en: 'not-all' }, side: 'right' },
]

export default function SexuationVisualization({ mode, language, active, onInsightChange }: TheoryVisualizationProps) {
  const reduceMotion = useReducedMotion()
  const [selected, setSelected] = useState<FormulaKey | null>(null)

  const selectFormula = (key: FormulaKey) => {
    setSelected(key)
    onInsightChange?.(key)
  }

  return (
    <motion.div
      className={`theory-visual sexuation-visual theory-visual--${mode}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 0 }}
    >
      <div className="sexuation-grid" aria-label={language === 'zh' ? '性化公式' : 'Formulae of sexuation'}>
        <div className="sexuation-side-label">{language === 'zh' ? '例外 / 全体' : 'exception / all'}</div>
        <div className="sexuation-divider" aria-hidden="true" />
        <div className="sexuation-side-label">{language === 'zh' ? '无例外 / 不全' : 'no exception / not-all'}</div>
        {formulae.map((item) => {
          const content = (
            <>
              <strong>{item.formula}</strong>
              <span>{item.label[language]}</span>
            </>
          )

          return mode === 'detail' ? (
            <button
              key={item.key}
              type="button"
              className={`sexuation-formula sexuation-formula--${item.side}`}
              data-testid={`sexuation-formula-${item.key}`}
              aria-pressed={selected === item.key}
              onClick={() => selectFormula(item.key)}
            >
              {content}
            </button>
          ) : (
            <div key={item.key} className={`sexuation-formula sexuation-formula--${item.side}`}>
              {content}
            </div>
          )
        })}
      </div>
      <p className="sexuation-note">
        {language === 'zh' ? '逻辑位置 ≠ 生理性别' : 'logical position ≠ biological sex'}
      </p>
    </motion.div>
  )
}
