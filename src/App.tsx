import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import GlassPanel from './components/GlassPanel'

// 懒加载 SchemaL 组件
const SchemaL = lazy(() => import('./components/SchemaL'))

interface PanelData {
  id: string
  title: string
  content?: React.ReactNode
}

const panels: PanelData[] = [
  { id: 'panel-1', title: 'Mirror Stage', content: <SchemaL /> },
  { id: 'panel-2', title: 'The Symbolic' },
  { id: 'panel-3', title: 'The Imaginary' },
  { id: 'panel-4', title: 'The Real' },
]

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAppLoaded, setIsAppLoaded] = useState(false)

  const selectedPanel = panels.find(p => p.id === selectedId)

  // 随机进场顺序 - 每次刷新页面不同
  const randomOrder = useMemo(() => {
    const indices = [0, 1, 2, 3]
    return indices.sort(() => Math.random() - 0.5)
  }, [])

  // 进场动画彻底完成后标记加载完成
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 4600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-container">
      <DeepEnvironment />

      {/* Global Header - 使用 gap 控制间距，带呼吸光效 */}
      <div className="absolute top-20 left-0 right-0 z-10 flex flex-col items-center gap-4 pointer-events-none">
        <motion.h1
          className="text-5xl font-light tracking-[0.35em] text-white/70 leading-none"
          initial={{ opacity: 0, filter: 'blur(10px)', y: -30 }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            textShadow: [
              '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
              '0 0 8px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.12)',
              '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
            ],
          }}
          transition={{
            opacity: { delay: 2, duration: 1.2, ease: 'easeOut' },
            filter: { delay: 2, duration: 1.2, ease: 'easeOut' },
            y: { delay: 2, duration: 1.2, ease: 'easeOut' },
            textShadow: {
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity,
            },
          }}
        >
          LACAN.JS
        </motion.h1>
        <motion.p
          className="text-base font-light tracking-[0.35em] text-white/40"
          initial={{ opacity: 0, filter: 'blur(8px)', y: -20 }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            textShadow: [
              '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
              '0 0 5px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.12)',
              '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
            ],
          }}
          transition={{
            opacity: { delay: 2.5, duration: 0.8, ease: 'easeOut' },
            filter: { delay: 2.5, duration: 0.8, ease: 'easeOut' },
            y: { delay: 2.5, duration: 0.8, ease: 'easeOut' },
            textShadow: {
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: 0.5,
            },
          }}
        >
          The Spatial Architecture of Psychoanalysis
        </motion.p>
      </div>

      {/* Tiled Gallery Layout - only show when no panel is selected */}
      {!selectedId && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="flex flex-row flex-wrap justify-center items-center gap-12 pt-24">
            {panels.map((panel, index) => {
              // 随机进场顺序
              const delay = 3.3 + randomOrder.indexOf(index) * 0.15
              return (
                <motion.div
                  key={panel.id}
                  layout
                  initial={isAppLoaded ? false : { opacity: 0, y: 30, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: isAppLoaded ? 0 : delay,
                    duration: 0.8,
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
                      {panel.content ? (
                        <Suspense fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl font-light tracking-widest text-white/40">
                              {panel.title}
                            </span>
                          </div>
                        }>
                          {panel.content}
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
                          {panel.content ? (
                            <Suspense fallback={
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xl font-light tracking-widest text-white/40">
                                  {panel.title}
                                </span>
                              </div>
                            }>
                              {panel.content}
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
      )}

      {/* Focus View - selected panel expanded to center */}
      <AnimatePresence>
        {selectedId && selectedPanel && (
          <>
            {/* Backdrop mask */}
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Expanded Panel */}
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <GlassPanel
                layoutId={selectedId}
                width="60vw"
                height="80vh"
                className="pointer-events-auto"
                onClick={() => {}}
                style={{
                  maxWidth: 500,
                  maxHeight: 600,
                }}
              >
                {selectedPanel.content ? (
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-light tracking-widest text-white/40">
                        {selectedPanel.title}
                      </span>
                    </div>
                  }>
                    {selectedPanel.content}
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
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
