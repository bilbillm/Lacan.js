import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassPanel from '../GlassPanel'
import { getPanelText, type PanelData } from './panels'
import type { Language } from '../../i18n'
import { uiCopy } from '../../i18n'
import {
  resolvePanelSchema,
  type InteractiveSchemaComponent,
  type NonInteractiveSchemaComponent,
} from './panelSchemaRegistry'
import {
  GALLERY_CARD_ENTRY_DURATION_S,
  GALLERY_CARD_HEIGHT,
  GALLERY_LAYOUT_TOKENS,
  GALLERY_MOBILE_CARD_HEIGHT,
  GALLERY_MOBILE_CARD_MAX_WIDTH,
  GALLERY_CARD_REENTER_DURATION_S,
  GALLERY_CARD_STAGGER_S,
  GALLERY_CARD_WIDTH,
  GALLERY_PAGE_SLIDE_DURATION_S,
  GALLERY_PROGRESS_TOKENS,
  PROGRESS_BAR_ENTRY_DURATION_S,
  PROGRESS_BAR_TRACK_DURATION_S,
  PROGRESS_BAR_UPDATE_DURATION_S,
  PROGRESS_LABEL_ENTRY_DURATION_S,
  PROGRESS_LABEL_STAGGER_S,
} from './uiConstants'

interface PanelGalleryProps {
  pageGroup: number
  totalPages: number
  currentPanels: PanelData[]
  randomOrder: number[]
  selectedId: string | null
  selectedNodeState: { panelId: string; nodeIds: string[] } | null
  isAppLoaded: boolean
  cardEntryStartDelayMs: number
  isMobileViewport: boolean
  language: Language
  onSelectPanel: (id: string) => void
  onSelectionChange: (panelId: string, nodeIds: string[]) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
  onWheelNavigate: (deltaY: number) => void
  onPageChange: (pageGroup: number) => void
}

export default function PanelGallery({
  pageGroup,
  totalPages,
  currentPanels,
  randomOrder,
  selectedId,
  selectedNodeState,
  isAppLoaded,
  cardEntryStartDelayMs,
  isMobileViewport,
  language,
  onSelectPanel,
  onSelectionChange,
  SchemaL,
  SchemaR,
  SchemaI,
  SchemaD,
  onWheelNavigate,
  onPageChange,
}: PanelGalleryProps) {
  const progress = ((pageGroup + 1) / totalPages) * 100
  const cardEntryMaxDelay = Math.max(...currentPanels.map((_, index) => randomOrder.indexOf(index) * GALLERY_CARD_STAGGER_S))
  const progressEntryDelay = cardEntryStartDelayMs / 1000 + cardEntryMaxDelay + 0.5
  const galleryLayout = isMobileViewport ? GALLERY_LAYOUT_TOKENS.mobile : GALLERY_LAYOUT_TOKENS.desktop
  const progressTokens = isMobileViewport ? GALLERY_PROGRESS_TOKENS.mobile : GALLERY_PROGRESS_TOKENS.desktop
  const galleryCardWidth = isMobileViewport ? '100%' : GALLERY_CARD_WIDTH
  const galleryCardHeight = isMobileViewport ? GALLERY_MOBILE_CARD_HEIGHT : GALLERY_CARD_HEIGHT
  const previousPage = (pageGroup - 1 + totalPages) % totalPages
  const nextPage = (pageGroup + 1) % totalPages
  const pageStatus = uiCopy.gallery.pageStatus[language]
    .replace('{current}', String(pageGroup + 1).padStart(2, '0'))
    .replace('{total}', String(totalPages).padStart(2, '0'))

  return (
    <div className="panel-gallery-shell absolute inset-0 flex items-center justify-center" data-testid="panel-gallery">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageGroup}
          className="grid w-full pointer-events-auto"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0 }}
          style={{
            gridTemplateColumns: `repeat(${galleryLayout.columns}, minmax(0, 1fr))`,
            gap: `${galleryLayout.gap}px`,
            maxWidth: `${galleryLayout.maxWidth ?? GALLERY_MOBILE_CARD_MAX_WIDTH}px`,
            justifyItems: isMobileViewport ? 'center' : 'stretch',
          }}
          onWheel={(event) => {
            event.stopPropagation()
            if (isMobileViewport) {
              return
            }

            onWheelNavigate(event.deltaY)
          }}
        >
          {currentPanels.map((panel, index) => {
            // 随机进场顺序
            const delay = cardEntryStartDelayMs / 1000 + randomOrder.indexOf(index) * GALLERY_CARD_STAGGER_S
            const isSelected = selectedId === panel.id
            const cardTransition = {
              delay: isAppLoaded ? 0 : delay,
              duration: isAppLoaded ? GALLERY_CARD_REENTER_DURATION_S : GALLERY_CARD_ENTRY_DURATION_S,
              ease: 'easeOut' as const,
            }
            const currentSelectedNodes = selectedNodeState?.panelId === panel.id ? selectedNodeState.nodeIds : []
            const panelText = getPanelText(panel, language)
            const resolvedSchema = resolvePanelSchema(panel.id, {
              SchemaL,
              SchemaR,
              SchemaI,
              SchemaD,
            })
            return (
              <motion.div
                key={panel.id}
                data-testid={`panel-card-${panel.id}`}
                layout
                className={isMobileViewport ? 'w-full' : undefined}
                initial={isAppLoaded ? false : { opacity: 0, y: 24 }}
                animate={
                  selectedId
                    ? { opacity: 0, y: isSelected ? 0 : 56, scale: isSelected ? 1.08 : 0.96 }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                exit={{ opacity: 0, y: 56 }}
                transition={cardTransition}
              >
                {/* 包裹容器 */}
                <div
                  className="relative flex flex-col items-center"
                  style={{
                    overflow: 'visible',
                    width: '100%',
                    maxWidth: isMobileViewport ? `${GALLERY_MOBILE_CARD_MAX_WIDTH}px` : undefined,
                    cursor: isMobileViewport ? 'pointer' : undefined,
                  }}
                >
                  {/* 主面板 */}
                  <GlassPanel
                    layoutId={panel.id}
                    width={galleryCardWidth}
                    height={galleryCardHeight}
                    onClick={() => onSelectPanel(panel.id)}
                    className={isMobileViewport ? 'mobile-gallery-card cursor-pointer' : 'cursor-pointer'}
                    deferVisualEnhancement={!isAppLoaded}
                    isMobileViewport={isMobileViewport}
                    visualMode="light"
                    style={{
                      maxWidth: isMobileViewport ? GALLERY_MOBILE_CARD_MAX_WIDTH : undefined,
                    }}
                  >
                    {isMobileViewport ? (
                      <div className="mobile-gallery-card-content">
                        <h2>{panelText.galleryLabel}</h2>
                        <span className="mobile-gallery-card-divider" aria-hidden="true" />
                        <p>{panelText.mobileDescription ?? uiCopy.gallery.fallbackDescription[language]}</p>
                      </div>
                    ) : resolvedSchema ? (
                      <Suspense
                        fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <span
                                className="text-xl tracking-widest"
                                style={{ color: 'var(--lacan-muted)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
                              >
                                {panelText.galleryLabel}
                              </span>
                            </div>
                          }
                      >
                        {resolvedSchema.interactive ? (
                          <resolvedSchema.Component
                            isExpanded={false}
                            selectedNodes={currentSelectedNodes}
                            onSelectionChange={(nodeIds) => onSelectionChange(panel.id, nodeIds)}
                          />
                        ) : (
                          <resolvedSchema.Component isExpanded={false} />
                        )}
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span
                          className="text-xl tracking-widest"
                          style={{ color: 'var(--lacan-muted)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
                        >
                          {panelText.galleryLabel}
                        </span>
                      </div>
                    )}
                  </GlassPanel>

                  {!isMobileViewport && (
                    <div
                      className="absolute top-full left-1/2 pointer-events-none"
                      style={{ transform: `translateX(-50%) translateY(${galleryLayout.reflectionOffsetY}px)` }}
                    >
                      <motion.div
                        className="rounded-[1.6rem]"
                        initial={isAppLoaded ? false : { y: -60 }}
                        animate={{ y: 0 }}
                        exit={{ y: -120 }}
                        transition={cardTransition}
                        style={{
                          width: galleryCardWidth,
                          height: Math.round(galleryCardHeight * galleryLayout.reflectionHeightRatio),
                          transform: 'scaleX(-1)',
                          transformOrigin: 'top center',
                          opacity: Math.min(galleryLayout.reflectionOpacity, 0.12),
                          background: 'var(--lacan-gallery-reflection)',
                          filter: 'blur(8px)',
                          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {isMobileViewport && totalPages > 1 && (
        <motion.nav
          className="mobile-gallery-pagination"
          aria-label={pageStatus}
          initial={isAppLoaded ? false : { opacity: 0, y: 10 }}
          animate={selectedId ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <button
            type="button"
            aria-label={uiCopy.gallery.previousPage[language]}
            onClick={() => onPageChange(previousPage)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <span className="mobile-gallery-page-status">{pageStatus}</span>
          <button
            type="button"
            aria-label={uiCopy.gallery.nextPage[language]}
            onClick={() => onPageChange(nextPage)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </motion.nav>
      )}

      <motion.div
        className="progress-indicator-shell absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        data-testid="progress-indicator"
        animate={selectedId ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center gap-2" style={{ width: `min(${progressTokens.widthViewport}vw, ${progressTokens.maxWidth}px)` }}>
          <motion.div
            className="relative overflow-hidden rounded-full"
            style={{
              width: '100%',
              height: '2px',
              boxShadow: 'inset 0 0 0 1px var(--lacan-border)',
              background: 'var(--lacan-progress-track)',
            }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={isAppLoaded ? false : { width: 0, opacity: 0.45 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={
                isAppLoaded
                  ? { width: { duration: PROGRESS_BAR_TRACK_DURATION_S, ease: 'easeOut' }, opacity: { duration: GALLERY_PAGE_SLIDE_DURATION_S } }
                  : {
                      width: { delay: progressEntryDelay, duration: PROGRESS_BAR_ENTRY_DURATION_S, ease: 'easeOut' },
                      opacity: { delay: progressEntryDelay, duration: 0.2, ease: 'easeOut' },
                    }
              }
              style={{
                background: 'var(--lacan-progress-base)',
              }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={isAppLoaded ? false : { width: 0, opacity: 0.65 }}
              animate={{ width: `${progress}%`, opacity: 1 }}
              transition={
                isAppLoaded
                  ? { width: { duration: PROGRESS_BAR_UPDATE_DURATION_S, ease: 'easeOut' }, opacity: { duration: 0.2 } }
                  : {
                      width: { delay: progressEntryDelay, duration: PROGRESS_BAR_ENTRY_DURATION_S, ease: 'easeOut' },
                      opacity: { delay: progressEntryDelay, duration: 0.2, ease: 'easeOut' },
                    }
              }
              style={{
                background: 'var(--lacan-progress-fill)',
                boxShadow: 'var(--lacan-progress-shadow)',
              }}
            />
          </motion.div>
          <motion.span
            className="font-light"
            initial={isAppLoaded ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: isAppLoaded ? 0 : progressEntryDelay + PROGRESS_LABEL_STAGGER_S,
              duration: PROGRESS_LABEL_ENTRY_DURATION_S,
              ease: 'easeOut',
            }}
            style={{
              fontSize: `${progressTokens.labelFontRem}rem`,
              letterSpacing: `${progressTokens.labelTrackingEm}em`,
              color: 'var(--lacan-muted)',
            }}
          >
            {String(pageGroup + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
