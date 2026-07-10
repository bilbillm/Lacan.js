import { motion, useScroll } from 'framer-motion'

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="reading-progress" data-testid="reading-progress" aria-hidden="true">
      <motion.span
        className="reading-progress-bar"
        data-testid="reading-progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  )
}
