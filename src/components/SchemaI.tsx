import { useState, useCallback } from 'react'
import schemaIUrl from '../svgs/lacan schema I_1.svg?url'

interface SchemaIProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'O' | 'Sym' | 'Im'

interface NodeConfig {
  id: NodeId
  cx: number
  cy: number
  r: number
}

// Schema I 的四个节点配置
// 基于 SVG viewBox="0 0 227.757 150.84"
const NODES: NodeConfig[] = [
  { id: 'S', cx: 71.34, cy: 126.18, r: 8 },    // 中心 S
  { id: 'O', cx: 213.08, cy: 126.18, r: 8 },   // 右侧 O
  { id: 'Sym', cx: 14.17, cy: 12.48, r: 8 },   // 左上 Sym
  { id: 'Im', cx: 14.17, cy: 126.18, r: 8 },   // 左下 Im
]

export default function SchemaI({ isExpanded = false, onNodesSelected }: SchemaIProps) {
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
          Schema I
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        <img 
          src={schemaIUrl} 
          alt="Schema I" 
          className="w-full h-full max-w-full max-h-full"
          style={{ 
            display: 'block',
            filter: 'invert(1) opacity(0.8)'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 227.757 150.84"
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
