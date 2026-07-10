import { useEffect, useState } from 'react'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'

const TYPE_INTERVAL_MS = 68
const DELETE_INTERVAL_MS = 34
const HOLD_DURATION_MS = 2000
const BETWEEN_QUOTES_MS = 320

type TypewriterPhase = 'typing' | 'holding' | 'deleting' | 'static'

interface TypewriterQuoteProps {
  language: Language
  reducedMotion: boolean
}

export default function TypewriterQuote({ language, reducedMotion }: TypewriterQuoteProps) {
  const quotes = uiCopy.hero.quotes[language]
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [visibleLength, setVisibleLength] = useState(reducedMotion ? quotes[0].length : 0)
  const [phase, setPhase] = useState<TypewriterPhase>(reducedMotion ? 'static' : 'typing')
  const quote = quotes[quoteIndex]

  useEffect(() => {
    if (reducedMotion || phase === 'static') return

    let delay = TYPE_INTERVAL_MS
    let advance = () => setVisibleLength((length) => Math.min(length + 1, quote.length))

    if (phase === 'typing' && visibleLength >= quote.length) {
      delay = 0
      advance = () => setPhase('holding')
    } else if (phase === 'holding') {
      delay = HOLD_DURATION_MS
      advance = () => setPhase('deleting')
    } else if (phase === 'deleting' && visibleLength > 0) {
      delay = DELETE_INTERVAL_MS
      advance = () => setVisibleLength((length) => Math.max(length - 1, 0))
    } else if (phase === 'deleting') {
      delay = BETWEEN_QUOTES_MS
      advance = () => {
        setQuoteIndex((index) => (index + 1) % quotes.length)
        setPhase('typing')
      }
    }

    const timeout = window.setTimeout(advance, delay)
    return () => window.clearTimeout(timeout)
  }, [phase, quote, quotes.length, reducedMotion, visibleLength])

  return (
    <blockquote
      className="hero-typewriter"
      data-testid="hero-typewriter"
      data-phase={phase}
      data-quote-index={quoteIndex}
      data-quote-count={quotes.length}
      aria-label={quote}
    >
      <span className="hero-typewriter-text" data-testid="hero-typewriter-text" aria-hidden="true">
        {quote.slice(0, visibleLength)}
      </span>
      <span className="hero-typewriter-cursor" data-testid="hero-typewriter-cursor" aria-hidden="true" />
    </blockquote>
  )
}
