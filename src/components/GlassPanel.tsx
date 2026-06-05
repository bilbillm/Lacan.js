import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { GLASS_PANEL_RESPONSIVE_TOKENS } from './app/uiConstants'

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
  isMobileViewport?: boolean
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
  isMobileViewport = false,
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

  const paperSheenOpacity = useTransform(
    xSpring,
    [-0.5, -0.25, 0, 0.25, 0.5],
    [0, 0.04, 0.07, 0.04, 0]
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
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 0.5 },
        scale: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX: disableParallax ? 0 : rotateX,
          rotateY: disableParallax ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main paper surface */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,254,250,0.96) 0%, rgba(251,246,236,0.94) 100%)',
            border: '1px solid var(--lacan-border)',
            borderRadius: isMobileViewport ? 10 : 12,
            boxShadow: `
              var(--lacan-paper-shadow),
              inset 0 1px 0 rgba(255, 254, 250, 0.82)
            `,
          }}
        />

        {/* Gilded edge highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: isMobileViewport ? 10 : 12,
            background: 'linear-gradient(135deg, rgba(181,138,69,0.18) 0%, transparent 42%)',
          }}
        />

        {/* Noise texture layer */}
        {!deferVisualEnhancement && (
          <div
            className="absolute inset-0 pointer-events-none select-none z-10"
            style={{
              opacity: 0.18,
              borderRadius: isMobileViewport ? 10 : 12,
              mixBlendMode: 'multiply',
              backgroundImage: `
                radial-gradient(rgba(181,138,69,0.12) 0.5px, transparent 0.5px),
                radial-gradient(rgba(107,29,14,0.05) 0.4px, transparent 0.4px)
              `,
              backgroundPosition: '0 0, 8px 8px',
              backgroundSize: '16px 16px, 20px 20px',
            }}
          />
        )}

        {/* Dynamic light reflection - follows mouse position */}
        {isHovered && !deferVisualEnhancement && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: isMobileViewport ? 10 : 12,
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(181,138,69,0.12) 0%, rgba(255,254,250,0.26) 36%, transparent 66%)`,
            }}
          />
        )}

        {/* Paper sheen */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: isMobileViewport ? 10 : 12,
            background: 'radial-gradient(circle at 50% 45%, rgba(255,254,250,0.72) 0%, transparent 78%)',
            opacity: paperSheenOpacity,
          }}
        />

        {/* Inner content area */}
        <div
          className="absolute overflow-hidden"
          style={{
            inset: isMobileViewport
              ? GLASS_PANEL_RESPONSIVE_TOKENS.contentInset.mobile
              : GLASS_PANEL_RESPONSIVE_TOKENS.contentInset.desktop,
            borderRadius: isMobileViewport
              ? GLASS_PANEL_RESPONSIVE_TOKENS.contentRadius.mobile
              : GLASS_PANEL_RESPONSIVE_TOKENS.contentRadius.desktop,
            transform: 'translateZ(10px)',
          }}
        >
          {children || (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--lacan-muted-soft)' }}>
              <span className="text-sm font-light tracking-widest">CONTENT</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
