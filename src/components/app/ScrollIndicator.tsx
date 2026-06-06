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
                ? 'var(--lacan-vermilion)'
                : 'rgba(181, 138, 69, 0.45)',
              boxShadow: isActive
                ? '0 4px 10px rgba(107, 29, 14, 0.22)'
                : '0 0 0px rgba(107, 29, 14, 0)',
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
