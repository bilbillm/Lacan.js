import { useState, useMemo, useEffect, lazy, Suspense, type CSSProperties } from 'react'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import AppHeader from './components/app/AppHeader'
import PanelGallery from './components/app/PanelGallery'
import FocusView from './components/app/FocusView'
import ScrollIndicator from './components/app/ScrollIndicator'
import { panels } from './components/app/panels'
import useMobileViewport from './components/app/useMobileViewport'
import {
  CARD_ENTRY_START_DELAY_MS,
  FOCUS_EXIT_MS,
  HEADER_ENTRY_DELAY_MS,
  RESPONSIVE_SIZE_TOKENS,
  WHEEL_NAV_THRESHOLD,
} from './components/app/uiConstants'

// 懒加载 SchemaL、SchemaR、SchemaI 和 SchemaD 组件
const SchemaL = lazy(() => import('./components/SchemaL'))
const SchemaR = lazy(() => import('./components/SchemaR'))
const SchemaI = lazy(() => import('./components/SchemaI'))
const SchemaD = lazy(() => import('./components/SchemaD'))
const TimelineView = lazy(() => import('./components/app/TimelineView'))

const createRandomOrder = () => {
  const indices = [0, 1, 2, 3, 4, 5, 6, 7]
  return indices.sort(() => Math.random() - 0.5)
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [selectedNodeState, setSelectedNodeState] = useState<{ panelId: string; nodeIds: string[] } | null>(null)
  const [pageGroup, setPageGroup] = useState(0)
  const [isExitingFocus, setIsExitingFocus] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [hasVisitedTimeline, setHasVisitedTimeline] = useState(false)
  const [randomOrder] = useState(createRandomOrder)
  const isMobileViewport = useMobileViewport()

  const panelsPerPage = 4
  const totalPages = Math.ceil(panels.length / panelsPerPage)

  const currentPanels = panels.slice(pageGroup * panelsPerPage, (pageGroup + 1) * panelsPerPage)

  const selectedPanel = panels.find(p => p.id === selectedId)

  const selectedNodes = selectedNodeState?.panelId === selectedId ? selectedNodeState.nodeIds : []

  const handleSelectPanel = (panelId: string) => {
    setSelectedId(panelId)
  }

  const handleSelectionChange = (panelId: string, nodeIds: string[]) => {
    setSelectedNodeState(nodeIds.length > 0 ? { panelId, nodeIds } : null)
  }

  // 处理退出聚焦（先清除节点选择，触发退场动画后再退出聚焦）
  const handleExitFocus = () => {
    setIsExitingFocus(true)
    setSelectedNodeState(null)
    setShowTimeline(false)
    setSelectedId(null)
    setTimeout(() => {
      setIsExitingFocus(false)
    }, FOCUS_EXIT_MS)
  }

  // 判断是否应该使用延迟入场动画：首次加载时
  const shouldAnimateEntry = !isAppLoaded

  // 进场动画彻底完成后标记加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoaded(true)
    }, CARD_ENTRY_START_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleGalleryWheel = (deltaY: number) => {
    if (selectedId) return

    if (deltaY > WHEEL_NAV_THRESHOLD) {
      setPageGroup((prev) => (prev + 1) % totalPages)
    } else if (deltaY < -WHEEL_NAV_THRESHOLD) {
      setPageGroup((prev) => (prev - 1 + totalPages) % totalPages)
    }
  }

  const handleContainerWheel = (event: React.WheelEvent) => {
    if (isMobileViewport || selectedId !== null) return
    if (!showTimeline && event.deltaY > WHEEL_NAV_THRESHOLD) {
      setShowTimeline(true)
      setHasVisitedTimeline(true)
    } else if (showTimeline && event.deltaY < -WHEEL_NAV_THRESHOLD) {
      setShowTimeline(false)
    }
  }

  const appShellStyle = useMemo<CSSProperties>(() => ({
    '--app-shell-padding-inline-desktop': `${RESPONSIVE_SIZE_TOKENS.shellPaddingInline.desktop}px`,
    '--app-shell-padding-inline-mobile': `${RESPONSIVE_SIZE_TOKENS.shellPaddingInline.mobile}px`,
    '--app-shell-padding-top-desktop': `${RESPONSIVE_SIZE_TOKENS.shellPaddingTop.desktop}px`,
    '--app-shell-padding-top-mobile': `${RESPONSIVE_SIZE_TOKENS.shellPaddingTop.mobile}px`,
    '--app-shell-padding-bottom-desktop': `${RESPONSIVE_SIZE_TOKENS.shellPaddingBottom.desktop}px`,
    '--app-shell-padding-bottom-mobile': `${RESPONSIVE_SIZE_TOKENS.shellPaddingBottom.mobile}px`,
    '--app-header-top-desktop': `${RESPONSIVE_SIZE_TOKENS.headerTopOffset.desktop}px`,
    '--app-header-top-mobile': `${RESPONSIVE_SIZE_TOKENS.headerTopOffset.mobile}px`,
    '--app-progress-bottom-desktop': `${RESPONSIVE_SIZE_TOKENS.progressBottomOffset.desktop}px`,
    '--app-progress-bottom-mobile': `${RESPONSIVE_SIZE_TOKENS.progressBottomOffset.mobile}px`,
    '--app-focus-padding-inline-desktop': `${RESPONSIVE_SIZE_TOKENS.focusPaddingInline.desktop}px`,
    '--app-focus-padding-inline-mobile': `${RESPONSIVE_SIZE_TOKENS.focusPaddingInline.mobile}px`,
    '--app-focus-padding-block-desktop': `${RESPONSIVE_SIZE_TOKENS.focusPaddingBlock.desktop}px`,
    '--app-focus-padding-block-mobile': `${RESPONSIVE_SIZE_TOKENS.focusPaddingBlock.mobile}px`,
  }) as CSSProperties, [])

  return (
    <div
      className="app-container"
      data-mobile-layout={isMobileViewport ? 'true' : 'false'}
      style={appShellStyle}
      onWheel={handleContainerWheel}
    >
      <div
        className="slide-deck"
        style={{ transform: `translateY(${showTimeline ? '-100vh' : '0'})` }}
      >
        <div className="slide">
          <DeepEnvironment />

          <AppHeader
            selectedId={selectedId}
            shouldAnimateEntry={shouldAnimateEntry}
            entryDelayMs={HEADER_ENTRY_DELAY_MS}
            isMobileViewport={isMobileViewport}
          />

          <PanelGallery
            pageGroup={pageGroup}
            totalPages={totalPages}
            currentPanels={currentPanels}
            randomOrder={randomOrder}
            selectedId={selectedId}
            selectedNodeState={selectedNodeState}
            isAppLoaded={isAppLoaded}
            cardEntryStartDelayMs={CARD_ENTRY_START_DELAY_MS}
            isMobileViewport={isMobileViewport}
            onSelectPanel={handleSelectPanel}
            onSelectionChange={handleSelectionChange}
            SchemaL={SchemaL}
            SchemaR={SchemaR}
            SchemaI={SchemaI}
            SchemaD={SchemaD}
            onWheelNavigate={handleGalleryWheel}
          />
        </div>

        <div className="slide" style={{ background: 'rgb(5, 5, 7)' }}>
          <DeepEnvironment />
          {(showTimeline || hasVisitedTimeline) && (
            <Suspense fallback={null}>
              <TimelineView isMobileViewport={isMobileViewport} />
            </Suspense>
          )}
        </div>
      </div>

      {!selectedId && !isMobileViewport && (
        <ScrollIndicator timelineActive={showTimeline} />
      )}

      {selectedId && selectedPanel && !showTimeline && (
        <FocusView
          selectedId={selectedId}
          selectedPanel={selectedPanel}
          selectedNodes={selectedNodes}
          isExitingFocus={isExitingFocus}
          isMobileViewport={isMobileViewport}
          onExitFocus={handleExitFocus}
          onSelectionChange={handleSelectionChange}
          SchemaL={SchemaL}
          SchemaR={SchemaR}
          SchemaI={SchemaI}
          SchemaD={SchemaD}
        />
      )}
    </div>
  )
}

export default App
