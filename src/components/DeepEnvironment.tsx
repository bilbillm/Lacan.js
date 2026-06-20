import { memo } from 'react'
import { motion } from 'framer-motion'

type RoomLineWeight = 'normal' | 'strong'

interface PerspectiveRoomProps {
  lineWeight: RoomLineWeight
}

interface DeepEnvironmentProps {
  lineWeight?: RoomLineWeight
}

// Perspective Wireframe Room Component
function PerspectiveRoom({ lineWeight }: PerspectiveRoomProps) {
  // 动画时序
  const verticalDuration = 2
  const perspectiveDuration = 6
  const bottomDuration = 1
  const primaryStrokeWidth = lineWeight === 'strong' ? 0.9 : 0.5
  const perspectiveStrokeWidth = lineWeight === 'strong' ? 1 : 0.6
  const softStrokeWidth = lineWeight === 'strong' ? 0.8 : 0.5

  // Helper: 渲染所有线条
  const renderLines = () => (
    <>
      {/* 左垂直线 - 从上往下绘制 */}
      <motion.line
        x1="15" y1="0"
        x2="15" y2="75"
        stroke="var(--lacan-room-line)"
        strokeWidth={primaryStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: verticalDuration, delay: 0.2, ease: 'easeInOut' },
        }}
      />

      {/* 右垂直线 - 从上往下绘制 */}
      <motion.line
        x1="85" y1="0"
        x2="85" y2="75"
        stroke="var(--lacan-room-line)"
        strokeWidth={primaryStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: verticalDuration, delay: 0.2, ease: 'easeInOut' },
        }}
      />

      {/* 左下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="3" y1="100"
        x2="15" y2="75"
        stroke="var(--lacan-room-line)"
        strokeWidth={perspectiveStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: perspectiveDuration, delay: 0.2, ease: 'easeOut' },
        }}
      />

      {/* 右下角透视线 - 从屏幕角落向后墙角落绘制 */}
      <motion.line
        x1="97" y1="100"
        x2="85" y2="75"
        stroke="var(--lacan-room-line)"
        strokeWidth={perspectiveStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: perspectiveDuration, delay: 0.2, ease: 'easeOut' },
        }}
      />

      {/* 底边横线左半段 - 从左向右绘制 */}
      <motion.line
        x1="15" y1="75"
        x2="50" y2="75"
        stroke="var(--lacan-room-line-soft)"
        strokeWidth={softStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: bottomDuration, delay: 1.5, ease: 'easeInOut' },
        }}
      />

      {/* 底边横线右半段 - 从右向左绘制 */}
      <motion.line
        x1="85" y1="75"
        x2="50" y2="75"
        stroke="var(--lacan-room-line-soft)"
        strokeWidth={softStrokeWidth}
        strokeDasharray="1000"
        strokeDashoffset="1000"
        vectorEffect="non-scaling-stroke"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          strokeDashoffset: { duration: bottomDuration, delay: 1.5, ease: 'easeInOut' },
        }}
      />
    </>
  )

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'var(--lacan-room-static-haze)',
        }}
      />

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

function DeepEnvironment({ lineWeight = 'normal' }: DeepEnvironmentProps) {
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
      <PerspectiveRoom lineWeight={lineWeight} />

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

export default memo(DeepEnvironment)
