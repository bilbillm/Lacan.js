import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Language } from '../i18n'
import { uiCopy } from '../i18n'

interface BorromeanKnot2DProps {
  isMobileViewport: boolean
  language: Language
}

const RINGS = [
  { key: 'S', cx: 200, cy: 148, r: 75, color: 'var(--lacan-borromean-s)', glow: 'var(--lacan-borromean-glow-s)' },
  { key: 'I', cx: 152, cy: 242, r: 75, color: 'var(--lacan-borromean-i)', glow: 'var(--lacan-borromean-glow-i)' },
  { key: 'R', cx: 248, cy: 242, r: 75, color: 'var(--lacan-borromean-r)', glow: 'var(--lacan-borromean-glow-r)' },
] as const

type RingKey = (typeof RINGS)[number]['key']

const RING_BY_KEY = new Map(RINGS.map((ring) => [ring.key, ring]))
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

function describeArc(ring: (typeof RINGS)[number], angle: number, spread: number) {
  const start = polarToCartesian(ring.cx, ring.cy, ring.r, angle - spread)
  const end = polarToCartesian(ring.cx, ring.cy, ring.r, angle + spread)

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ring.r} ${ring.r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

interface BorromeanSvgProps {
  hoveredKey: string | null
  isMobileViewport: boolean
  language: Language
  onHoverKey: (key: string | null) => void
}

function BorromeanSvg({ hoveredKey, isMobileViewport, language, onHoverKey }: BorromeanSvgProps) {
  return (
    <svg
      viewBox="0 0 400 440"
      className={isMobileViewport ? 'mobile-borromean-svg' : 'w-full max-w-lg'}
      style={isMobileViewport ? undefined : { maxHeight: '60vh' }}
      role="img"
      aria-labelledby="borromean-title"
    >
      <title id="borromean-title">{uiCopy.borromean.svgTitle[language]}</title>
      {RINGS.map((ring, i) => {
        const isHov = hoveredKey === ring.key
        const dim = hoveredKey !== null && hoveredKey !== ring.key
        return (
          <motion.circle
            key={ring.key}
            cx={ring.cx}
            cy={ring.cy}
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth={isHov ? 7 : 5}
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: dim ? 0.3 : 1, strokeWidth: isHov ? 7 : 5 }}
            transition={{ opacity: { delay: 0.3 + i * 0.35, duration: 0.8 }, strokeWidth: { duration: 0.3 } }}
            style={{
              filter: isHov ? `drop-shadow(0 4px 8px ${ring.glow})` : undefined,
              cursor: 'pointer',
            }}
            onClick={() => onHoverKey(isHov ? null : ring.key)}
            onMouseEnter={() => onHoverKey(ring.key)}
            onMouseLeave={() => onHoverKey(null)}
          />
        )
      })}

      {CROSSINGS.map((crossing) => {
        const ring = RING_BY_KEY.get(crossing.under)!
        return (
          <path
            key={`gap-${crossing.under}-${crossing.underAngle}`}
            d={describeArc(ring, crossing.underAngle, 8)}
            fill="none"
            stroke={BACKGROUND}
            strokeWidth={16}
            strokeLinecap="round"
          />
        )
      })}

      {CROSSINGS.map((crossing) => {
        const ring = RING_BY_KEY.get(crossing.over)!
        const isHov = hoveredKey === crossing.over
        const dim = hoveredKey !== null && hoveredKey !== crossing.over

        return (
          <motion.path
            key={`over-${crossing.over}-${crossing.overAngle}`}
            d={describeArc(ring, crossing.overAngle, 9)}
            fill="none"
            stroke={ring.color}
            strokeWidth={isHov ? 8 : 6}
            strokeLinecap="round"
            animate={{ opacity: dim ? 0.3 : 1, strokeWidth: isHov ? 8 : 6 }}
            transition={{ duration: 0.3 }}
            style={{
              filter: isHov ? `drop-shadow(0 4px 8px ${ring.glow})` : undefined,
              pointerEvents: 'none',
            }}
          />
        )
      })}

      {RINGS.map((ring, i) => {
        const lx = i === 0 ? 200 : i === 1 ? 108 : 292
        const ly = i === 0 ? 78 : i === 1 ? 268 : 268
        const labelWidth = language === 'en' ? 92 : 76
        const labelFontSize = language === 'en' ? 10 : 11
        return (
          <motion.g key={`lbl-${ring.key}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
            <rect
              x={lx - labelWidth / 2}
              y={ly - 17}
              width={labelWidth}
              height={34}
              rx={6}
              fill="var(--lacan-borromean-label-surface)"
              stroke={ring.color}
              strokeWidth={0.8}
            />
            <text
              x={lx}
              y={ly + 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--lacan-ink)"
              fontSize={labelFontSize}
              fontFamily="var(--lacan-title-font)"
              fontWeight="var(--lacan-title-weight)"
              letterSpacing="0.08em"
            >
              {uiCopy.borromean.rings[ring.key][language]}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

export default function BorromeanKnot2D({ isMobileViewport, language }: BorromeanKnot2DProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  if (isMobileViewport) {
    return (
      <motion.div
        className="mobile-borromean-view"
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

        <div className="mobile-borromean-stage">
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
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden"
      data-testid="borromean-view"
      style={{ background: 'var(--lacan-paper)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: 96 }}>
        <motion.h1
          className="lacan-page-title text-center"
          style={{
            fontSize: '2.35rem',
            letterSpacing: '0.35em',
            lineHeight: 0.96,
            color: 'var(--lacan-ink-strong)',
            fontFamily: 'var(--lacan-title-font)',
            fontWeight: 'var(--lacan-title-weight)',
            textShadow: 'var(--lacan-title-shadow)',
          }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {uiCopy.borromean.title[language]}
        </motion.h1>
        <motion.p
          className="lacan-page-subtitle text-center font-light"
          style={{ fontSize: '1.125rem', letterSpacing: '0.35em', color: 'var(--lacan-muted)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          {uiCopy.borromean.subtitle[language]}
        </motion.p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <BorromeanSvg hoveredKey={hoveredKey} isMobileViewport={isMobileViewport} language={language} onHoverKey={setHoveredKey} />
      </div>

      <motion.div
        className="w-full max-w-lg px-8 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6, ease: 'easeOut' }}
      >
        <p
          className="text-center font-light leading-relaxed"
          style={{ fontSize: '0.85rem', letterSpacing: '0.04em', lineHeight: 1.9, color: 'var(--lacan-muted)' }}
        >
          {uiCopy.borromean.desktopCopyLine1[language]}
          <br />{uiCopy.borromean.desktopCopyLine2[language]}
        </p>
      </motion.div>
    </motion.div>
  )
}
