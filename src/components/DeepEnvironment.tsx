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
    'drop-shadow(0 0 0 rgba(181,138,69,0))',
    'drop-shadow(0 1px 2px rgba(181,138,69,0.18))',
    'drop-shadow(0 0 0 rgba(181,138,69,0))',
  ]

  // Helper: 渲染所有线条
  const renderLines = () => (
    <>
      {/* 左垂直线 - 从上往下绘制 */}
      <motion.line
        x1="15" y1="0"
        x2="15" y2="75"
        stroke="rgba(107, 29, 14, 0.22)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
        stroke="rgba(107, 29, 14, 0.22)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
        stroke="rgba(107, 29, 14, 0.22)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
        stroke="rgba(107, 29, 14, 0.22)"
        strokeWidth="0.6"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
        stroke="rgba(181, 138, 69, 0.2)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
        stroke="rgba(181, 138, 69, 0.2)"
        strokeWidth="0.5"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000, filter: 'drop-shadow(0 0 0px rgba(181,138,69,0))' }}
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
          background:
            'radial-gradient(ellipse 80% 60% at 50% 4%, rgba(255,254,250,0.92) 0%, rgba(248,242,232,0.84) 45%, rgba(239,226,207,0.56) 100%)',
        }}
      />

      {/* Perspective wireframe room */}
      <PerspectiveRoom />

      {/* Paper edge depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,254,250,0) 44%, rgba(181,138,69,0.12) 100%)',
        }}
      />
    </div>
  )
}
