import { motion } from 'framer-motion'
import {
  HEADER_SUBTITLE_DURATION_MS,
  HEADER_SUBTITLE_STAGGER_MS,
  HEADER_TITLE_DURATION_MS,
} from './uiConstants'

interface AppHeaderProps {
  selectedId: string | null
  shouldAnimateEntry: boolean
  entryDelayMs: number
}

// Global Header Variants - h1 标题
const h1Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
    y: -30,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    textShadow: [
      '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
      '0 0 8px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.12)',
      '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
    ],
  },
  blurred: {
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.95,
  },
}

// Global Header Variants - p 副标题
const pVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(8px)',
    y: -20,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    textShadow: [
      '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
      '0 0 5px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.12)',
      '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
    ],
  },
  blurred: {
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.95,
  },
}

export default function AppHeader({ selectedId, shouldAnimateEntry, entryDelayMs }: AppHeaderProps) {
  const entryDelaySeconds = entryDelayMs / 1000

  return (
    <motion.div
      className={`absolute top-12 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none ${selectedId ? 'z-0' : 'z-10'}`}
      animate={selectedId ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="text-[2.35rem] font-light tracking-[0.35em] text-white/70 leading-none"
        initial="initial"
        variants={h1Variants}
        animate={selectedId ? 'blurred' : 'visible'}
        transition={{
          opacity: shouldAnimateEntry
            ? { delay: entryDelaySeconds, duration: HEADER_TITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          filter: shouldAnimateEntry
            ? { delay: entryDelaySeconds, duration: HEADER_TITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          y: shouldAnimateEntry
            ? { delay: entryDelaySeconds, duration: HEADER_TITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          scale: { duration: 0.4 },
          textShadow: { duration: 4, ease: 'easeInOut', repeat: Infinity },
        }}
      >
        LACAN.JS
      </motion.h1>
      <motion.p
        className="text-lg font-light tracking-[0.35em] text-white/40"
        initial="initial"
        variants={pVariants}
        animate={selectedId ? 'blurred' : 'visible'}
        transition={{
          opacity: shouldAnimateEntry
            ? { delay: entryDelaySeconds + HEADER_SUBTITLE_STAGGER_MS / 1000, duration: HEADER_SUBTITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          filter: shouldAnimateEntry
            ? { delay: entryDelaySeconds + HEADER_SUBTITLE_STAGGER_MS / 1000, duration: HEADER_SUBTITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          y: shouldAnimateEntry
            ? { delay: entryDelaySeconds + HEADER_SUBTITLE_STAGGER_MS / 1000, duration: HEADER_SUBTITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          scale: { duration: 0.4 },
          textShadow: { duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 0.5 },
        }}
      >
        The Spatial Architecture of Psychoanalysis
      </motion.p>
    </motion.div>
  )
}
