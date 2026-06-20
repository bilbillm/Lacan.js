import { motion } from 'framer-motion'
import { forumLinks } from '../../data/forumLinks'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'

interface HomeSignatureBarProps {
  isHidden: boolean
  language: Language
}

export default function HomeSignatureBar({ isHidden, language }: HomeSignatureBarProps) {
  return (
    <motion.div
      className="home-signature-bar"
      data-testid="home-signature-bar"
      aria-hidden={isHidden}
      animate={isHidden ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <span>{uiCopy.homeSignature.designedBy[language]}</span>
      <a
        href={forumLinks.forumDiscussion}
        target="_blank"
        rel="noreferrer"
      >
        {uiCopy.homeSignature.forum[language]}
      </a>
    </motion.div>
  )
}
