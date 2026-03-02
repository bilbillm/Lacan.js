import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface GlassPanelProps {
  children?: React.ReactNode
  width?: string | number
  height?: string | number
  className?: string
  layoutId?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function GlassPanel({
  children,
  width = 400,
  height = 300,
  className = '',
  layoutId,
  onClick,
  style
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Mouse position for parallax
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth movement
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

  // Rotate transform based on mouse position
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10])

  // Glare effect opacity
  const glareOpacity = useTransform(
    xSpring,
    [-0.5, -0.25, 0, 0.25, 0.5],
    [0, 0.1, 0.2, 0.1, 0]
  )

  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return

    const rect = panelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const mouseX = e.clientX - rect.left - centerX
    const mouseY = e.clientY - rect.top - centerY

    x.set(mouseX / centerX)
    y.set(mouseY / centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={panelRef}
      layoutId={layoutId}
      className={`relative ${className}`}
      style={{ width, height, perspective: 1000, ...style }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 0.5 },
        scale: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main glass surface */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `
              0 4px 24px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.2)
            `,
          }}
        />

        {/* Edge highlight - simple gradient */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            opacity: glareOpacity,
          }}
        />

        {/* Inner content area */}
        <div className="absolute inset-6 rounded-xl overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
          {/* Content glow - radial light emanating from center */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 30%, transparent 70%)',
            }}
          />
          {children || (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <span className="text-sm font-light tracking-widest">CONTENT</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
