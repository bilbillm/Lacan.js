import { motion } from 'framer-motion'
import { useMemo, type CSSProperties } from 'react'
import {
  HEADER_RESPONSIVE_TOKENS,
  HEADER_SUBTITLE_DURATION_MS,
  HEADER_SUBTITLE_STAGGER_MS,
  HEADER_TITLE_DURATION_MS,
} from './uiConstants'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'

interface AppHeaderProps {
  selectedId: string | null
  shouldAnimateEntry: boolean
  entryDelayMs: number
  isMobileViewport: boolean
  language: Language
}

// Global Header Variants - h1 标题
const h1Variants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  blurred: {
    opacity: 0,
    scale: 0.95,
  },
}

// Global Header Variants - p 副标题
const pVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  blurred: {
    opacity: 0,
    scale: 0.95,
  },
}

export default function AppHeader({ selectedId, shouldAnimateEntry, entryDelayMs, isMobileViewport, language }: AppHeaderProps) {
  const entryDelaySeconds = entryDelayMs / 1000

  const containerStyle = useMemo<CSSProperties>(() => (
    isMobileViewport
      ? {
          maxWidth: HEADER_RESPONSIVE_TOKENS.containerMaxWidth.mobile,
          paddingInline: '0.25rem',
          marginInline: 'auto',
        }
      : {
          maxWidth: HEADER_RESPONSIVE_TOKENS.containerMaxWidth.desktop,
        }
  ), [isMobileViewport])

  const titleStyle = useMemo<CSSProperties>(() => ({
    fontSize: isMobileViewport
      ? HEADER_RESPONSIVE_TOKENS.titleFontSize.mobile
      : HEADER_RESPONSIVE_TOKENS.titleFontSize.desktop,
    letterSpacing: isMobileViewport
      ? HEADER_RESPONSIVE_TOKENS.titleTracking.mobile
      : HEADER_RESPONSIVE_TOKENS.titleTracking.desktop,
    lineHeight: 0.96,
    color: 'var(--lacan-ink-strong)',
    fontFamily: 'var(--lacan-title-font)',
    fontWeight: 'var(--lacan-title-weight)',
    textShadow: 'var(--lacan-title-shadow)',
  }), [isMobileViewport])

  const subtitleStyle = useMemo<CSSProperties>(() => ({
    fontSize: isMobileViewport
      ? HEADER_RESPONSIVE_TOKENS.subtitleFontSize.mobile
      : HEADER_RESPONSIVE_TOKENS.subtitleFontSize.desktop,
    letterSpacing: isMobileViewport
      ? HEADER_RESPONSIVE_TOKENS.subtitleTracking.mobile
      : HEADER_RESPONSIVE_TOKENS.subtitleTracking.desktop,
    maxWidth: isMobileViewport
      ? HEADER_RESPONSIVE_TOKENS.subtitleMaxWidth.mobile
      : HEADER_RESPONSIVE_TOKENS.subtitleMaxWidth.desktop,
    lineHeight: isMobileViewport ? 1.45 : undefined,
    textWrap: isMobileViewport ? 'balance' : undefined,
    color: 'var(--lacan-muted)',
    fontFamily: '"Source Sans 3", "Segoe UI", system-ui, sans-serif',
    fontWeight: 400,
    textShadow: 'var(--lacan-subtitle-shadow)',
  }), [isMobileViewport])

  return (
    <motion.div
      className={`app-header absolute left-0 right-0 flex flex-col items-center gap-2.5 pointer-events-none ${selectedId ? 'z-0' : 'z-10'}`}
      data-testid="app-header"
      animate={selectedId ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={containerStyle}
    >
      <motion.h1
        className="text-center"
        initial="initial"
        variants={h1Variants}
        animate={selectedId ? 'blurred' : 'visible'}
        style={titleStyle}
        transition={{
          opacity: shouldAnimateEntry
            ? { delay: entryDelaySeconds, duration: HEADER_TITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          y: shouldAnimateEntry
            ? { delay: entryDelaySeconds, duration: HEADER_TITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          scale: { duration: 0.4 },
        }}
      >
        LACAN.JS
      </motion.h1>
      <motion.p
        className="text-center"
        initial="initial"
        variants={pVariants}
        animate={selectedId ? 'blurred' : 'visible'}
        style={subtitleStyle}
        transition={{
          opacity: shouldAnimateEntry
            ? { delay: entryDelaySeconds + HEADER_SUBTITLE_STAGGER_MS / 1000, duration: HEADER_SUBTITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          y: shouldAnimateEntry
            ? { delay: entryDelaySeconds + HEADER_SUBTITLE_STAGGER_MS / 1000, duration: HEADER_SUBTITLE_DURATION_MS / 1000, ease: 'easeOut' }
            : { duration: 0.4, ease: 'easeInOut' },
          scale: { duration: 0.4 },
        }}
      >
        {uiCopy.app.headerSubtitle[language]}
      </motion.p>
    </motion.div>
  )
}
