import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import GlassPanel from './components/GlassPanel'

// 懒加载 SchemaL、SchemaR、SchemaI 和 SchemaD 组件
const SchemaL = lazy(() => import('./components/SchemaL'))
const SchemaR = lazy(() => import('./components/SchemaR'))
const SchemaI = lazy(() => import('./components/SchemaI'))
const SchemaD = lazy(() => import('./components/SchemaD'))

interface PanelData {
  id: string
  title: string
}

const panels: PanelData[] = [
  { id: 'panel-1', title: 'Mirror Stage' },
  { id: 'panel-2', title: 'The Symbolic' },
  { id: 'panel-3', title: 'The Imaginary' },
  { id: 'panel-4', title: 'The Real' },
  { id: 'panel-5', title: 'Panel 5' },
  { id: 'panel-6', title: 'Panel 6' },
  { id: 'panel-7', title: 'Panel 7' },
  { id: 'panel-8', title: 'Panel 8' },
]

// Global Header Variants - h1 标题
const h1Variants = {
  initial: {
    opacity: 0,
    filter: 'blur(10px)',
    y: -30,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    textShadow: [
      '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
      '0 0 8px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.12)',
      '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
    ],
  },
  blurred: {
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.95,
  },
}

// Global Header Variants - p 副标题
const pVariants = {
  initial: {
    opacity: 0,
    filter: 'blur(8px)',
    y: -20,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    textShadow: [
      '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
      '0 0 5px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.12)',
      '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
    ],
  },
  blurred: {
    opacity: 0,
    filter: 'blur(12px)',
    scale: 0.95,
  },
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState<[string, string] | null>(null)

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

  return (
    <div className="app-container">
      <DeepEnvironment />

      {/* Global Header - 使用 gap 控制间距，带呼吸光效 */}
      <motion.div
        className={`relative top-20 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none ${selectedId ? 'z-0' : 'z-10'}`}
        animate={selectedId ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h1
          className="text-5xl font-light tracking-[0.35em] text-white/70 leading-none"
          initial="initial"
          variants={h1Variants}
          animate={selectedId ? "blurred" : "visible"}
          transition={{
            opacity: shouldAnimateEntry
              ? { delay: 0.3, duration: 0.6, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            filter: shouldAnimateEntry
              ? { delay: 0.3, duration: 0.6, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            y: shouldAnimateEntry
              ? { delay: 0.3, duration: 0.6, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            scale: { duration: 0.4 },
            textShadow: { duration: 4, ease: 'easeInOut', repeat: Infinity },
          }}
        >
          LACAN.JS
        </motion.h1>
        <motion.p
          className="text-base font-light tracking-[0.35em] text-white/40"
          initial="initial"
          variants={pVariants}
          animate={selectedId ? "blurred" : "visible"}
          transition={{
            opacity: shouldAnimateEntry
              ? { delay: 0.5, duration: 0.5, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            filter: shouldAnimateEntry
              ? { delay: 2.5, duration: 0.8, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            y: shouldAnimateEntry
              ? { delay: 2.5, duration: 0.8, ease: 'easeOut' }
              : { duration: 0.4, ease: 'easeInOut' },
            scale: { duration: 0.4 },
            textShadow: { duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 0.5 },
          }}
        >
          The Spatial Architecture of Psychoanalysis
        </motion.p>
      </motion.div>

      {/* Tiled Gallery Layout */}
      <div className="relative flex items-center justify-center p-8 min-h-screen">
        <div className="flex flex-row flex-wrap justify-center items-center gap-12 pt-24 pb-24">
          {panels.map((panel, index) => {
            // 随机进场顺序
            const delay = 3.3 + randomOrder.indexOf(index) * 0.15
            const isSelected = selectedId === panel.id
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
                  ease: 'easeOut'
                }}
              >
                {/* 包裹容器 */}
                <div className="relative flex flex-col items-center">
                  {/* 主面板 */}
                  <GlassPanel
                    layoutId={panel.id}
                    width={288}
                    height={416}
                    onClick={() => setSelectedId(panel.id)}
                    className="cursor-pointer"
                  >
                    {panel.id === 'panel-1' ? (
                      <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-light tracking-widest text-white/40">
                            {panel.title}
                          </span>
                        </div>
                      }>
                        <SchemaL isExpanded={false} onNodesSelected={handleNodesSelected} />
                      </Suspense>
                    ) : panel.id === 'panel-2' ? (
                      <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-light tracking-widest text-white/40">
                            {panel.title}
                          </span>
                        </div>
                      }>
                        <SchemaR isExpanded={false} />
                      </Suspense>
                    ) : panel.id === 'panel-3' ? (
                      <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-light tracking-widest text-white/40">
                            {panel.title}
                          </span>
                        </div>
                      }>
                        <SchemaI isExpanded={false} onNodesSelected={handleNodesSelected} />
                      </Suspense>
                    ) : panel.id === 'panel-4' ? (
                      <Suspense fallback={
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-light tracking-widest text-white/40">
                            {panel.title}
                          </span>
                        </div>
                      }>
                        <SchemaD isExpanded={false} onNodesSelected={handleNodesSelected} />
                      </Suspense>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-light tracking-widest text-white/40">
                          {panel.title}
                        </span>
                      </div>
                    )}
                  </GlassPanel>

                  {/* 倒影层 */}
                  {!selectedId && (
                    <div
                      className="absolute top-full mt-2 left-0 w-full pointer-events-none z-0"
                      style={{
                        transform: 'scaleY(-1)',
                        filter: 'blur(8px)',
                        opacity: 0.5,
                        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
                      }}
                    >
                      <GlassPanel
                        width={288}
                        height={416}
                      >
                        {panel.id === 'panel-1' ? (
                          <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xl font-light tracking-widest text-white/40">
                                {panel.title}
                              </span>
                            </div>
                          }>
                            <SchemaL isExpanded={false} />
                          </Suspense>
                        ) : panel.id === 'panel-2' ? (
                          <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xl font-light tracking-widest text-white/40">
                                {panel.title}
                              </span>
                            </div>
                          }>
                            <SchemaR isExpanded={false} />
                          </Suspense>
                        ) : panel.id === 'panel-3' ? (
                          <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xl font-light tracking-widest text-white/40">
                                {panel.title}
                              </span>
                            </div>
                          }>
                            <SchemaI isExpanded={false} />
                          </Suspense>
                        ) : panel.id === 'panel-4' ? (
                          <Suspense fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xl font-light tracking-widest text-white/40">
                                {panel.title}
                              </span>
                            </div>
                          }>
                            <SchemaD isExpanded={false} />
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
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Focus View - selected panel expanded */}
      <AnimatePresence>
        {selectedId && selectedPanel && (
          <>
            {/* Backdrop mask */}
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExitFocus}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Expanded Panel - moves to left when nodes selected */}
            <div
              className="absolute inset-0 z-50 pointer-events-none"
            >
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
                  {selectedPanel.id === 'panel-1' ? (
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-light tracking-widest text-white/40">
                          {selectedPanel.title}
                        </span>
                      </div>
                    }>
                      <SchemaL isExpanded={true} onNodesSelected={handleNodesSelected} />
                    </Suspense>
                  ) : selectedPanel.id === 'panel-2' ? (
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-light tracking-widest text-white/40">
                          {selectedPanel.title}
                        </span>
                      </div>
                    }>
                      <SchemaR isExpanded={true} />
                    </Suspense>
                  ) : selectedPanel.id === 'panel-3' ? (
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-light tracking-widest text-white/40">
                          {selectedPanel.title}
                        </span>
                      </div>
                    }>
                      <SchemaI isExpanded={true} onNodesSelected={handleNodesSelected} />
                    </Suspense>
                  ) : selectedPanel.id === 'panel-4' ? (
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-light tracking-widest text-white/40">
                          {selectedPanel.title}
                        </span>
                      </div>
                    }>
                      <SchemaD isExpanded={true} onNodesSelected={handleNodesSelected} />
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
                      <span className="text-2xl font-light tracking-widest text-white/60">
                        Sample Text
                      </span>
                    </div>
                  </GlassPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
