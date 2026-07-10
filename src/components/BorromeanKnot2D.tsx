import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { KeyboardEvent } from 'react'
import type { Language } from '../i18n'
import { uiCopy } from '../i18n'

interface BorromeanKnot2DProps {
  language: Language
}

const rings = [
  { key: 'S', cx: 360, cy: 202, r: 142, className: 'borromean-ring--symbolic', labelX: 360, labelY: 34 },
  { key: 'I', cx: 274, cy: 362, r: 142, className: 'borromean-ring--imaginary', labelX: 98, labelY: 472 },
  { key: 'R', cx: 446, cy: 362, r: 142, className: 'borromean-ring--real', labelX: 622, labelY: 472 },
] as const

type RingKey = (typeof rings)[number]['key']
type Ring = (typeof rings)[number]
type CrossingSelector = 'left' | 'right' | 'top' | 'bottom'

interface Point {
  x: number
  y: number
}

interface CrossingSpec {
  over: RingKey
  under: RingKey
  selector: CrossingSelector
}

const ringByKey = new Map<RingKey, Ring>(rings.map((ring) => [ring.key, ring]))
const GAP_HALF_ARC_LENGTH = 13
const OVERPASS_HALF_ARC_LENGTH = 24

const crossingSpecs: CrossingSpec[] = [
  { over: 'S', under: 'I', selector: 'left' },
  { over: 'I', under: 'S', selector: 'right' },
  { over: 'R', under: 'S', selector: 'right' },
  { over: 'S', under: 'R', selector: 'left' },
  { over: 'I', under: 'R', selector: 'top' },
  { over: 'R', under: 'I', selector: 'bottom' },
]

function getRing(key: RingKey) {
  const ring = ringByKey.get(key)
  if (!ring) throw new Error(`Unknown Borromean ring: ${key}`)
  return ring
}

function getCircleIntersections(first: Ring, second: Ring): [Point, Point] {
  const dx = second.cx - first.cx
  const dy = second.cy - first.cy
  const distance = Math.hypot(dx, dy)
  const along = ((first.r ** 2) - (second.r ** 2) + (distance ** 2)) / (2 * distance)
  const perpendicular = Math.sqrt(Math.max((first.r ** 2) - (along ** 2), 0))
  const midpointX = first.cx + (along * dx) / distance
  const midpointY = first.cy + (along * dy) / distance
  const offsetX = (-dy * perpendicular) / distance
  const offsetY = (dx * perpendicular) / distance

  return [
    { x: midpointX + offsetX, y: midpointY + offsetY },
    { x: midpointX - offsetX, y: midpointY - offsetY },
  ]
}

function selectIntersection(points: [Point, Point], selector: CrossingSelector) {
  const [first, second] = points
  if (selector === 'left') return first.x <= second.x ? first : second
  if (selector === 'right') return first.x >= second.x ? first : second
  if (selector === 'top') return first.y <= second.y ? first : second
  return first.y >= second.y ? first : second
}

function angleAtPoint(ring: Ring, point: Point) {
  return (Math.atan2(point.y - ring.cy, point.x - ring.cx) * 180) / Math.PI
}

const crossings = crossingSpecs.map((spec) => {
  const overRing = getRing(spec.over)
  const underRing = getRing(spec.under)
  const point = selectIntersection(getCircleIntersections(overRing, underRing), spec.selector)
  return {
    ...spec,
    overAngle: angleAtPoint(overRing, point),
  }
})

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) }
}

function describeArc(ring: Ring, angle: number, halfArcLength: number) {
  const spread = (halfArcLength / ring.r) * (180 / Math.PI)
  const start = polarToCartesian(ring.cx, ring.cy, ring.r, angle - spread)
  const end = polarToCartesian(ring.cx, ring.cy, ring.r, angle + spread)
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${ring.r} ${ring.r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

export default function BorromeanKnot2D({ language }: BorromeanKnot2DProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [selectedRing, setSelectedRing] = useState<RingKey | null>(null)
  const [hoveredRing, setHoveredRing] = useState<RingKey | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 82%', 'center 46%'] })
  const drawnPathLength = useTransform(scrollYProgress, [0, 0.78], [0, 1])
  const pathLength = reduceMotion ? 1 : drawnPathLength
  const activeRing = hoveredRing ?? selectedRing

  const toggleRing = (key: RingKey) => {
    setSelectedRing((current) => current === key ? null : key)
  }

  const handleRingKeyDown = (event: KeyboardEvent<SVGCircleElement>, key: RingKey) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleRing(key)
    }
  }

  const activeCopy = activeRing ? uiCopy.borromean.rings[activeRing] : null

  return (
    <section ref={sectionRef} id="borromean" className="page-section borromean-section" data-section="borromean" data-testid="borromean-view" aria-labelledby="borromean-title">
      <div className="borromean-heading">
        <span className="section-number">{uiCopy.borromean.sectionNumber}</span>
        <p className="section-eyebrow">{uiCopy.borromean.eyebrow[language]}</p>
        <h2 id="borromean-title">{uiCopy.borromean.title[language]}</h2>
        <p>{uiCopy.borromean.subtitle[language]}</p>
      </div>

      <div className="borromean-layout">
        <div className="borromean-stage">
          <svg viewBox="0 0 720 540" role="img" aria-labelledby="borromean-svg-title">
            <title id="borromean-svg-title">{uiCopy.borromean.svgTitle[language]}</title>
            <g className="borromean-construction" aria-hidden="true">
              <circle cx="360" cy="300" r="214" />
              <path d="M68 300 H652" />
              <path d="M360 22 V518" />
            </g>

            {rings.map((ring, index) => {
              const selected = activeRing === ring.key
              const dimmed = activeRing !== null && !selected
              return (
                <motion.circle
                  key={ring.key}
                  className={`borromean-ring ${ring.className}${dimmed ? ' borromean-ring--dimmed' : ''}`}
                  data-testid={`borromean-ring-${ring.key}`}
                  cx={ring.cx}
                  cy={ring.cy}
                  r={ring.r}
                  fill="none"
                  pathLength={1}
                  style={{ pathLength }}
                  animate={{ strokeWidth: selected ? 22 : 15 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.04, duration: reduceMotion ? 0 : 0.28 }}
                  role="button"
                  tabIndex={0}
                  aria-label={uiCopy.borromean.rings[ring.key].label[language]}
                  aria-pressed={selectedRing === ring.key}
                  onPointerEnter={() => setHoveredRing(ring.key)}
                  onPointerLeave={() => setHoveredRing(null)}
                  onClick={() => toggleRing(ring.key)}
                  onKeyDown={(event) => handleRingKeyDown(event, ring.key)}
                />
              )
            })}

            {crossings.map((crossing) => {
              const ring = getRing(crossing.over)
              return <path key={`gap-${crossing.over}-${crossing.under}-${crossing.selector}`} className="borromean-gap" d={describeArc(ring, crossing.overAngle, GAP_HALF_ARC_LENGTH)} />
            })}

            {crossings.map((crossing) => {
              const ring = getRing(crossing.over)
              const selected = activeRing === crossing.over
              const dimmed = activeRing !== null && !selected
              return (
                <motion.path
                  key={`over-${crossing.over}-${crossing.overAngle}`}
                  className={`borromean-ring ${ring.className} borromean-overpass${dimmed ? ' borromean-ring--dimmed' : ''}`}
                  d={describeArc(ring, crossing.overAngle, OVERPASS_HALF_ARC_LENGTH)}
                  pathLength={1}
                  style={{ pathLength }}
                  animate={{ strokeWidth: selected ? 22 : 15 }}
                  transition={{ delay: reduceMotion ? 0 : 0.08, duration: reduceMotion ? 0 : 0.28 }}
                />
              )
            })}

            {rings.map((ring) => (
              <g key={`label-${ring.key}`} className="borromean-svg-label" aria-hidden="true">
                <text x={ring.labelX} y={ring.labelY}>{ring.key}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="borromean-reading" aria-live="polite">
          <span>{uiCopy.borromean.selectRing[language]}</span>
          <motion.div key={activeRing ?? 'overview'} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3>{activeCopy ? activeCopy.title[language] : 'S · I · R'}</h3>
            <p>{activeCopy ? activeCopy.body[language] : uiCopy.borromean.subtitle[language]}</p>
          </motion.div>
          <div className="borromean-controls" role="group" aria-label={uiCopy.borromean.selectRing[language]}>
            {rings.map((ring) => (
              <button key={ring.key} type="button" aria-pressed={selectedRing === ring.key} onClick={() => toggleRing(ring.key)}>
                <span>{ring.key}</span>
                {uiCopy.borromean.rings[ring.key].label[language]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
