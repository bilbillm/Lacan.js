import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Perspective Wireframe Room Component
function PerspectiveRoom() {
  const [showMediumLayer, setShowMediumLayer] = useState(false)
  const [showBlurLayer, setShowBlurLayer] = useState(false)

  useEffect(() => {
    let mediumFrameId = 0
    let blurFrameId = 0

    mediumFrameId = requestAnimationFrame(() => {
      setShowMediumLayer(true)

      blurFrameId = requestAnimationFrame(() => {
        setShowBlurLayer(true)
      })
    })

    return () => {
      cancelAnimationFrame(mediumFrameId)
      cancelAnimationFrame(blurFrameId)
    }
  }, [])

  // 动画时序
  const verticalDuration = 2
  const perspectiveDuration = 6
  const bottomDuration = 1

  // Subtle paper-room line work, aligned with the forum's quiet editorial tone.
  const glowFilter = [
    'var(--lacan-room-glow-rest)',
    'var(--lacan-room-glow-active)',
    'var(--lacan-room-glow-rest)',
  ]

  // Helper: 渲染所有线条
  const renderLines = () => (
    <>
      {/* 左垂直线 - 从上往下绘制 */}
      <motion.line
        x1="15" y1="0"
        x2="15" y2="75"
        stroke="var(--lacan-room-line)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
        stroke="var(--lacan-room-line)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
        stroke="var(--lacan-room-line)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
        stroke="var(--lacan-room-line)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
        stroke="var(--lacan-room-line-soft)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
        stroke="var(--lacan-room-line-soft)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'var(--lacan-room-glow-rest)' }}
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
      {showBlurLayer && (
        /* 底层 - 最模糊，边缘呈光晕散开 */
        <svg
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          style={{ filter: 'blur(5px)' }}
        >
          {renderLines()}
        </svg>
      )}

      {showMediumLayer && (
        /* 中层 - 轻微模糊 + 径向遮罩 */
        <svg
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
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
      )}

      {/* 顶层 - 清晰 + 紧凑遮罩 */}
      <svg
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
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
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'var(--lacan-paper)' }}>
      {/* Warm paper field with restrained scholarly depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'var(--lacan-environment-gradient)',
        }}
      />

      {/* Perspective wireframe room */}
      <PerspectiveRoom />

      {/* Paper edge depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'var(--lacan-environment-vignette)',
        }}
      />
    </div>
  )
}
