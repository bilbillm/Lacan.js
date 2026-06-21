import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Language } from '../i18n'
import { uiCopy } from '../i18n'

interface BorromeanKnot2DProps {
  isMobileViewport: boolean
  language: Language
}

const RINGS = [
  {
    key: 'S',
    cx: 360,
    cy: 214,
    r: 142,
    color: 'var(--lacan-borromean-s)',
    glow: 'var(--lacan-borromean-glow-s)',
    labelX: 360,
    labelY: 44,
    anchorX: 360,
    anchorY: 72,
  },
  {
    key: 'I',
    cx: 274,
    cy: 374,
    r: 142,
    color: 'var(--lacan-borromean-i)',
    glow: 'var(--lacan-borromean-glow-i)',
    labelX: 128,
    labelY: 500,
    anchorX: 168,
    anchorY: 452,
  },
  {
    key: 'R',
    cx: 446,
    cy: 374,
    r: 142,
    color: 'var(--lacan-borromean-r)',
    glow: 'var(--lacan-borromean-glow-r)',
    labelX: 592,
    labelY: 500,
    anchorX: 552,
    anchorY: 452,
  },
] as const

type Ring = (typeof RINGS)[number]
type RingKey = Ring['key']

const RING_BY_KEY = new Map<RingKey, Ring>(RINGS.map((ring) => [ring.key, ring]))
const BACKGROUND = 'var(--lacan-borromean-gap)'

const CROSSINGS: Array<{
  over: RingKey
  under: RingKey
  overAngle: number
  underAngle: number
}> = [
  { over: 'S', under: 'I', overAngle: 162.3, underAngle: -108.2 },
  { over: 'I', under: 'S', overAngle: -17.7, underAngle: 71.8 },
  { over: 'R', under: 'S', overAngle: -71.8, underAngle: 17.7 },
  { over: 'S', under: 'R', overAngle: 108.2, underAngle: -162.3 },
  { over: 'I', under: 'R', overAngle: -50.2, underAngle: -129.8 },
  { over: 'R', under: 'I', overAngle: 129.8, underAngle: 50.2 },
]

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  }
}

function describeArc(ring: Ring, angle: number, spread: number) {
  const start = polarToCartesian(ring.cx, ring.cy, ring.r, angle - spread)
  const end = polarToCartesian(ring.cx, ring.cy, ring.r, angle + spread)

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ring.r} ${ring.r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

interface BorromeanSvgProps {
  hoveredKey: RingKey | null
  isMobileViewport: boolean
  language: Language
  onHoverKey: (key: RingKey | null) => void
}

function BorromeanSvg({ hoveredKey, isMobileViewport, language, onHoverKey }: BorromeanSvgProps) {
  const baseStroke = isMobileViewport ? 16 : 18
  const activeStroke = isMobileViewport ? 21 : 24
  const gapStroke = isMobileViewport ? 34 : 38
  const casingStroke = isMobileViewport ? 26 : 30

  return (
    <svg
      viewBox="0 0 720 570"
      className={`borromean-diagram ${isMobileViewport ? 'borromean-diagram--mobile' : 'borromean-diagram--desktop'}`}
      role="img"
      aria-labelledby="borromean-title"
    >
      <title id="borromean-title">{uiCopy.borromean.svgTitle[language]}</title>

      <g className="borromean-aura" aria-hidden="true">
        <ellipse cx="360" cy="328" rx="268" ry="190" />
        <ellipse cx="360" cy="328" rx="202" ry="132" />
        <path d="M 360 86 L 360 506" />
        <path d="M 154 452 C 250 408 470 408 566 452" />
      </g>

      <motion.g initial={{ opacity: 0, scale: 0.965 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
        {RINGS.map((ring, i) => {
          const isActive = hoveredKey === ring.key
          const isDim = hoveredKey !== null && hoveredKey !== ring.key

          return (
            <g key={`ring-${ring.key}`}>
              <motion.circle
                cx={ring.cx}
                cy={ring.cy}
                r={ring.r}
                fill="none"
                stroke="var(--lacan-borromean-casing)"
                strokeWidth={casingStroke}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: isDim ? 0.2 : 0.42 }}
                transition={{ delay: 0.08 + i * 0.08, duration: 0.5 }}
              />
              <motion.circle
                cx={ring.cx}
                cy={ring.cy}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={isActive ? activeStroke : baseStroke}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isDim ? 0.34 : 1, strokeWidth: isActive ? activeStroke : baseStroke }}
                transition={{
                  pathLength: { delay: 0.12 + i * 0.12, duration: 1.05, ease: 'easeInOut' },
                  opacity: { duration: 0.28 },
                  strokeWidth: { duration: 0.28 },
                }}
                style={{
                  cursor: 'pointer',
                  filter: isActive ? `drop-shadow(0 10px 18px ${ring.glow})` : undefined,
                }}
                onClick={() => onHoverKey(isActive ? null : ring.key)}
                onPointerEnter={() => onHoverKey(ring.key)}
                onPointerLeave={() => onHoverKey(null)}
              />
            </g>
          )
        })}

        {CROSSINGS.map((crossing) => {
          const ring = RING_BY_KEY.get(crossing.under)!
          return (
            <path
              key={`gap-${crossing.under}-${crossing.underAngle}`}
              d={describeArc(ring, crossing.underAngle, 8.5)}
              fill="none"
              stroke={BACKGROUND}
              strokeWidth={gapStroke}
              strokeLinecap="round"
            />
          )
        })}

        {CROSSINGS.map((crossing) => {
          const ring = RING_BY_KEY.get(crossing.over)!
          const isActive = hoveredKey === crossing.over
          const isDim = hoveredKey !== null && hoveredKey !== crossing.over

          return (
            <g key={`over-${crossing.over}-${crossing.overAngle}`}>
              <path
                d={describeArc(ring, crossing.overAngle, 10)}
                fill="none"
                stroke="var(--lacan-borromean-casing)"
                strokeWidth={casingStroke}
                strokeLinecap="round"
                style={{ opacity: isDim ? 0.16 : 0.42, pointerEvents: 'none' }}
              />
              <motion.path
                d={describeArc(ring, crossing.overAngle, 10)}
                fill="none"
                stroke={ring.color}
                strokeWidth={isActive ? activeStroke + 2 : baseStroke + 2}
                strokeLinecap="round"
                animate={{ opacity: isDim ? 0.34 : 1, strokeWidth: isActive ? activeStroke + 2 : baseStroke + 2 }}
                transition={{ duration: 0.28 }}
                style={{
                  filter: isActive ? `drop-shadow(0 10px 18px ${ring.glow})` : undefined,
                  pointerEvents: 'none',
                }}
              />
            </g>
          )
        })}
      </motion.g>

      <g className="borromean-center" aria-hidden="true">
        <motion.circle
          cx="360"
          cy="326"
          r="28"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.45, ease: 'easeOut' }}
        />
        <motion.text
          x="360"
          y="328"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25, duration: 0.4 }}
        >
          a
        </motion.text>
      </g>

      <g className="borromean-labels">
        {RINGS.map((ring, i) => {
          const isActive = hoveredKey === ring.key
          const isDim = hoveredKey !== null && hoveredKey !== ring.key
          const labelWidth = language === 'en' ? 168 : 138
          const labelHeight = 50

          return (
            <motion.g
              key={`label-${ring.key}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isDim ? 0.45 : 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.45, ease: 'easeOut' }}
              onClick={() => onHoverKey(isActive ? null : ring.key)}
              onPointerEnter={() => onHoverKey(ring.key)}
              onPointerLeave={() => onHoverKey(null)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={`M ${ring.anchorX} ${ring.anchorY} L ${ring.labelX} ${ring.labelY}`}
                stroke={ring.color}
                strokeWidth="1"
                strokeDasharray="4 7"
                opacity={isActive ? 0.72 : 0.38}
              />
              <rect
                x={ring.labelX - labelWidth / 2}
                y={ring.labelY - labelHeight / 2}
                width={labelWidth}
                height={labelHeight}
                rx={8}
                fill="var(--lacan-borromean-label-surface)"
                stroke={ring.color}
                strokeWidth={isActive ? 1.4 : 0.8}
              />
              <text
                x={ring.labelX}
                y={ring.labelY + 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={ring.color}
                fontSize={language === 'en' ? 15 : 18}
                fontFamily="var(--lacan-title-font)"
                fontWeight="var(--lacan-title-weight)"
                letterSpacing="0.1em"
              >
                {uiCopy.borromean.rings[ring.key][language]}
              </text>
            </motion.g>
          )
        })}
      </g>
    </svg>
  )
}

export default function BorromeanKnot2D({ isMobileViewport, language }: BorromeanKnot2DProps) {
  const [hoveredKey, setHoveredKey] = useState<RingKey | null>(null)

  if (isMobileViewport) {
    return (
      <motion.div
        className="mobile-borromean-view borromean-view"
        data-testid="borromean-view"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mobile-page-heading">
          <h1
            className="lacan-page-title"
            style={{
              color: 'var(--lacan-ink-strong)',
              fontFamily: 'var(--lacan-title-font)',
              fontWeight: 'var(--lacan-title-weight)',
              textShadow: 'var(--lacan-title-shadow)',
            }}
          >
            {uiCopy.borromean.title[language]}
          </h1>
          <p className="lacan-page-subtitle" style={{ color: 'var(--lacan-muted)' }}>
            {uiCopy.borromean.subtitle[language]}
          </p>
        </div>

        <div className="mobile-borromean-stage borromean-stage">
          <BorromeanSvg hoveredKey={hoveredKey} isMobileViewport={isMobileViewport} language={language} onHoverKey={setHoveredKey} />
        </div>

        <p className="mobile-borromean-copy">
          {uiCopy.borromean.copy[language]}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="borromean-view borromean-view--desktop"
      data-testid="borromean-view"
      style={{ background: 'var(--lacan-paper)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="borromean-copy-block">
        <motion.h1
          className="lacan-page-title"
          style={{
            color: 'var(--lacan-ink-strong)',
            fontFamily: 'var(--lacan-title-font)',
            fontWeight: 'var(--lacan-title-weight)',
            textShadow: 'var(--lacan-title-shadow)',
          }}
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {uiCopy.borromean.title[language]}
        </motion.h1>
        <motion.p
          className="lacan-page-subtitle"
          style={{ color: 'var(--lacan-muted)' }}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.6, ease: 'easeOut' }}
        >
          {uiCopy.borromean.subtitle[language]}
        </motion.p>
      </div>

      <div className="borromean-stage">
        <BorromeanSvg hoveredKey={hoveredKey} isMobileViewport={isMobileViewport} language={language} onHoverKey={setHoveredKey} />
      </div>

      <motion.p
        className="borromean-desktop-copy"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.5, ease: 'easeOut' }}
      >
        {uiCopy.borromean.desktopCopyLine1[language]}
        <br />
        {uiCopy.borromean.desktopCopyLine2[language]}
      </motion.p>
    </motion.div>
  )
}
