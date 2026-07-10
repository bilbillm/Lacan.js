import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { getTimelineEventText, timelineEvents } from '../../data/timelineData'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import timeline1885Image from '../../assets/timeline/psychoanalysis-1885.webp'
import timeline1900Image from '../../assets/timeline/psychoanalysis-1900.webp'
import timeline1910Image from '../../assets/timeline/psychoanalysis-1910.webp'
import timeline1920Image from '../../assets/timeline/psychoanalysis-1920.webp'
import timeline1936Image from '../../assets/timeline/psychoanalysis-1936.webp'
import timeline1953Image from '../../assets/timeline/psychoanalysis-1953.webp'
import timeline1964Image from '../../assets/timeline/psychoanalysis-1964.webp'
import timeline1973Image from '../../assets/timeline/psychoanalysis-1973.webp'
import timeline1981Image from '../../assets/timeline/psychoanalysis-1981.webp'
import timeline1990Image from '../../assets/timeline/psychoanalysis-1990.webp'

interface TimelineViewProps {
  language: Language
}

const timelineEventImages: Record<number, string> = {
  1885: timeline1885Image,
  1900: timeline1900Image,
  1910: timeline1910Image,
  1920: timeline1920Image,
  1936: timeline1936Image,
  1953: timeline1953Image,
  1964: timeline1964Image,
  1973: timeline1973Image,
  1981: timeline1981Image,
  1990: timeline1990Image,
}

export default function TimelineView({ language }: TimelineViewProps) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const eventRefs = useRef<Array<HTMLButtonElement | null>>([])
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)
  const activeEvent = timelineEvents[activeIndex]
  const expandedEvent = expandedYear === null ? null : timelineEvents.find((event) => event.year === expandedYear) ?? null

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = Number((visible.target as HTMLElement).dataset.timelineIndex)
        if (Number.isFinite(index)) setActiveIndex(index)
      },
      { rootMargin: '-30% 0px -42%', threshold: [0.2, 0.5, 0.8] },
    )

    eventRefs.current.forEach((element) => {
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (expandedYear === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedYear(null)
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      lastTriggerRef.current?.focus()
    }
  }, [expandedYear])

  const openEvent = (year: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setExpandedYear(year)
  }

  return (
    <section id="timeline" className="page-section timeline-section" data-section="timeline" data-testid="timeline-view" aria-labelledby="timeline-title">
      <div className="section-heading section-heading--timeline">
        <span className="section-number">{uiCopy.timeline.sectionNumber}</span>
        <div>
          <p className="section-eyebrow">{uiCopy.timeline.eyebrow[language]}</p>
          <h2 id="timeline-title">{uiCopy.timeline.title[language]}</h2>
        </div>
        <p>{uiCopy.timeline.subtitle[language]}</p>
      </div>

      <div className="timeline-layout">
        <div className="timeline-stage" aria-live="polite">
          <div className="timeline-stage-meta">
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(timelineEvents.length).padStart(2, '0')}</span>
            <strong>{activeEvent?.year}</strong>
          </div>
          <div className="archive-image-frame">
            <AnimatePresence mode="wait" initial={false}>
              {activeEvent && (
                <motion.img
                  key={activeEvent.year}
                  src={timelineEventImages[activeEvent.year]}
                  alt={`${activeEvent.year}: ${getTimelineEventText(activeEvent, language).title}`}
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.42 }}
                />
              )}
            </AnimatePresence>
            <span className="archive-image-ink" aria-hidden="true" />
          </div>
          <p>{activeEvent ? getTimelineEventText(activeEvent, language).title : ''}</p>
        </div>

        <div className="timeline-event-list">
          {timelineEvents.map((event, index) => {
            const eventText = getTimelineEventText(event, language)
            const active = index === activeIndex

            return (
              <motion.button
                key={event.year}
                ref={(element) => { eventRefs.current[index] = element }}
                type="button"
                className="timeline-event"
                data-active={active ? 'true' : undefined}
                data-timeline-index={index}
                data-testid={`timeline-event-card-${event.year}`}
                aria-label={`${uiCopy.timeline.openEvent[language]}: ${event.year} ${eventText.title}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={(clickEvent) => openEvent(event.year, clickEvent.currentTarget)}
              >
                <span className="timeline-event-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="timeline-event-year">{event.year}</span>
                <span className="timeline-event-copy">
                  <strong>{eventText.title}</strong>
                  <span>{eventText.description}</span>
                </span>
                <span className="timeline-mobile-image archive-image-frame" aria-hidden="true">
                  <img loading="lazy" src={timelineEventImages[event.year]} alt="" />
                  <span className="archive-image-ink" />
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {expandedEvent && (
          <motion.div
            className="timeline-dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setExpandedYear(null)
            }}
          >
            <motion.div
              className="timeline-dialog"
              data-testid="timeline-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="timeline-dialog-title"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
            >
              <button ref={closeRef} type="button" className="dialog-close" aria-label={uiCopy.timeline.close[language]} onClick={() => setExpandedYear(null)}>
                <X aria-hidden="true" />
              </button>
              <div className="timeline-dialog-copy">
                <span>{expandedEvent.year}</span>
                <h3 id="timeline-dialog-title">{getTimelineEventText(expandedEvent, language).title}</h3>
                <p>{getTimelineEventText(expandedEvent, language).description}</p>
              </div>
              <div className="archive-image-frame timeline-dialog-image">
                <img src={timelineEventImages[expandedEvent.year]} alt={`${expandedEvent.year}: ${uiCopy.timeline.illustrationAlt[language]}`} />
                <span className="archive-image-ink" aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
