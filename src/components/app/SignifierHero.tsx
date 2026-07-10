import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import type { PointerEvent } from 'react'
import lacanPortrait from '../../assets/lacan-portrait-chair-cutout.png'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import TypewriterQuote from './TypewriterQuote'

interface SignifierHeroProps {
  language: Language
}

export default function SignifierHero({ language }: SignifierHeroProps) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const xSpring = useSpring(pointerX, { stiffness: 100, damping: 24 })
  const ySpring = useSpring(pointerY, { stiffness: 100, damping: 24 })
  const nearX = useTransform(xSpring, [-1, 1], [-12, 12])
  const nearY = useTransform(ySpring, [-1, 1], [-8, 8])
  const farX = useTransform(xSpring, [-1, 1], [8, -8])
  const farY = useTransform(ySpring, [-1, 1], [5, -5])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }

  const handlePointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      id="top"
      className="signifier-hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-labelledby="hero-title"
    >
      <motion.div className="signifier-machine signifier-machine--far" style={reduceMotion ? undefined : { x: farX, y: farY }} aria-hidden="true">
        <svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice">
          <path className="machine-line machine-line--cobalt" d="M-40 176 C210 58 334 320 544 208 S930 42 1248 184" />
          <path className="machine-line machine-line--ink" d="M84 692 C214 472 364 536 478 372 S774 132 1124 88" />
          <path className="machine-line machine-line--vermilion" d="M-30 540 C252 662 430 514 594 602 S940 704 1230 488" />
          <circle cx="191" cy="129" r="10" />
          <circle cx="545" cy="208" r="10" />
          <circle cx="936" cy="124" r="10" />
          <circle cx="480" cy="371" r="10" />
          <circle cx="870" cy="600" r="10" />
        </svg>
      </motion.div>

      <figure
        className="hero-portrait"
        data-testid="hero-portrait"
        aria-hidden="true"
      >
        <img src={lacanPortrait} alt="" fetchPriority="high" decoding="async" />
      </figure>

      <motion.div className="signifier-machine signifier-machine--near" style={reduceMotion ? undefined : { x: nearX, y: nearY }} aria-hidden="true">
        <span className="machine-token machine-token--subject">$</span>
        <span className="machine-token machine-token--other">A</span>
        <span className="machine-token machine-token--object">a</span>
        <span className="machine-bracket machine-bracket--left">{'{'}</span>
        <span className="machine-bracket machine-bracket--right">{'}'}</span>
      </motion.div>

      <div className="hero-copy">
        <motion.p
          className="hero-eyebrow"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {uiCopy.hero.eyebrow[language]}
        </motion.p>
        <motion.div
          className="hero-title-parallax"
          data-testid="hero-title-parallax"
          style={reduceMotion ? undefined : { x: nearX, y: nearY }}
        >
          <motion.h1
            id="hero-title"
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            LACAN.JS
          </motion.h1>
        </motion.div>
        <motion.p
          className="hero-statement"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.56 }}
        >
          {uiCopy.hero.statement[language]}
        </motion.p>
        <motion.span
          className="hero-signifier-chain"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.44 }}
        >
          S1 → S2
        </motion.span>
      </div>

      <motion.div
        className="hero-typewriter-parallax"
        data-testid="hero-typewriter-parallax"
        style={reduceMotion ? undefined : { x: nearX, y: nearY }}
      >
        <TypewriterQuote
          key={`${language}-${reduceMotion ? 'static' : 'motion'}`}
          language={language}
          reducedMotion={Boolean(reduceMotion)}
        />
      </motion.div>
      <div className="hero-index-note" aria-hidden="true">{uiCopy.hero.index[language]}</div>
      <a className="hero-explore-link" href="#theory">
        <span className="hero-explore-content">
          <span>{uiCopy.hero.explore[language]}</span>
          <ArrowDown aria-hidden="true" />
        </span>
        <span className="hero-explore-content hero-explore-content--inverse" aria-hidden="true">
          <span>{uiCopy.hero.explore[language]}</span>
          <ArrowDown aria-hidden="true" />
        </span>
      </a>
    </section>
  )
}
