import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassPanel from '../GlassPanel'
import type { PanelData } from './panels'
import {
  resolvePanelSchema,
  type InteractiveSchemaComponent,
  type NonInteractiveSchemaComponent,
} from './panelSchemaRegistry'
import { GALLERY_CARD_HEIGHT, GALLERY_CARD_WIDTH } from './uiConstants'

interface PanelGalleryProps {
  pageGroup: number
  currentPanels: PanelData[]
  randomOrder: number[]
  selectedId: string | null
  isAppLoaded: boolean
  cardEntryStartDelayMs: number
  onSelectPanel: (id: string) => void
  onNodesSelected: (node1: string, node2: string) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
  onWheelNavigate: (deltaY: number) => void
}

export default function PanelGallery({
  pageGroup,
  currentPanels,
  randomOrder,
  selectedId,
  isAppLoaded,
  cardEntryStartDelayMs,
  onSelectPanel,
  onNodesSelected,
  SchemaL,
  SchemaR,
  SchemaI,
  SchemaD,
  onWheelNavigate,
}: PanelGalleryProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-12 pt-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageGroup}
          className="grid grid-cols-4 gap-8 w-full max-w-7xl pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onWheel={(event) => {
            event.preventDefault()
            onWheelNavigate(event.deltaY)
          }}
        >
          {currentPanels.map((panel, index) => {
            // 随机进场顺序
            const delay = cardEntryStartDelayMs / 1000 + randomOrder.indexOf(index) * 0.15
            const isSelected = selectedId === panel.id
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
                transition={{
                  delay: isAppLoaded ? 0 : delay,
                  duration: isAppLoaded ? 0.32 : 0.5,
                  ease: 'easeOut',
                }}
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
                          <resolvedSchema.Component isExpanded={false} onNodesSelected={onNodesSelected} />
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
                    className="absolute top-full left-1/2 pointer-events-none rounded-[1.6rem]"
                    style={{
                      width: GALLERY_CARD_WIDTH,
                      height: Math.round(GALLERY_CARD_HEIGHT * 0.41),
                      transform: 'translateX(-50%) translateY(112px) scaleX(-1)',
                      transformOrigin: 'top center',
                      opacity: 0.34,
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0.08) 22%, rgba(255,255,255,0.02) 46%, transparent 82%)',
                      filter: 'blur(12px)',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.35) 45%, transparent)',
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
