import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassPanel from '../GlassPanel'
import type { PanelData } from './panels'
import {
  resolvePanelSchema,
  type InteractiveSchemaComponent,
  type NonInteractiveSchemaComponent,
} from './panelSchemaRegistry'
import {
  GALLERY_CARD_ENTRY_DURATION_S,
  GALLERY_CARD_HEIGHT,
  GALLERY_CARD_REENTER_DURATION_S,
  GALLERY_CARD_STAGGER_S,
  GALLERY_CARD_WIDTH,
  GALLERY_PAGE_FADE_DURATION_S,
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
  onSelectPanel: (id: string) => void
  onSelectionChange: (panelId: string, nodeIds: string[]) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
  onWheelNavigate: (deltaY: number) => void
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
  onSelectPanel,
  onSelectionChange,
  SchemaL,
  SchemaR,
  SchemaI,
  SchemaD,
  onWheelNavigate,
}: PanelGalleryProps) {
  const progress = ((pageGroup + 1) / totalPages) * 100
  const cardEntryMaxDelay = Math.max(...currentPanels.map((_, index) => randomOrder.indexOf(index) * GALLERY_CARD_STAGGER_S))
  const progressEntryDelay = cardEntryStartDelayMs / 1000 + cardEntryMaxDelay + 0.5

  return (
    <div className="absolute inset-0 flex items-center justify-center px-12 pt-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageGroup}
          className="grid grid-cols-4 gap-8 w-full max-w-7xl pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: GALLERY_PAGE_FADE_DURATION_S }}
          onWheel={(event) => {
            event.preventDefault()
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
            const resolvedSchema = resolvePanelSchema(panel.id, {
              SchemaL,
              SchemaR,
              SchemaI,
              SchemaD,
            })
            return (
              <motion.div
                key={panel.id}
                layout
                initial={isAppLoaded ? false : { opacity: 0, y: 30, filter: 'blur(5px)' }}
                animate={
                  selectedId
                    ? { opacity: 0, y: isSelected ? 0 : 60, filter: 'blur(5px)', scale: isSelected ? 1.1 : 0.95 }
                    : { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
                }
                exit={{ opacity: 0, y: 60, filter: 'blur(5px)' }}
                transition={cardTransition}
              >
                {/* 包裹容器 */}
                <div
                  className="relative flex flex-col items-center"
                  style={{ overflow: 'visible' }}
                >
                  {/* 主面板 */}
                  <GlassPanel
                    layoutId={panel.id}
                    width={GALLERY_CARD_WIDTH}
                    height={GALLERY_CARD_HEIGHT}
                    onClick={() => onSelectPanel(panel.id)}
                    className="cursor-pointer"
                    deferVisualEnhancement={!isAppLoaded}
                  >
                    {resolvedSchema ? (
                      <Suspense
                        fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl font-light tracking-widest text-white/40">
                              {panel.title}
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
                        <span className="text-xl font-light tracking-widest text-white/40">
                          {panel.title}
                        </span>
                      </div>
                    )}
                  </GlassPanel>

                  <div
                    className="absolute top-full left-1/2 pointer-events-none"
                    style={{ transform: 'translateX(-50%) translateY(112px)' }}
                  >
                    <motion.div
                      className="rounded-[1.6rem]"
                      initial={isAppLoaded ? false : { y: -60 }}
                      animate={{ y: 0 }}
                      exit={{ y: -120 }}
                      transition={cardTransition}
                      style={{
                        width: GALLERY_CARD_WIDTH,
                        height: Math.round(GALLERY_CARD_HEIGHT * 0.41),
                        transform: 'scaleX(-1)',
                        transformOrigin: 'top center',
                        opacity: 0.34,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.08) 22%, rgba(255,255,255,0.02) 46%, transparent 82%)',
                        filter: 'blur(12px)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        animate={selectedId ? { opacity: 0, filter: 'blur(5px)' } : { opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="relative overflow-hidden rounded-full"
            style={{
              width: 'min(38vw, 360px)',
              height: '2px',
              boxShadow: '0 0 10px rgba(255,255,255,0.08)',
            }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={isAppLoaded ? false : { width: 0, opacity: 0.45 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={
                isAppLoaded
                  ? { width: { duration: PROGRESS_BAR_TRACK_DURATION_S, ease: 'easeOut' }, opacity: { duration: GALLERY_PAGE_FADE_DURATION_S } }
                  : {
                      width: { delay: progressEntryDelay, duration: PROGRESS_BAR_ENTRY_DURATION_S, ease: 'easeOut' },
                      opacity: { delay: progressEntryDelay, duration: 0.2, ease: 'easeOut' },
                    }
              }
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.18) 100%)',
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
                background: 'linear-gradient(90deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,0.5) 100%)',
                boxShadow: '0 0 14px rgba(255,255,255,0.3)',
              }}
            />
          </motion.div>
          <motion.span
            className="text-[0.65rem] font-light tracking-[0.28em] text-white/35"
            initial={isAppLoaded ? false : { opacity: 0, y: 6, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: isAppLoaded ? 0 : progressEntryDelay + PROGRESS_LABEL_STAGGER_S,
              duration: PROGRESS_LABEL_ENTRY_DURATION_S,
              ease: 'easeOut',
            }}
          >
            {String(pageGroup + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
