import { motion } from 'framer-motion'

interface ScrollIndicatorProps {
  /** true = timeline (slide 2), false = gallery (slide 1) */
  timelineActive: boolean
}

const slides = [0, 1]

export default function ScrollIndicator({ timelineActive }: ScrollIndicatorProps) {
  return (
    <motion.div
      data-testid="scroll-indicator"
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 32,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        pointerEvents: 'none',
        zIndex: 15,
      }}
    >
      {slides.map((slide) => {
        const isActive = (slide === 0 && !timelineActive) || (slide === 1 && timelineActive)
        return (
          <motion.div
            key={slide}
            animate={{
              width: isActive ? 8 : 5,
              height: isActive ? 8 : 5,
              opacity: isActive ? 1 : 0.35,
              background: isActive
                ? 'rgba(255, 255, 255, 0.6)'
                : 'rgba(255, 255, 255, 0.3)',
              boxShadow: isActive
                ? '0 0 8px rgba(255, 255, 255, 0.35)'
                : '0 0 0px rgba(255, 255, 255, 0)',
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            style={{
              borderRadius: '50%',
            }}
          />
        )
      })}
    </motion.div>
  )
}
