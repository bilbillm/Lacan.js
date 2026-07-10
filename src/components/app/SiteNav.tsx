import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'

interface SiteNavProps {
  language: Language
  theme: 'day' | 'night'
  activeSection: string
  onToggleLanguage: () => void
  onToggleTheme: () => void
}

const navItems = [
  { id: 'theory', href: '#theory' },
  { id: 'timeline', href: '#timeline' },
  { id: 'borromean', href: '#borromean' },
] as const

export default function SiteNav({
  language,
  theme,
  activeSection,
  onToggleLanguage,
  onToggleTheme,
}: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <header className="site-nav-shell" data-testid="site-nav">
      <nav className="site-nav" aria-label={language === 'zh' ? '主要导航' : 'Primary navigation'}>
        <a className="site-nav-brand" href="#top" aria-label="Lacan.js">
          LACAN.JS
        </a>

        <div className="site-nav-links site-nav-links--desktop">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} aria-current={activeSection === item.id ? 'page' : undefined}>
              {uiCopy.nav[item.id][language]}
            </a>
          ))}
        </div>

        <div className="site-nav-actions">
          <button
            type="button"
            className="nav-text-button"
            data-testid="language-toggle"
            aria-label={uiCopy.app.switchToLanguage[language]}
            onClick={onToggleLanguage}
          >
            {language === 'zh' ? 'EN' : '中'}
          </button>
          <button
            type="button"
            className="nav-icon-button"
            data-testid="theme-toggle"
            aria-label={theme === 'day' ? uiCopy.app.switchToTheme.day[language] : uiCopy.app.switchToTheme.night[language]}
            aria-pressed={theme === 'night'}
            title={theme === 'day' ? uiCopy.app.switchToTheme.day[language] : uiCopy.app.switchToTheme.night[language]}
            onClick={onToggleTheme}
          >
            {theme === 'day' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="nav-icon-button site-nav-menu-button"
            aria-label={menuOpen ? uiCopy.app.closeMenu[language] : uiCopy.app.openMenu[language]}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="site-nav-links site-nav-links--mobile"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          >
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={activeSection === item.id ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span>0{index + 1}</span>
                {uiCopy.nav[item.id][language]}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
