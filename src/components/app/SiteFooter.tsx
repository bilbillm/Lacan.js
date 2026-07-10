import { ArrowUp, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import { forumLinks } from '../../data/forumLinks'

interface SiteFooterProps {
  language: Language
}

export default function SiteFooter({ language }: SiteFooterProps) {
  const reduceMotion = useReducedMotion()

  return (
    <>
      <section id="closing" className="closing-scene" data-section="closing" data-testid="closing-scene" aria-labelledby="closing-title">
        <motion.div
          className="closing-scene-inner"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.48 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p>{uiCopy.footer.eyebrow[language]}</p>
          <h2 id="closing-title">
            {uiCopy.footer.title[language].map((line) => <span key={line}>{line}</span>)}
          </h2>
          <a href="#top" className="closing-back-to-top" data-testid="closing-back-to-top">
            {uiCopy.footer.backToTop[language]}
            <ArrowUp aria-hidden="true" />
          </a>
        </motion.div>
      </section>

      <footer className="site-footer">
        <span className="site-footer-brand">LACAN.JS / 2026</span>
        <div className="site-footer-meta">
          <span>{uiCopy.footer.designedBy[language]}</span>
          <a className="site-footer-forum-link" href={forumLinks.forumHome} target="_blank" rel="noreferrer">
            {uiCopy.footer.association[language]}
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  )
}
