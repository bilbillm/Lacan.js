import { useState, useCallback } from 'react'
import schemaDUrl from '../svgs/lacan graph of desire_4.svg?url'

interface SchemaDProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'O' | 'D' | 'a'

interface NodeConfig {
  id: NodeId
  cx: number
  cy: number
  r: number
}

// Graph of Desire 的四个节点配置
// 基于 SVG viewBox="0 0 207.658 194.922"
const NODES: NodeConfig[] = [
  { id: 'S', cx: 66.91, cy: 47.24, r: 10 },     // 左上 S
  { id: 'O', cx: 139.19, cy: 47.24, r: 10 },    // 右上 O
  { id: 'D', cx: 41.79, cy: 120.51, r: 10 },    // 左下 D
  { id: 'a', cx: 164.31, cy: 120.51, r: 10 },   // 右下 a
]

export default function SchemaD({ isExpanded = false, onNodesSelected }: SchemaDProps) {
  const [selectedNodes, setSelectedNodes] = useState<NodeId[]>([])
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null)

  const handleNodeClick = useCallback((nodeId: NodeId) => {
    setSelectedNodes(prev => {
      const newSelected = prev.includes(nodeId)
        ? prev.filter(n => n !== nodeId)
        : prev.length >= 2
          ? [nodeId]
          : [...prev, nodeId]

      if (newSelected.length === 2 && onNodesSelected) {
        onNodesSelected(newSelected[0], newSelected[1])
      }

      return newSelected
    })
  }, [onNodesSelected])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      <div className="text-center mb-2">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-xl' : 'text-base'}`}>
          Graph of Desire
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        <img 
          src={schemaDUrl} 
          alt="Graph of Desire" 
          className="w-full h-full max-w-full max-h-full"
          style={{ 
            display: 'block',
            filter: 'invert(1) opacity(0.8)'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 207.658 194.922"
          preserveAspectRatio="xMidYMid meet"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        >
          {NODES.map(node => {
            const isSelected = selectedNodes.includes(node.id)
            const isHovered = hoveredNode === node.id

            return (
              <circle
                key={node.id}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                className="pointer-events-auto cursor-pointer transition-all duration-200"
                fill="transparent"
                stroke={isSelected ? '#fff' : isHovered ? 'rgba(255,255,255,0.6)' : 'transparent'}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 0}
                strokeDasharray={isHovered && !isSelected ? '4 2' : '0'}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node.id)}
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}
