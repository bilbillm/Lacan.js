import { useState, useMemo, useEffect, lazy } from 'react'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import AppHeader from './components/app/AppHeader'
import PanelGallery from './components/app/PanelGallery'
import FocusView from './components/app/FocusView'
import { panels } from './components/app/panels'

// 懒加载 SchemaL、SchemaR、SchemaI 和 SchemaD 组件
const SchemaL = lazy(() => import('./components/SchemaL'))
const SchemaR = lazy(() => import('./components/SchemaR'))
const SchemaI = lazy(() => import('./components/SchemaI'))
const SchemaD = lazy(() => import('./components/SchemaD'))

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState<[string, string] | null>(null)
  const [pageGroup, setPageGroup] = useState(0)

  const panelsPerPage = 4
  const totalPages = Math.ceil(panels.length / panelsPerPage)

  const currentPanels = panels.slice(pageGroup * panelsPerPage, (pageGroup + 1) * panelsPerPage)

  const selectedPanel = panels.find(p => p.id === selectedId)

  // 处理节点选择 - 当选择两个节点时
  const handleNodesSelected = (node1: string, node2: string) => {
    setSelectedNodes([node1, node2])
  }

  // 处理退出聚焦（先清除节点选择，触发退场动画后再退出聚焦）
  const handleExitFocus = () => {
    setSelectedNodes(null)
    // 延迟 600ms 后再退出聚焦，让右侧面板有时间播放退场动画
    setTimeout(() => {
      setSelectedId(null)
    }, 600)
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
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 滚轮控制页面切换
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (selectedId) return

      e.preventDefault()

      if (e.deltaY > 30) {
        setPageGroup((prev) => (prev + 1) % totalPages)
      } else if (e.deltaY < -30) {
        setPageGroup((prev) => (prev - 1 + totalPages) % totalPages)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [selectedId, totalPages])

  return (
    <div className="app-container">
      <DeepEnvironment />

      <AppHeader selectedId={selectedId} shouldAnimateEntry={shouldAnimateEntry} />

      <PanelGallery
        pageGroup={pageGroup}
        currentPanels={currentPanels}
        randomOrder={randomOrder}
        selectedId={selectedId}
        isAppLoaded={isAppLoaded}
        onSelectPanel={setSelectedId}
        onNodesSelected={handleNodesSelected}
        SchemaL={SchemaL}
        SchemaR={SchemaR}
        SchemaI={SchemaI}
        SchemaD={SchemaD}
      />

      <FocusView
        selectedId={selectedId}
        selectedPanel={selectedPanel}
        selectedNodes={selectedNodes}
        onExitFocus={handleExitFocus}
        onNodesSelected={handleNodesSelected}
        SchemaL={SchemaL}
        SchemaR={SchemaR}
        SchemaI={SchemaI}
        SchemaD={SchemaD}
      />
    </div>
  )
}

export default App
