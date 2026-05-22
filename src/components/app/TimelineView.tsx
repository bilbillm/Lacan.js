import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timelineEvents } from '../../data/timelineData'
import {
  TIMELINE_LINE_DRAW_DURATION_S,
  TIMELINE_NODE_STAGGER_S,
  TIMELINE_NODE_ENTRY_DURATION_S,
  TIMELINE_TITLE_DURATION_MS,
  TIMELINE_TITLE_STAGGER_MS,
} from './uiConstants'

interface TimelineViewProps {
  isMobileViewport: boolean
}

export default function TimelineView({ isMobileViewport }: TimelineViewProps) {
  if (isMobileViewport) return null

  const eventCount = timelineEvents.length
  const titleDurationS = TIMELINE_TITLE_DURATION_MS / 1000
  const subtitleDelayS = TIMELINE_TITLE_STAGGER_MS / 1000
  const [expandedYear, setExpandedYear] = useState<number | null>(null)
  const expandedEvent = expandedYear
    ? timelineEvents.find((e) => e.year === expandedYear) ?? null
    : null

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center overflow-hidden"
      data-testid="timeline-view"
      style={{ background: 'rgb(5, 5, 7)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Title block — positioned like AppHeader, top center */}
      <div className="flex flex-col items-center gap-2.5" style={{ paddingTop: 96 }}>
        <motion.h1
          className="text-center font-light text-white/70"
          style={{
            fontSize: '2.35rem',
            letterSpacing: '0.35em',
            lineHeight: 0.96,
            textShadow:
              '0 0 8px rgba(255,255,255,0.3), 0 0 25px rgba(255,255,255,0.15)',
          }}
          initial={{ opacity: 0, filter: 'blur(10px)', y: -30 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            opacity: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
            filter: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
            y: { delay: 0, duration: titleDurationS, ease: 'easeOut' },
          }}
        >
          精神分析发展史
        </motion.h1>

        <motion.p
          className="text-center font-light text-white/40"
          style={{
            fontSize: '1.125rem',
            letterSpacing: '0.35em',
            textShadow:
              '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
          }}
          initial={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            opacity: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
            filter: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
            y: { delay: subtitleDelayS, duration: titleDurationS, ease: 'easeOut' },
          }}
        >
          A Timeline of Psychoanalytic Thought
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
            style={{ top: '50%', height: 1, background: 'rgba(255,255,255,0.08)' }}
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
                  'linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))',
                boxShadow: '0 0 6px rgba(255,255,255,0.15)',
              }}
            />
          </div>

          {/* Nodes — dot + connector line + glass card, positioned by year */}
          {timelineEvents.map((event, index) => {
            const minYear = timelineEvents[0].year
            const maxYear = timelineEvents[eventCount - 1].year
            const yearSpan = maxYear - minYear
            const ratio = (event.year - minYear) / yearSpan

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
                    background: 'rgba(255, 255, 255, 0.6)',
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
                      'linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      backdropFilter: 'blur(16px) saturate(130%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(130%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      boxShadow:
                        '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                      padding: 14,
                    }}
                  >
                    <span className="text-xs font-light tracking-wider text-white/40">
                      {event.year}
                    </span>
                    <div
                      style={{
                        height: 1,
                        width: '100%',
                        marginTop: 6,
                        marginBottom: 8,
                        background:
                          'linear-gradient(to right, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
                      }}
                    />
                    <h3 className="text-sm font-medium tracking-wide text-white/80 mt-1 mb-1">
                      {event.title}
                    </h3>
                    <p
                      className="text-xs font-light leading-relaxed text-white/40"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.description}
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
                background: 'rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
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
                style={{ width: 480, maxWidth: '90vw' }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(24px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(140%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 16,
                    boxShadow:
                      '0 8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    padding: 32,
                  }}
                >
                  <span
                    className="block font-light tracking-wider text-white/40 mb-3"
                    style={{ fontSize: '1.05rem', letterSpacing: '0.2em' }}
                  >
                    {expandedEvent.year}
                  </span>
                  <div
                    style={{
                      height: 1,
                      width: '100%',
                      marginBottom: 20,
                      background:
                        'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.04))',
                    }}
                  />
                  <h3
                    className="font-light tracking-wide text-white/85 mb-5"
                    style={{ fontSize: '1.6rem', letterSpacing: '0.08em', lineHeight: 1.3 }}
                  >
                    {expandedEvent.title}
                  </h3>
                  <p
                    className="font-light leading-relaxed text-white/55"
                    style={{ fontSize: '1rem', lineHeight: 1.75 }}
                  >
                    {expandedEvent.description}
                  </p>
                  <p
                    className="mt-6 font-light tracking-wider text-white/25"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}
                  >
                    点击空白处关闭
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
