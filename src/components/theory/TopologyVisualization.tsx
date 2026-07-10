import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { TheoryVisualizationProps } from './types'

type TopologyKey = 'mobius' | 'torus' | 'crosscap'

const topologyLabels = {
  mobius: { zh: '莫比乌斯带', en: 'Möbius' },
  torus: { zh: '环面', en: 'Torus' },
  crosscap: { zh: '交叉帽', en: 'Cross-cap' },
} as const

function TopologyShape({ shape }: { shape: TopologyKey }) {
  if (shape === 'torus') {
    return (
      <g className="topology-shape topology-shape--torus">
        <ellipse cx="210" cy="140" rx="128" ry="76" />
        <ellipse cx="210" cy="140" rx="54" ry="31" />
        <path d="M89 116 C132 158 288 158 331 116" />
        <path d="M112 188 C166 136 254 136 308 188" />
      </g>
    )
  }

  if (shape === 'crosscap') {
    return (
      <g className="topology-shape topology-shape--crosscap">
        <path d="M105 224 C130 64 290 64 315 224 C267 185 153 185 105 224 Z" />
        <path d="M135 194 C178 116 242 116 285 194" />
        <path d="M148 112 L272 217" />
        <path d="M272 112 L148 217" />
      </g>
    )
  }

  return (
    <g className="topology-shape topology-shape--mobius">
      <path d="M75 153 C105 67 180 77 222 132 C263 186 319 208 345 143 C315 226 232 213 192 158 C153 105 98 91 75 153 Z" />
      <path d="M75 153 C118 198 159 201 192 158 C224 116 291 106 345 143" />
      <path d="M192 158 C202 143 211 135 222 132" />
    </g>
  )
}

export default function TopologyVisualization({ mode, language, active, onInsightChange }: TheoryVisualizationProps) {
  const reduceMotion = useReducedMotion()
  const [selected, setSelected] = useState<TopologyKey | null>(null)
  const visibleShape = selected ?? 'mobius'

  const selectTopology = (key: TopologyKey) => {
    setSelected(key)
    onInsightChange?.(key)
  }

  return (
    <motion.div
      className={`theory-visual topology-visual theory-visual--${mode}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 0 }}
    >
      <svg viewBox="0 0 420 280" role="img" aria-label={topologyLabels[visibleShape][language]}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.g
            key={visibleShape}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 1.04 }}
            style={{ transformOrigin: '210px 140px' }}
          >
            <TopologyShape shape={visibleShape} />
          </motion.g>
        </AnimatePresence>
        <text x="24" y="254">{topologyLabels[visibleShape][language]}</text>
        <text x="332" y="254">{visibleShape === 'torus' ? '2 loops' : '1 surface'}</text>
      </svg>

      {mode === 'detail' && (
        <div className="theory-segmented-control" aria-label={language === 'zh' ? '选择拓扑表面' : 'Select topological surface'}>
          {(Object.keys(topologyLabels) as TopologyKey[]).map((key) => (
            <button
              key={key}
              type="button"
              data-testid={`topology-control-${key}`}
              aria-pressed={selected === key}
              onClick={() => selectTopology(key)}
            >
              {topologyLabels[key][language]}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
