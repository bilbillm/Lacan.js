import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import {
  TIMELINE_LINE_DRAW_DURATION_S,
  TIMELINE_NODE_STAGGER_S,
  TIMELINE_NODE_ENTRY_DURATION_S,
  TIMELINE_TITLE_DURATION_MS,
  TIMELINE_TITLE_STAGGER_MS,
} from './uiConstants'

interface TimelineViewProps {
  isMobileViewport: boolean
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

export default function TimelineView({ isMobileViewport, language }: TimelineViewProps) {
  const eventCount = timelineEvents.length
  const titleDurationS = TIMELINE_TITLE_DURATION_MS / 1000
  const subtitleDelayS = TIMELINE_TITLE_STAGGER_MS / 1000
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const expandedEvent = expandedYear
    ? timelineEvents.find((e) => e.year === expandedYear) ?? null
    : null
  const expandedEventText = expandedEvent ? getTimelineEventText(expandedEvent, language) : null
  const expandedEventImage = expandedEvent ? timelineEventImages[expandedEvent.year] : undefined

  if (isMobileViewport) {
    return (
      <motion.div
        className="mobile-timeline-view"
        data-modal-open={expandedYear ? 'true' : undefined}
        data-testid="timeline-view"
        style={{ background: 'transparent' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mobile-page-heading">
          <h1
            className="lacan-page-title"
            style={{
              color: 'var(--lacan-ink-strong)',
              fontFamily: 'var(--lacan-title-font)',
              fontWeight: 'var(--lacan-title-weight)',
              textShadow: 'var(--lacan-title-shadow)',
            }}
          >
            {uiCopy.timeline.title[language]}
          </h1>
          <p className="lacan-page-subtitle" style={{ color: 'var(--lacan-muted)' }}>
            {uiCopy.timeline.subtitle[language]}
          </p>
        </div>

        <div className="mobile-timeline-list">
          {timelineEvents.map((event, index) => {
            const eventText = getTimelineEventText(event, language)

            return (
              <motion.button
                key={event.year}
                type="button"
                className="mobile-timeline-card"
                data-testid={`timeline-event-card-${event.year}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: Math.min(index * 0.04, 0.24), duration: 0.42, ease: 'easeOut' }}
                onClick={() => setExpandedYear(event.year)}
              >
                <span className="mobile-timeline-year">{event.year}</span>
                <span className="mobile-timeline-divider" aria-hidden="true" />
                <span className="mobile-timeline-title">{eventText.title}</span>
                <span className="mobile-timeline-description">{eventText.description}</span>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {expandedYear && expandedEvent && (
            <>
              <motion.div
                className="mobile-timeline-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setExpandedYear(null)}
                style={{
                  background: 'var(--lacan-timeline-modal-backdrop)',
                  backdropFilter: 'var(--lacan-timeline-modal-backdrop-filter)',
                  WebkitBackdropFilter: 'var(--lacan-timeline-modal-backdrop-filter)',
                }}
              />
              <motion.div
                className="mobile-timeline-modal-shell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="mobile-timeline-modal"
                  initial={{ opacity: 0, scale: 0.94, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 24 }}
                  transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mobile-timeline-modal-content" data-testid="timeline-modal-card">
                    <div className="mobile-timeline-modal-copy">
                      <span className="mobile-timeline-modal-year">{expandedEvent.year}</span>
                      <span className="mobile-timeline-divider" aria-hidden="true" />
                      <h3>{expandedEventText?.title}</h3>
                      <p>{expandedEventText?.description}</p>
                    </div>
                    {expandedEventImage && (
                      <img
                        className="mobile-timeline-modal-image"
                        src={expandedEventImage}
                        alt={`${expandedEvent.year}: ${expandedEventText?.title} ${uiCopy.timeline.illustrationAlt[language]}`}
                      />
                    )}
                    <button type="button" onClick={() => setExpandedYear(null)}>{uiCopy.timeline.closeButton[language]}</button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden"
      data-testid="timeline-view"
      style={{ background: 'var(--lacan-paper)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Title block — positioned like AppHeader, top center */}
      <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: 96 }}>
        <motion.h1
          className="lacan-page-title text-center"
          style={{
            fontSize: '2.35rem',
            letterSpacing: '0.35em',
            lineHeight: 0.96,
            color: 'var(--lacan-ink-strong)',
            fontFamily: 'var(--lacan-title-font)',
            fontWeight: 'var(--lacan-title-weight)',
            textShadow: 'var(--lacan-title-shadow)',
          }}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            opacity: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
            filter: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
            y: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
          }}
        >
          {uiCopy.timeline.title[language]}
        </motion.h1>

        <motion.p
          className="lacan-page-subtitle text-center font-light"
          style={{
            fontSize: '1.125rem',
            letterSpacing: '0.35em',
            color: 'var(--lacan-muted)',
          }}
          initial={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            opacity: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
            filter: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
            y: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
          }}
        >
          {uiCopy.timeline.subtitle[language]}
        </motion.p>
      </div>

      {/* Timeline track */}
      <div
        className="relative flex-1 flex items-center w-full"
        style={{ maxWidth: '90vw', margin: '0 auto' }}
      >
        <div style={{ position: 'relative', width: '100%', height: 320 }}>
          {/* Horizontal line */}
          <div
            className="absolute left-0 right-0"
            style={{ top: '50%', height: 1, background: 'var(--lacan-timeline-line)' }}
          >
            <motion.div
              className="absolute inset-y-0 left-0"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{
                duration: TIMELINE_LINE_DRAW_DURATION_S,
                ease: 'easeOut',
              }}
              style={{
                background:
                  'var(--lacan-timeline-fill)',
                boxShadow: 'var(--lacan-timeline-shadow)',
              }}
            />
          </div>

          {/* Nodes — dot + connector line + glass card, positioned by year */}
          {timelineEvents.map((event, index) => {
            const minYear = timelineEvents[0].year
            const maxYear = timelineEvents[eventCount - 1].year
            const yearSpan = maxYear - minYear
            const ratio = (event.year - minYear) / yearSpan
            const eventText = getTimelineEventText(event, language)

            const pos = 5 + ratio * 86
            const isAbove = index % 2 === 0
            const delay =
              TIMELINE_LINE_DRAW_DURATION_S * 0.15 +
              index * TIMELINE_NODE_STAGGER_S

            return (
              <div key={event.year}>
                {/* Dot on the line */}
                <motion.div
                  className="absolute"
                  style={{
                    left: `${pos}%`,
                    top: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--lacan-vermilion)',
                    border: '2px solid var(--lacan-surface)',
                    boxShadow: '0 0 0 1px var(--lacan-border)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay, duration: 0.3, ease: 'easeOut' }}
                />

                {/* Connector line */}
                <motion.div
                  className="absolute"
                  style={{
                    left: `${pos}%`,
                    width: 1,
                    ...(isAbove
                      ? { top: 'calc(50% - 30px)', height: 30 }
                      : { top: '50%', height: 30 }),
                    background:
                      'var(--lacan-timeline-connector)',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay, duration: 0.4, ease: 'easeOut' }}
                />

                {/* Glass card — clickable */}
                <motion.div
                  className="absolute cursor-pointer"
                  style={{
                    left: `${pos}%`,
                    transform: 'translateX(-50%)',
                    ...(isAbove
                      ? { bottom: 'calc(50% + 30px)' }
                      : { top: 'calc(50% + 30px)' }),
                    width: 172,
                  }}
                  initial={{
                    opacity: 0,
                    y: isAbove ? -30 : 30,
                    filter: 'blur(4px)',
                  }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay,
                    duration: TIMELINE_NODE_ENTRY_DURATION_S,
                    ease: 'easeOut',
                  }}
                  onClick={() => setExpandedYear(event.year)}
                >
                  <div
                    style={{
                      background: 'var(--lacan-surface)',
                      border: '1px solid var(--lacan-border)',
                      borderRadius: 12,
                      boxShadow: 'var(--lacan-paper-shadow)',
                      padding: 14,
                    }}
                  >
                    <span className="text-xs font-semibold tracking-wider" style={{ color: 'var(--lacan-vermilion)' }}>
                      {event.year}
                    </span>
                    <div
                      style={{
                        height: 1,
                        width: '100%',
                        marginTop: 6,
                        marginBottom: 8,
                        background:
                          'var(--lacan-timeline-divider)',
                      }}
                    />
                    <h3
                      className="text-sm tracking-wide mt-1 mb-1"
                      style={{
                        color: 'var(--lacan-ink)',
                        fontFamily: 'var(--lacan-title-font)',
                        fontWeight: 'var(--lacan-title-weight)',
                      }}
                    >
                      {eventText.title}
                    </h3>
                    <p
                      className="text-xs font-light leading-relaxed"
                      style={{
                        color: 'var(--lacan-muted)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {eventText.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded card modal */}
      <AnimatePresence>
        {expandedYear && expandedEvent && (
          <>
            {/* Blur overlay */}
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setExpandedYear(null)}
              style={{
                background: 'var(--lacan-timeline-modal-backdrop)',
                backdropFilter: 'var(--lacan-timeline-modal-backdrop-filter)',
                WebkitBackdropFilter: 'var(--lacan-timeline-modal-backdrop-filter)',
              }}
            />

            {/* Expanded card */}
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pointer-events-auto"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: 880, maxWidth: '92vw' }}
              >
                <div
                  className="timeline-modal-card"
                  data-testid="timeline-modal-card"
                  style={{
                    background: 'var(--lacan-timeline-modal-surface)',
                    backdropFilter: 'blur(18px) saturate(110%)',
                    WebkitBackdropFilter: 'blur(18px) saturate(110%)',
                    border: '1px solid var(--lacan-timeline-modal-border)',
                    borderRadius: 12,
                    boxShadow: 'var(--lacan-timeline-modal-shadow)',
                  }}
                >
                  <div className="timeline-modal-copy">
                    <span
                      className="block font-semibold tracking-wider mb-3"
                      style={{ fontSize: '1.05rem', letterSpacing: '0.2em', color: 'var(--lacan-vermilion)' }}
                    >
                      {expandedEvent.year}
                    </span>
                    <div
                      style={{
                        height: 1,
                        width: '100%',
                        marginBottom: 20,
                        background:
                          'var(--lacan-timeline-divider)',
                      }}
                    />
                    <h3
                      className="tracking-wide mb-5"
                      style={{ fontSize: '1.6rem', letterSpacing: '0.08em', lineHeight: 1.3, color: 'var(--lacan-ink-strong)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
                    >
                      {expandedEventText?.title}
                    </h3>
                    <p
                      className="font-light leading-relaxed"
                      style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--lacan-muted)' }}
                    >
                      {expandedEventText?.description}
                    </p>
                    <p
                      className="mt-6 font-light tracking-wider"
                      style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--lacan-muted-soft)' }}
                    >
                      {uiCopy.timeline.closeHint[language]}
                    </p>
                  </div>
                  {expandedEventImage && (
                    <div className="timeline-modal-art" aria-hidden="true">
                      <img src={expandedEventImage} alt="" />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
