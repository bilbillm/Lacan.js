import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import DeepEnvironment from './components/DeepEnvironment'
import GlassPanel from './components/GlassPanel'

interface PanelData {
  id: string
  title: string
}

const panels: PanelData[] = [
  { id: 'panel-1', title: 'Mirror Stage' },
  { id: 'panel-2', title: 'The Symbolic' },
  { id: 'panel-3', title: 'The Imaginary' },
  { id: 'panel-4', title: 'The Real' },
]

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedPanel = panels.find(p => p.id === selectedId)

  return (
    <div className="app-container">
      <DeepEnvironment />

      {/* Global Header - 使用 gap 控制间距，带呼吸光效 */}
      <div className="absolute top-20 left-0 right-0 z-10 flex flex-col items-center gap-4 pointer-events-none">
        <motion.h1
          className="text-5xl font-light tracking-[0.35em] text-white/70 leading-none"
          animate={{
            textShadow: [
              '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
              '0 0 8px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.12)',
              '0 0 5px rgba(255,255,255,0.3), 0 0 15px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          LACAN.JS
        </motion.h1>
        <motion.p
          className="text-base font-light tracking-[0.35em] text-white/40"
          animate={{
            textShadow: [
              '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
              '0 0 5px rgba(255,255,255,0.25), 0 0 12px rgba(255,255,255,0.12)',
              '0 0 3px rgba(255,255,255,0.15), 0 0 8px rgba(255,255,255,0.08)',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          The Spatial Architecture of Psychoanalysis
        </motion.p>
      </div>

      {/* Tiled Gallery Layout - only show when no panel is selected */}
      {!selectedId && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="flex flex-row flex-wrap justify-center items-center gap-12 pt-24">
            {panels.map((panel) => (
              <GlassPanel
                key={panel.id}
                layoutId={panel.id}
                width={288}
                height={416}
                onClick={() => setSelectedId(panel.id)}
                className="cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-light tracking-widest text-white/40">
                    {panel.title}
                  </span>
                </div>
              </GlassPanel>
            ))}
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
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-light tracking-widest text-white/40">
                    {selectedPanel.title}
                  </span>
                </div>
              </GlassPanel>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
