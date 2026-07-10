import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { TheoryVisualizationProps } from './types'

const discourseTerms = {
  master: { agent: 'S1', other: 'S2', truth: '$', product: 'a' },
  university: { agent: 'S2', other: 'a', truth: 'S1', product: '$' },
  hysteric: { agent: '$', other: 'S1', truth: 'a', product: 'S2' },
  analyst: { agent: 'a', other: '$', truth: 'S2', product: 'S1' },
} as const

type DiscourseKey = keyof typeof discourseTerms

const discourseLabels = {
  master: { zh: '主人', en: 'Master' },
  university: { zh: '大学', en: 'University' },
  hysteric: { zh: '癔症者', en: 'Hysteric' },
  analyst: { zh: '分析家', en: 'Analyst' },
} as const

export default function FourDiscoursesVisualization({
  mode,
  language,
  active,
  onInsightChange,
}: TheoryVisualizationProps) {
  const reduceMotion = useReducedMotion()
  const [selected, setSelected] = useState<DiscourseKey | null>(null)
  const visibleDiscourse = selected ?? 'master'
  const terms = discourseTerms[visibleDiscourse]

  const chooseDiscourse = (key: DiscourseKey) => {
    setSelected(key)
    onInsightChange?.(key)
  }

  const positionLabels = {
    agent: language === 'zh' ? '施动者' : 'agent',
    other: language === 'zh' ? '他者' : 'other',
    truth: language === 'zh' ? '真理' : 'truth',
    product: language === 'zh' ? '产品' : 'product',
  }

  return (
    <motion.div
      className={`theory-visual discourse-visual theory-visual--${mode}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 0 }}
    >
      <div className="discourse-diagram" aria-label={language === 'zh' ? '四种话语结构图' : 'Four discourses diagram'}>
        <div className="discourse-position discourse-position--agent">
          <span>{positionLabels.agent}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong key={`${visibleDiscourse}-${terms.agent}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              {terms.agent}
            </motion.strong>
          </AnimatePresence>
        </div>
        <div className="discourse-arrow" aria-hidden="true">→</div>
        <div className="discourse-position discourse-position--other">
          <span>{positionLabels.other}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong key={`${visibleDiscourse}-${terms.other}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              {terms.other}
            </motion.strong>
          </AnimatePresence>
        </div>
        <div className="discourse-bar discourse-bar--left" aria-hidden="true" />
        <div className="discourse-bar discourse-bar--right" aria-hidden="true" />
        <div className="discourse-position discourse-position--truth">
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong key={`${visibleDiscourse}-${terms.truth}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              {terms.truth}
            </motion.strong>
          </AnimatePresence>
          <span>{positionLabels.truth}</span>
        </div>
        <div className="discourse-position discourse-position--product">
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong key={`${visibleDiscourse}-${terms.product}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              {terms.product}
            </motion.strong>
          </AnimatePresence>
          <span>{positionLabels.product}</span>
        </div>
      </div>

      {mode === 'detail' && (
        <div className="theory-segmented-control" aria-label={language === 'zh' ? '选择话语' : 'Select discourse'}>
          {(Object.keys(discourseTerms) as DiscourseKey[]).map((key) => (
            <button
              key={key}
              type="button"
              data-testid={`discourse-control-${key}`}
              aria-pressed={selected === key}
              onClick={() => chooseDiscourse(key)}
            >
              {discourseLabels[key][language]}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
