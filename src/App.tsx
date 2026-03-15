import { useState, useMemo, useEffect, lazy } from 'react'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import AppHeader from './components/app/AppHeader'
import PanelGallery from './components/app/PanelGallery'
import FocusView from './components/app/FocusView'
import { panels } from './components/app/panels'
import {
  CARD_ENTRY_START_DELAY_MS,
  FOCUS_EXIT_MS,
  HEADER_ENTRY_DELAY_MS,
  WHEEL_NAV_THRESHOLD,
} from './components/app/uiConstants'

// 懒加载 SchemaL、SchemaR、SchemaI 和 SchemaD 组件
const SchemaL = lazy(() => import('./components/SchemaL'))
const SchemaR = lazy(() => import('./components/SchemaR'))
const SchemaI = lazy(() => import('./components/SchemaI'))
const SchemaD = lazy(() => import('./components/SchemaD'))

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [selectedNodeState, setSelectedNodeState] = useState<{ panelId: string; nodeIds: string[] } | null>(null)
  const [pageGroup, setPageGroup] = useState(0)
  const [isExitingFocus, setIsExitingFocus] = useState(false)

  const panelsPerPage = 4
  const totalPages = Math.ceil(panels.length / panelsPerPage)

  const currentPanels = panels.slice(pageGroup * panelsPerPage, (pageGroup + 1) * panelsPerPage)

  const selectedPanel = panels.find(p => p.id === selectedId)

  const selectedNodes = selectedNodeState?.panelId === selectedId ? selectedNodeState.nodeIds : []

  const handleSelectionChange = (panelId: string, nodeIds: string[]) => {
    setSelectedNodeState(nodeIds.length > 0 ? { panelId, nodeIds } : null)
  }

  // 处理退出聚焦（先清除节点选择，触发退场动画后再退出聚焦）
  const handleExitFocus = () => {
    setIsExitingFocus(true)
    setSelectedNodeState(null)
    setSelectedId(null)
    setTimeout(() => {
      setIsExitingFocus(false)
    }, FOCUS_EXIT_MS)
  }

  // 判断是否应该使用延迟入场动画：首次加载时
  const shouldAnimateEntry = !isAppLoaded

  // 随机进场顺序 - 每次刷新页面不同
  const randomOrder = useMemo(() => {
    const indices = [0, 1, 2, 3, 4, 5, 6, 7]
    return indices.sort(() => Math.random() - 0.5)
  }, [])

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

  return (
    <div className="app-container">
      <DeepEnvironment />

      <AppHeader selectedId={selectedId} shouldAnimateEntry={shouldAnimateEntry} entryDelayMs={HEADER_ENTRY_DELAY_MS} />

      <PanelGallery
        pageGroup={pageGroup}
        totalPages={totalPages}
        currentPanels={currentPanels}
        randomOrder={randomOrder}
        selectedId={selectedId}
        selectedNodeState={selectedNodeState}
        isAppLoaded={isAppLoaded}
        cardEntryStartDelayMs={CARD_ENTRY_START_DELAY_MS}
        onSelectPanel={setSelectedId}
        onSelectionChange={handleSelectionChange}
        SchemaL={SchemaL}
        SchemaR={SchemaR}
        SchemaI={SchemaI}
        SchemaD={SchemaD}
        onWheelNavigate={handleGalleryWheel}
      />

      <FocusView
        selectedId={selectedId}
        selectedPanel={selectedPanel}
        selectedNodes={selectedNodes}
        isExitingFocus={isExitingFocus}
        onExitFocus={handleExitFocus}
        onSelectionChange={handleSelectionChange}
        SchemaL={SchemaL}
        SchemaR={SchemaR}
        SchemaI={SchemaI}
        SchemaD={SchemaD}
      />
    </div>
  )
}

export default App
