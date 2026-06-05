import { motion } from 'framer-motion'

interface ScrollIndicatorProps {
  currentSlide: number
  totalSlides: number
}

export default function ScrollIndicator({ currentSlide, totalSlides }: ScrollIndicatorProps) {
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
      {Array.from({ length: totalSlides }, (_, slide) => {
        const isActive = slide === currentSlide
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
