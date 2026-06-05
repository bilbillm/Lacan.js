import { useState } from 'react'
import { motion } from 'framer-motion'

interface BorromeanKnot2DProps {
  isMobileViewport: boolean
}

const RINGS = [
  { key: 'S', cx: 200, cy: 148, r: 75, color: '#6b1d0e', glow: 'rgba(107,29,14,0.18)', label: '符号界' },
  { key: 'I', cx: 152, cy: 242, r: 75, color: '#b58a45', glow: 'rgba(181,138,69,0.2)', label: '想象界' },
  { key: 'R', cx: 248, cy: 242, r: 75, color: '#1a1613', glow: 'rgba(26,22,19,0.12)', label: '实在界' },
] as const

type RingKey = (typeof RINGS)[number]['key']

const RING_BY_KEY = new Map(RINGS.map((ring) => [ring.key, ring]))
const BACKGROUND = '#f8f2e8'

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

export default function BorromeanKnot2D({ isMobileViewport }: BorromeanKnot2DProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  if (isMobileViewport) return null

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden"
      data-testid="borromean-view" style={{ background: 'var(--lacan-paper)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: 96 }}>
        <motion.h1
          className="text-center"
          style={{ fontSize: '2.35rem', letterSpacing: '0.35em', lineHeight: 0.96,
            color: 'var(--lacan-ink-strong)', fontFamily: 'var(--lacan-title-font)', fontWeight: 700,
            textShadow: '0 1px 0 rgba(255,254,250,0.82)' }}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >波罗米结</motion.h1>
        <motion.p
          className="text-center font-light"
          style={{ fontSize: '1.125rem', letterSpacing: '0.35em',
            color: 'var(--lacan-muted)' }}
          initial={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >The RSI Interconnection</motion.p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <svg
          viewBox="0 0 400 440"
          className="w-full max-w-lg"
          style={{ maxHeight: '60vh' }}
          role="img"
          aria-labelledby="borromean-title"
        >
          <title id="borromean-title">波罗米结：符号界、想象界、实在界交错锁合</title>
          {RINGS.map((ring, i) => {
            const isHov = hoveredKey === ring.key
            const dim = hoveredKey !== null && hoveredKey !== ring.key
            return (
              <motion.circle
                key={ring.key}
                cx={ring.cx} cy={ring.cy} r={ring.r}
                fill="none" stroke={ring.color}
                strokeWidth={isHov ? 7 : 5}
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: dim ? 0.3 : 1, strokeWidth: isHov ? 7 : 5 }}
                transition={{ opacity: { delay: 0.3 + i * 0.35, duration: 0.8 }, strokeWidth: { duration: 0.3 } }}
                style={{
                  filter: isHov ? `drop-shadow(0 6px 10px ${ring.glow})` : `drop-shadow(0 2px 3px ${ring.glow})`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredKey(ring.key)}
                onMouseLeave={() => setHoveredKey(null)}
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
                  filter: isHov ? `drop-shadow(0 6px 10px ${ring.glow})` : `drop-shadow(0 2px 3px ${ring.glow})`,
                  pointerEvents: 'none',
                }}
              />
            )
          })}

          {RINGS.map((ring, i) => {
            const lx = i === 0 ? 200 : i === 1 ? 108 : 292
            const ly = i === 0 ? 78 : i === 1 ? 268 : 268
            return (
              <motion.g key={`lbl-${ring.key}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
                <rect x={lx - 38} y={ly - 17} width={76} height={34} rx={6}
                  fill="rgba(255,254,250,0.86)" stroke={ring.color} strokeWidth={0.8} />
                <text x={lx} y={ly + 2} textAnchor="middle" dominantBaseline="central"
                  fill="var(--lacan-ink)" fontSize={11}
                  fontFamily="var(--lacan-title-font)" fontWeight={700} letterSpacing="0.08em">
                  {ring.label}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      <motion.div className="w-full max-w-lg px-8 pb-12"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6, ease: 'easeOut' }}>
        <p className="text-center font-light leading-relaxed"
          style={{ fontSize: '0.85rem', letterSpacing: '0.04em', lineHeight: 1.9, color: 'var(--lacan-muted)' }}>
          三枚完整圆环，两两不相连——但三者交织，任取其一，其余便散。
          <br />交叉处上下交替：每个环与另两环各交叉一次，形成拓扑锁合。
        </p>
      </motion.div>
    </motion.div>
  )
}
