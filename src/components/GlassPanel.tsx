import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface GlassPanelProps {
  children?: React.ReactNode
  width?: string | number
  height?: string | number
  className?: string
  layoutId?: string
  onClick?: () => void
  style?: React.CSSProperties
  disableParallax?: boolean
  deferVisualEnhancement?: boolean
}

export default function GlassPanel({
  children,
  width = 400,
  height = 300,
  className = '',
  layoutId,
  onClick,
  style,
  disableParallax = false,
  deferVisualEnhancement = false,
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
    [0, 0.05, 0.08, 0.05, 0]
  )

  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const rafIdRef = useRef<number | null>(null)
  const pendingMousePosRef = useRef<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return

    const rect = panelRef.current.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100

    pendingMousePosRef.current = { x: mouseX, y: mouseY }

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null

        const next = pendingMousePosRef.current
        if (!next) return

        pendingMousePosRef.current = null

        setMousePos(prev => {
          const deltaX = Math.abs(prev.x - next.x)
          const deltaY = Math.abs(prev.y - next.y)

          if (deltaX < 1.5 && deltaY < 1.5) {
            return prev
          }

          return next
        })
      })
    }

    if (disableParallax) return

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const parallaxX = e.clientX - rect.left - centerX
    const parallaxY = e.clientY - rect.top - centerY

    x.set(parallaxX / centerX)
    y.set(parallaxY / centerY)
  }, [disableParallax, x, y])

  const handleMouseLeave = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    pendingMousePosRef.current = null
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return (
    <motion.div
      ref={panelRef}
      layoutId={layoutId}
      className={`relative ${className}`}
      style={{ width, height, perspective: 1000, transformStyle: 'preserve-3d', ...style }}
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
          rotateX: disableParallax ? 0 : rotateX,
          rotateY: disableParallax ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main glass surface */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: deferVisualEnhancement ? 'blur(18px) saturate(125%)' : 'blur(28px) saturate(150%)',
            WebkitBackdropFilter: deferVisualEnhancement ? 'blur(18px) saturate(125%)' : 'blur(28px) saturate(150%)',
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

        {/* Noise texture layer */}
        {!deferVisualEnhancement && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none select-none z-10"
            style={{
              opacity: 0.035,
              mixBlendMode: 'overlay',
              backgroundImage: `
                radial-gradient(rgba(255,255,255,0.08) 0.6px, transparent 0.6px),
                radial-gradient(rgba(255,255,255,0.04) 0.5px, transparent 0.5px)
              `,
              backgroundPosition: '0 0, 8px 8px',
              backgroundSize: '16px 16px, 20px 20px',
            }}
          />
        )}

        {/* Dynamic light reflection - follows mouse position */}
        {isHovered && !deferVisualEnhancement && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 60%)`,
            }}
          />
        )}

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 80%)',
            opacity: glareOpacity,
          }}
        />

        {/* Inner content area */}
        <div className="absolute inset-6 rounded-xl overflow-hidden" style={{ transform: 'translateZ(10px)' }}>
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
