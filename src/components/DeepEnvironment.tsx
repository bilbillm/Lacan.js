import { motion } from 'framer-motion'

// Perspective Wireframe Room Component
function PerspectiveRoom() {
  // 动画时序
  const verticalDuration = 2
  const perspectiveDuration = 6
  const bottomDuration = 1

  // 呼吸光晕效果 - 线条绘制完成后开始
  const glowFilter = [
    'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
    'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
    'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
  ]

  // Helper: 渲染所有线条
  const renderLines = () => (
    <>
      {/* 左垂直线 - 从上往下绘制 */}
      <motion.line
        x1="15" y1="0"
        x2="15" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 右垂直线 - 从上往下绘制 */}
      <motion.line
        x1="85" y1="0"
        x2="85" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 左下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="3" y1="100"
        x2="15" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 右下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="97" y1="100"
        x2="85" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 底边横线左半段 - 从左向右绘制 */}
      <motion.line
        x1="15" y1="75"
        x2="50" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />

      {/* 底边横线右半段 - 从右向左绘制 */}
      <motion.line
        x1="85" y1="75"
        x2="50" y2="75"
        stroke="rgba(255, 255, 255, 0.7)"
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
          filter: { duration: 3, ease: 'easeInOut', repeat: Infinity },
        }}
      />
    </>
  )

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* 底层 - 最模糊，边缘呈光晕散开 */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ filter: 'blur(5px)' }}
      >
        {renderLines()}
      </svg>

      {/* 中层 - 轻微模糊 + 径向遮罩 */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{
          filter: 'blur(1px)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 90%)',
          maskImage: 'radial-gradient(circle at center, black 50%, transparent 90%)',
        }}
      >
        {renderLines()}
      </svg>

      {/* 顶层 - 清晰 + 紧凑遮罩 */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
        }}
      >
        {renderLines()}
      </svg>
    </div>
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

      {/* Perspective wireframe room */}
      <PerspectiveRoom />

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
