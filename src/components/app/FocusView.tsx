import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GlassPanel from '../GlassPanel'
import type { PanelData } from './panels'
import {
  resolvePanelSchema,
  type InteractiveSchemaComponent,
  type NonInteractiveSchemaComponent,
} from './panelSchemaRegistry'

interface FocusViewProps {
  selectedId: string | null
  selectedPanel?: PanelData
  selectedNodes: [string, string] | null
  onExitFocus: () => void
  onNodesSelected: (node1: string, node2: string) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
}

export default function FocusView({
  selectedId,
  selectedPanel,
  selectedNodes,
  onExitFocus,
  onNodesSelected,
  SchemaL,
  SchemaR,
  SchemaI,
  SchemaD,
}: FocusViewProps) {
  const resolvedSchema = selectedPanel
    ? resolvePanelSchema(selectedPanel.id, {
        SchemaL,
        SchemaR,
        SchemaI,
        SchemaD,
      })
    : null

  return (
    <AnimatePresence>
      {selectedId && selectedPanel && (
        <>
          {/* Backdrop mask */}
          <motion.div
            className="absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onExitFocus}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          />

          {/* Expanded Panel - moves to left when nodes selected */}
          <div className="absolute inset-0 z-50 pointer-events-none">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-600"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                left: selectedNodes ? '30%' : '50%',
              }}
            >
              <GlassPanel
                layoutId={selectedId}
                width="60vw"
                height="80vh"
                className="pointer-events-auto"
                onClick={() => {}}
                disableParallax={true}
                style={{
                  // 保持原始卡片 288:416 比例 (0.6923)，同时放大尺寸
                  maxWidth: 540,
                  maxHeight: 780,
                }}
                >
                {resolvedSchema ? (
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-light tracking-widest text-white/40">
                          {selectedPanel.title}
                        </span>
                      </div>
                    }
                  >
                    {resolvedSchema.interactive ? (
                      <resolvedSchema.Component isExpanded={true} onNodesSelected={onNodesSelected} />
                    ) : (
                      <resolvedSchema.Component isExpanded={true} />
                    )}
                  </Suspense>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-light tracking-widest text-white/40">
                      {selectedPanel.title}
                    </span>
                  </div>
                )}
              </GlassPanel>
            </div>
          </div>

          {/* Right-side panel - appears when nodes selected */}
          <AnimatePresence>
            {selectedNodes && (
              <motion.div
                className="absolute inset-0 z-50 flex items-center justify-end pointer-events-none"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{ paddingRight: '10vw' }}
              >
                <GlassPanel
                  width="50vw"
                  height="80vh"
                  className="pointer-events-auto"
                  onClick={() => {}}
                  disableParallax={true}
                  style={{
                    maxWidth: 540,
                    maxHeight: 780,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <span className="text-2xl font-light tracking-widest text-white/60">Sample Text</span>
                  </div>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
