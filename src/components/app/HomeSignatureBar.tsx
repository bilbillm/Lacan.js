import { motion } from 'framer-motion'
import { forumLinks } from '../../data/forumLinks'

interface HomeSignatureBarProps {
  isHidden: boolean
}

export default function HomeSignatureBar({ isHidden }: HomeSignatureBarProps) {
  return (
    <motion.div
      className="home-signature-bar"
      data-testid="home-signature-bar"
      aria-hidden={isHidden}
      animate={isHidden ? { opacity: 0, y: 10, filter: 'blur(4px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <span>Designed by Lumoren</span>
      <a
        href={forumLinks.forumDiscussion}
        target="_blank"
        rel="noreferrer"
      >
        觉心论坛
      </a>
    </motion.div>
  )
}
