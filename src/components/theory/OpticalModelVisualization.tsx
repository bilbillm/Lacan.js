import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { TheoryVisualizationProps } from './types'

export default function OpticalModelVisualization({ mode, language, active, onInsightChange }: TheoryVisualizationProps) {
  const reduceMotion = useReducedMotion()
  const [observer, setObserver] = useState(34)
  const insightId = observer < 52 ? 'real_image' : 'virtual_image'
  const observerX = 52 + observer * 2.15
  const imageX = observer < 52 ? 245 : 310

  const updateObserver = (next: number) => {
    setObserver(next)
    onInsightChange?.(next < 52 ? 'real_image' : 'virtual_image')
  }

  return (
    <motion.div
      className={`theory-visual optical-visual theory-visual--${mode}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.72, y: 0 }}
    >
      <svg viewBox="0 0 420 280" role="img" aria-label={language === 'zh' ? '花束实验光学模型' : 'Optical model of the bouquet experiment'}>
        <path className="optical-table" d="M45 218 H372" />
        <path className="optical-concave" d="M370 44 Q310 140 370 236" />
        <path className="optical-plane" d="M210 54 V224" />

        <g className="optical-vase">
          <path d="M116 210 C104 188 112 164 132 157 C152 164 160 188 148 210 Z" />
          <path d="M132 157 V119" />
          <circle cx="121" cy="117" r="9" />
          <circle cx="143" cy="114" r="9" />
          <circle cx="133" cy="101" r="9" />
        </g>

        <g className="optical-hidden-object">
          <path d="M284 210 C272 188 280 164 300 157 C320 164 328 188 316 210 Z" />
          <path d="M300 157 V126" />
        </g>

        <motion.g className="optical-image" animate={{ x: imageX - 245, opacity: insightId === 'real_image' ? 1 : 0.48 }}>
          <path d="M233 210 C221 188 229 164 249 157 C269 164 277 188 265 210 Z" />
          <path d="M249 157 V119" />
          <circle cx="238" cy="117" r="9" />
          <circle cx="260" cy="114" r="9" />
          <circle cx="250" cy="101" r="9" />
        </motion.g>

        <path className="optical-ray optical-ray--cobalt" d={`M${observerX} 80 L210 105 L350 94`} />
        <path className="optical-ray optical-ray--vermilion" d={`M${observerX} 80 L210 156 L350 176`} />
        <motion.g className="optical-observer" animate={{ x: observerX - 125 }}>
          <path d="M112 73 Q125 61 138 73 Q125 86 112 73 Z" />
          <circle cx="125" cy="73" r="3" />
        </motion.g>

        <text x="108" y="244">{language === 'zh' ? '对象' : 'object'}</text>
        <text x="189" y="44">{language === 'zh' ? '平面镜' : 'plane mirror'}</text>
        <text x="330" y="258">{language === 'zh' ? '凹面镜' : 'concave mirror'}</text>
      </svg>

      {mode === 'detail' && (
        <label className="optical-slider-label">
          <span>{language === 'zh' ? '观察点' : 'observer position'}</span>
          <input
            type="range"
            min="8"
            max="92"
            value={observer}
            data-testid="optical-observer-control"
            onChange={(event) => updateObserver(Number(event.target.value))}
          />
          <output>{insightId === 'real_image' ? (language === 'zh' ? '实像区' : 'real image') : (language === 'zh' ? '虚像区' : 'virtual image')}</output>
        </label>
      )}
    </motion.div>
  )
}
