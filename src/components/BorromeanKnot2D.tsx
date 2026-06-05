import { useState } from 'react'
import { motion } from 'framer-motion'

interface BorromeanKnot2DProps {
  isMobileViewport: boolean
}

const RINGS = [
  { key: 'S', cx: 200, cy: 148, r: 75, color: 'rgba(96,165,250,0.85)', glow: 'rgba(96,165,250,0.4)', label: '符号界' },
  { key: 'I', cx: 152, cy: 242, r: 75, color: 'rgba(234,179,8,0.85)', glow: 'rgba(234,179,8,0.4)', label: '想象界' },
  { key: 'R', cx: 248, cy: 242, r: 75, color: 'rgba(220,72,72,0.85)', glow: 'rgba(220,72,72,0.4)', label: '实在界' },
]

export default function BorromeanKnot2D({ isMobileViewport }: BorromeanKnot2DProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  if (isMobileViewport) return null

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden"
      data-testid="borromean-view" style={{ background: 'rgb(5,5,7)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: 96 }}>
        <motion.h1
          className="text-center font-light text-white/70"
          style={{ fontSize: '2.35rem', letterSpacing: '0.35em', lineHeight: 0.96,
            textShadow: '0 0 8px rgba(255,255,255,0.3),0 0 25px rgba(255,255,255,0.15)' }}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >波罗米结</motion.h1>
        <motion.p
          className="text-center font-light text-white/40"
          style={{ fontSize: '1.125rem', letterSpacing: '0.35em',
            textShadow: '0 0 3px rgba(255,255,255,0.15),0 0 8px rgba(255,255,255,0.08)' }}
          initial={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >The RSI Interconnection</motion.p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <svg viewBox="0 0 400 440" className="w-full max-w-lg" style={{ maxHeight: '60vh' }}>
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
                  filter: isHov ? `drop-shadow(0 0 14px ${ring.glow})` : `drop-shadow(0 0 4px ${ring.glow})`,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredKey(ring.key)}
                onMouseLeave={() => setHoveredKey(null)}
              />
            )
          })}

          {RINGS.map((ring, i) => {
            const lx = i === 0 ? 200 : i === 1 ? 108 : 292
            const ly = i === 0 ? 78 : i === 1 ? 268 : 268
            return (
              <motion.g key={`lbl-${ring.key}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.6 }}>
                <rect x={lx - 38} y={ly - 17} width={76} height={34} rx={6}
                  fill="rgba(0,0,0,0.55)" stroke={ring.color} strokeWidth={0.5} />
                <text x={lx} y={ly + 2} textAnchor="middle" dominantBaseline="central"
                  fill="rgba(255,255,255,0.75)" fontSize={11}
                  fontFamily="Inter,system-ui,sans-serif" fontWeight={300} letterSpacing="0.08em">
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
        <p className="text-center font-light leading-relaxed text-white/35"
          style={{ fontSize: '0.85rem', letterSpacing: '0.04em', lineHeight: 1.9 }}>
          三枚完整圆环，两两不相连——但三者交织，任取其一，其余便散。
          <br />交叉处上下交替：每个环与另两环各交叉一次，形成拓扑锁合。
        </p>
      </motion.div>
    </motion.div>
  )
}
