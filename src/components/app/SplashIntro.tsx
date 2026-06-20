import { useEffect } from 'react'
import analysisRoomImage from '../../assets/timeline/psychoanalysis-1900.webp'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'

interface SplashIntroProps {
  onComplete: () => void
  language: Language
}

const SPLASH_DURATION_MS = 2500

export default function SplashIntro({ onComplete, language }: SplashIntroProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(onComplete, prefersReducedMotion ? 120 : SPLASH_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="splash-intro"
      data-testid="splash-intro"
      aria-hidden="true"
    >
      <img
        className="splash-intro-image"
        src={analysisRoomImage}
        alt=""
      />
      <div className="splash-intro-card">
        <span className="splash-intro-card-kicker">{uiCopy.splash.kicker[language]}</span>
        <h2>{uiCopy.splash.headline[language]}</h2>
        <p>{uiCopy.splash.category[language]}</p>
      </div>
    </div>
  )
}
