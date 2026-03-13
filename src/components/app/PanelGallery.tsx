import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassPanel from '../GlassPanel'
import type { PanelData } from './panels'
import {
  resolvePanelSchema,
  type InteractiveSchemaComponent,
  type NonInteractiveSchemaComponent,
} from './panelSchemaRegistry'

interface PanelGalleryProps {
  pageGroup: number
  currentPanels: PanelData[]
  randomOrder: number[]
  selectedId: string | null
  isAppLoaded: boolean
  onSelectPanel: (id: string) => void
  onNodesSelected: (node1: string, node2: string) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
}

export default function PanelGallery({
  pageGroup,
  currentPanels,
  randomOrder,
  selectedId,
  isAppLoaded,
  onSelectPanel,
  onNodesSelected,
  SchemaL,
  SchemaR,
  SchemaI,
  SchemaD,
}: PanelGalleryProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-12 pt-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageGroup}
          className="grid grid-cols-4 gap-6 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentPanels.map((panel, index) => {
            // 随机进场顺序
            const delay = 3.3 + randomOrder.indexOf(index) * 0.15
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
                  duration: 0.5,
                  ease: 'easeOut',
                }}
              >
                {/* 包裹容器 */}
                <div className="relative flex flex-col items-center">
                  {/* 主面板 */}
                  <GlassPanel
                    layoutId={panel.id}
                    width={220}
                    height={320}
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
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
