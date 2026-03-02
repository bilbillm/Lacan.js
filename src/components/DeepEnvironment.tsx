import { motion } from 'framer-motion'

interface GlowHazeConfig {
  id: number
  initialX: number
  initialY: number
  size: number
  intensity: number
  duration: number
  delay: number
  color: string
}

const glowHazes: GlowHazeConfig[] = [
  { id: 1, initialX: 25, initialY: 25, size: 600, intensity: 0.3, duration: 35, delay: 0, color: '255,255,255' },
  { id: 2, initialX: 70, initialY: 30, size: 500, intensity: 0.28, duration: 40, delay: 5, color: '245,245,250' },
  { id: 3, initialX: 50, initialY: 70, size: 550, intensity: 0.25, duration: 38, delay: 10, color: '255,255,255' },
  { id: 4, initialX: 80, initialY: 60, size: 450, intensity: 0.27, duration: 42, delay: 3, color: '240,240,245' },
]

// SVG Noise as data URI - creates subtle grain texture to eliminate banding
const svgNoiseDataUri = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`

function GlowHaze({ haze }: { haze: GlowHazeConfig }) {
  const { size, intensity, initialX, initialY, color, duration, delay } = haze

  // Use rgba with alpha channel - ending with same color at 0 opacity to avoid banding
  const gradient = `radial-gradient(circle,
    rgba(${color}, ${intensity}) 0%,
    rgba(${color}, ${intensity * 0.7}) 30%,
    rgba(${color}, ${intensity * 0.3}) 60%,
    rgba(${color}, 0) 100%
  )`

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: `${initialX}%`,
        top: `${initialY}%`,
        background: gradient,
        transform: 'translate(-50%, -50%) translateZ(0)',
        filter: 'blur(50px)',
        willChange: 'transform, opacity',
      }}
      animate={{
        x: [0, 30, 15, -20, 0],
        y: [0, -25, -40, -15, 0],
        scale: [1, 1.08, 1.04, 0.96, 1],
        opacity: [intensity * 0.85, intensity, intensity * 1.05, intensity * 0.92, intensity * 0.85],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// SVG Dithering overlay component - uses pseudo-element with SVG noise
function DitheringOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("${svgNoiseDataUri}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// Perspective Wireframe Room Component
function PerspectiveRoom() {
  // 当前动画时序
  // 垂直线: delay 0.2s, duration 2s, easeInOut
  // 透视线: delay 0.2s, duration 6s, easeOut
  // 底边线: delay 1.5s, duration 1s, easeInOut
  const verticalDuration = 2
  const perspectiveDuration = 6
  const bottomDuration = 1

  // 呼吸光晕效果 - 线条绘制完成后开始
  const glowFilter = [
    'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
    'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
    'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
  ]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* 左垂直线 - 从上往下绘制 */}
      <motion.line
        x1="15" y1="0"
        x2="15" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: verticalDuration, delay: 0.2, ease: 'easeInOut' },
          filter: { duration: 3, delay: 2.7, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 右垂直线 - 从上往下绘制 */}
      <motion.line
        x1="85" y1="0"
        x2="85" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: verticalDuration, delay: 0.2, ease: 'easeInOut' },
          filter: { duration: 3, delay: 2.7, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 左下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="3" y1="100"
        x2="15" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: perspectiveDuration, delay: 0.2, ease: 'easeOut' },
          filter: { duration: 3, delay: 3.3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 右下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="97" y1="100"
        x2="85" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: perspectiveDuration, delay: 0.2, ease: 'easeOut' },
          filter: { duration: 3, delay: 3.5, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 底边横线左半段 - 从左向右绘制 */}
      <motion.line
        x1="15" y1="75"
        x2="50" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: bottomDuration, delay: 1.5, ease: 'easeInOut' },
          filter: { duration: 3, delay: 4.2, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 底边横线右半段 - 从右向左绘制 */}
      <motion.line
        x1="85" y1="75"
        x2="50" y2="75"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(255,255,255,0))' }}
        animate={{
          strokeDashoffset: 0,
          filter: glowFilter,
        }}
        transition={{
          strokeDashoffset: { duration: bottomDuration, delay: 1.5, ease: 'easeInOut' },
          filter: { duration: 3, delay: 4.2, ease: 'easeInOut', repeat: Infinity },
        }}
      />
    </svg>
  )
}

export default function DeepEnvironment() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'rgb(5, 5, 7)' }}>
      {/* Deep black background with subtle gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, oklch(0.08 0 0 / 0.5) 0%, oklch(0.02 0 0 / 0.3) 60%)',
        }}
      />

      {/* Floating soft glow hazes */}
      {glowHazes.map((haze) => (
        <GlowHaze key={haze.id} haze={haze} />
      ))}

      {/* Perspective wireframe room */}
      <PerspectiveRoom />

      {/* SVG Dithering overlay - eliminates color banding */}
      <DitheringOverlay />

      {/* Vignette with proper alpha channel - allows light to bleed through */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, oklch(0 0 0 / 0) 40%, oklch(0 0 0 / 0.6) 100%)',
        }}
      />
    </div>
  )
}
