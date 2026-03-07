import { useState, useCallback } from 'react'
import schemaLUrl from '../svgs/lacan schema L_1.svg?url'

interface SchemaLProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'A' | 'a' | "a'"

interface NodeConfig {
  id: NodeId
  cx: number
  cy: number
  r: number
}

// Schema L 的四个节点配置
// 基于 SVG viewBox="0 0 143.109 81.646"
const NODES: NodeConfig[] = [
  { id: 'S', cx: 37.52, cy: 12.48, r: 6 },   // 左下 S (黑色填充)
  { id: 'A', cx: 94.21, cy: 12.48, r: 6 },   // 右下 A (黑色填充)
  { id: "a'", cx: 37.52, cy: 69.17, r: 6 },  // 左上 a' (白色填充)
  { id: 'a', cx: 94.21, cy: 69.17, r: 6 },   // 右上 a (白色填充)
]

export default function SchemaL({ isExpanded = false, onNodesSelected }: SchemaLProps) {
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
          Schema L
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* 基础 SVG - 使用URL导入 */}
        <img 
          src={schemaLUrl} 
          alt="Schema L" 
          className="w-full h-full max-w-full max-h-full"
          style={{ 
            display: 'block',
            filter: 'invert(1) opacity(0.8)'
          }}
        />

        {/* 透明交互叠加层 */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 143.109 81.646"
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
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
