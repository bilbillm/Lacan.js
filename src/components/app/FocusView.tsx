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
  FOCUS_BACKDROP_FADE_S,
  FOCUS_EXIT_MS,
  FOCUS_PANEL_MAX_HEIGHT,
  FOCUS_PANEL_MAX_WIDTH,
  FOCUS_PANEL_VIEWPORT_SIZES,
} from './uiConstants'

interface FocusViewProps {
  selectedId: string | null
  selectedPanel?: PanelData
  selectedNodes: string[]
  isMobileViewport: boolean
  language: Language
  onExitFocus: () => void
  onSelectionChange: (panelId: string, nodeIds: string[]) => void
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
}

export default function FocusView({
  selectedId,
  selectedPanel,
  selectedNodes,
  isMobileViewport,
  language,
  onExitFocus,
  onSelectionChange,
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

  const selectedPanelText = selectedPanel ? getPanelText(selectedPanel, language) : null
  const hasSecondaryPanel = selectedNodes.length === 2
  const secondaryPanelContent = hasSecondaryPanel
    ? `${selectedPanelText?.title ?? ''} · ${selectedNodes.join(' · ')}`
    : ''

  const focusPanelContent = resolvedSchema ? (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span
            className="text-3xl tracking-widest"
            style={{ color: 'var(--lacan-muted)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
          >
            {selectedPanelText?.title}
          </span>
        </div>
      }
    >
      {resolvedSchema.interactive ? (
        <resolvedSchema.Component
          isExpanded={true}
          selectedNodes={selectedNodes}
          onSelectionChange={(nodeIds) => onSelectionChange(selectedPanel!.id, nodeIds)}
        />
      ) : (
        <resolvedSchema.Component isExpanded={true} />
      )}
    </Suspense>
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <span
        className="text-3xl tracking-widest"
        style={{ color: 'var(--lacan-muted)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
      >
        {selectedPanelText?.title}
      </span>
    </div>
  )

  return (
    <AnimatePresence>
      {selectedId && selectedPanel && (
        <>
          {/* Backdrop mask */}
          <motion.div
            className="focus-backdrop absolute inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onExitFocus}
            transition={{ duration: FOCUS_BACKDROP_FADE_S, ease: 'easeOut' }}
            style={{
              background: 'var(--lacan-focus-backdrop)',
            }}
          />

          <div className="focus-overlay absolute inset-0 z-50 pointer-events-none">
            {isMobileViewport ? (
              <div
                className="focus-view-shell absolute inset-0 z-50 pointer-events-none"
                data-testid="focus-view"
              >
                <div
                  className="mx-auto flex h-full w-full flex-col items-center overflow-y-auto pointer-events-auto"
                  style={{
                    maxWidth: FOCUS_PANEL_MAX_WIDTH,
                    gap: `${FOCUS_PANEL_VIEWPORT_SIZES.mobile.stackGap}px`,
                  }}
                >
                  <button
                    type="button"
                    className="mobile-focus-close"
                    data-testid="mobile-focus-close"
                    aria-label={uiCopy.focus.close[language]}
                    onClick={onExitFocus}
                  >
                    ×
                  </button>
                  <GlassPanel
                    layoutId={selectedId}
                    width={FOCUS_PANEL_VIEWPORT_SIZES.mobile.panelWidth}
                    height="min(82vh, 640px)"
                    className="pointer-events-auto"
                    onClick={() => {}}
                    disableParallax={true}
                    isMobileViewport={isMobileViewport}
                    style={{
                      maxWidth: FOCUS_PANEL_MAX_WIDTH,
                      maxHeight: FOCUS_PANEL_MAX_HEIGHT,
                    }}
                  >
                    {focusPanelContent}
                  </GlassPanel>

                  <AnimatePresence>
                    {hasSecondaryPanel && (
                      <motion.div
                        className="w-full flex justify-center"
                        data-testid="focus-secondary"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{
                          duration: FOCUS_EXIT_MS / 1000,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <GlassPanel
                          width={FOCUS_PANEL_VIEWPORT_SIZES.mobile.panelWidth}
                          height={FOCUS_PANEL_VIEWPORT_SIZES.mobile.secondaryHeight}
                          className="pointer-events-auto"
                          onClick={() => {}}
                          disableParallax={true}
                          isMobileViewport={isMobileViewport}
                          style={{
                            maxWidth: FOCUS_PANEL_MAX_WIDTH,
                            maxHeight: FOCUS_PANEL_MAX_HEIGHT,
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center p-8">
                            <span
                              className="text-2xl tracking-widest"
                              style={{ color: 'var(--lacan-vermilion)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
                            >
                              {secondaryPanelContent}
                            </span>
                          </div>
                        </GlassPanel>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                {/* Expanded Panel - moves to left when nodes selected */}
                <div className="focus-view-shell absolute inset-0 z-50 pointer-events-none" data-testid="focus-view">
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-600"
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                      left: hasSecondaryPanel
                        ? FOCUS_PANEL_VIEWPORT_SIZES.desktop.mainShiftedLeft
                        : FOCUS_PANEL_VIEWPORT_SIZES.desktop.mainCenteredLeft,
                    }}
                  >
                    <GlassPanel
                      layoutId={selectedId}
                      width={FOCUS_PANEL_VIEWPORT_SIZES.desktop.mainWidth}
                      height={FOCUS_PANEL_VIEWPORT_SIZES.desktop.panelHeight}
                      className="pointer-events-auto"
                      onClick={() => {}}
                      disableParallax={true}
                      isMobileViewport={isMobileViewport}
                      style={{
                        maxWidth: FOCUS_PANEL_MAX_WIDTH,
                        maxHeight: FOCUS_PANEL_MAX_HEIGHT,
                      }}
                    >
                      {focusPanelContent}
                    </GlassPanel>
                  </div>
                </div>

                {/* Right-side panel - appears when nodes selected */}
                <AnimatePresence>
                  {hasSecondaryPanel && (
                    <motion.div
                      className="focus-secondary-shell absolute inset-0 z-50 flex items-center justify-end pointer-events-none"
                      data-testid="focus-secondary"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{
                        duration: FOCUS_EXIT_MS / 1000,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      style={{ paddingRight: FOCUS_PANEL_VIEWPORT_SIZES.desktop.secondaryPaddingRight }}
                    >
                      <GlassPanel
                        width={FOCUS_PANEL_VIEWPORT_SIZES.desktop.secondaryWidth}
                        height={FOCUS_PANEL_VIEWPORT_SIZES.desktop.panelHeight}
                        className="pointer-events-auto"
                        onClick={() => {}}
                        disableParallax={true}
                        isMobileViewport={isMobileViewport}
                        style={{
                          maxWidth: FOCUS_PANEL_MAX_WIDTH,
                          maxHeight: FOCUS_PANEL_MAX_HEIGHT,
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <span
                            className="text-2xl tracking-widest"
                            style={{ color: 'var(--lacan-vermilion)', fontFamily: 'var(--lacan-title-font)', fontWeight: 'var(--lacan-title-weight)' }}
                          >
                            {secondaryPanelContent}
                          </span>
                        </div>
                      </GlassPanel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
