import schemaLSvgContent from '../svgs/lacan schema L_1.svg?raw'
import { useMemo, useRef, useEffect, useState, useCallback } from 'react'

interface SchemaLProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'A' | 'a' | "a'"

export default function SchemaL({ isExpanded = false, onNodesSelected }: SchemaLProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedNodes, setSelectedNodes] = useState<NodeId[]>([])

  // 处理 SVG 内容，将黑色改为白色
  const processedSvg = useMemo(() => {
    let svg = schemaLSvgContent

    // 调试：检测潜在节点数量
    const potentialMatches = svg.match(/<path[^>]*transform="matrix[^>]*>/g)
    console.log('[SchemaL] 潜在节点数量:', potentialMatches ? potentialMatches.length : 0)

    // 将黑色 stroke 替换为白色半透明
    svg = svg.replace(/stroke:rgb\(0%,0%,0%\)/g, 'stroke:rgba(255,255,255,0.5)')
    svg = svg.replace(/stroke:rgb\(0%, 0%, 0%\)/g, 'stroke:rgba(255,255,255,0.5)')
    // 将黑色 fill 替换为白色（节点）
    svg = svg.replace(/fill:rgb\(0%,0%,0%\)/g, 'fill:rgba(255,255,255,0.8)')
    svg = svg.replace(/fill:rgb\(0%, 0%, 0%\)/g, 'fill:rgba(255,255,255,0.8)')
    // 将白色 fill 保持
    svg = svg.replace(/fill:rgb\(100%,100%,100%\)/g, 'fill:rgba(255,255,255,0.9)')
    svg = svg.replace(/fill:rgb\(100%, 100%, 100%\)/g, 'fill:rgba(255,255,255,0.9)')

    // 注入交互属性到四个圆节点
    // 圆点特征：fill + transform="matrix(...)" + stroke-width
    // 分步匹配：不依赖属性顺序
    const nodeIds: NodeId[] = ['S', 'A', "a'", 'a']
    let nodeIndex = 0

    // 匹配所有带 transform="matrix 的 path 元素
    svg = svg.replace(
      /<path(\s+[^>]*)?>/g,
      (match, attrs) => {
        if (nodeIndex >= 4) return match

        // attrs 可能是 undefined 或空字符串
        const attrStr = attrs || ''

        // 检查是否包含 transform="matrix
        const hasTransform = attrStr.includes('transform="matrix')
        // 检查是否包含 fill:rgba(255,255,255,0.8 或 0.9
        const hasFill = attrStr.includes('fill:rgba(255,255,255,0.8)') || attrStr.includes('fill:rgba(255,255,255,0.9)')
        // 检查是否包含 stroke-width
        const hasStrokeWidth = attrStr.includes('stroke-width')

        // 只有同时满足这三个条件才是圆节点
        if (hasTransform && hasFill && hasStrokeWidth) {
          const nodeId = nodeIds[nodeIndex]
          console.log(`[SchemaL] 注入节点 ${nodeIndex}: ${nodeId}`)
          nodeIndex++
          return match.replace('<path', `<path id="node-${nodeId}" class="lacan-node"`)
        }

        return match
      }
    )

    console.log(`[SchemaL] 最终注入节点数: ${nodeIndex}`)

    return svg
  }, [])

  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodes(prev => {
      const currentNode = nodeId.replace('node-', '') as NodeId
      const newSelected = prev.includes(currentNode)
        ? prev.filter(n => n !== currentNode) // 取消选中
        : prev.length >= 2
          ? [currentNode] // 超过2个时，清空并只保留当前
          : [...prev, currentNode] // 添加选中

      // 当选中2个节点时触发回调
      if (newSelected.length === 2 && onNodesSelected) {
        onNodesSelected(newSelected[0], newSelected[1])
      }

      return newSelected
    })
  }, [onNodesSelected])

  // 使用 useEffect 绑定事件监听
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const svgElement = container.querySelector('svg')
    if (!svgElement) return

    // 更新选中状态样式
    const updateSelectionStyles = () => {
      const nodes = svgElement.querySelectorAll('.lacan-node') as NodeListOf<SVGPathElement>
      nodes.forEach(node => {
        const nodeId = node.id.replace('node-', '') as NodeId
        const isSelected = selectedNodes.includes(nodeId)

        if (isSelected) {
          node.style.stroke = '#fff'
          node.style.strokeWidth = '3px'
          node.style.strokeDasharray = '0'
          node.style.transition = 'stroke 0.2s ease, stroke-width 0.2s ease'
        } else {
          node.style.stroke = 'transparent'
          node.style.strokeWidth = '3px'
          node.style.strokeDasharray = '0'
        }
      })
    }

    // 获取四个圆节点
    const nodes = svgElement.querySelectorAll('.lacan-node') as NodeListOf<SVGPathElement>

    // 调试：验证只有4个节点
    if (nodes.length !== 4) {
      console.warn(`[SchemaL] Expected 4 nodes, found ${nodes.length}`)
      nodes.forEach((node, i) => {
        console.log(`Node ${i}:`, node.id, node.getAttribute('d')?.slice(0, 50))
      })
    }

    // 添加 hover 效果
    const handleMouseEnter = (e: Event) => {
      const target = e.target as SVGPathElement
      const nodeId = target.id.replace('node-', '') as NodeId
      if (!selectedNodes.includes(nodeId)) {
        target.style.stroke = 'rgba(255,255,255,0.6)'
        target.style.strokeWidth = '3px'
        target.style.strokeDasharray = '2 2'
      }
    }

    const handleMouseLeave = (e: Event) => {
      const target = e.target as SVGPathElement
      const nodeId = target.id.replace('node-', '') as NodeId
      if (!selectedNodes.includes(nodeId)) {
        target.style.stroke = 'transparent'
        target.style.strokeDasharray = '0'
      }
    }

    // 添加 hover 效果和点击事件到每个节点
    const handleNodeClickEvent = (e: Event) => {
      const target = e.currentTarget as SVGPathElement
      const nodeId = target.id
      handleNodeClick(nodeId)
    }

    nodes.forEach(node => {
      node.style.transition = 'stroke 0.2s ease, stroke-width 0.2s ease'
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)
      node.addEventListener('click', handleNodeClickEvent)
    })

    updateSelectionStyles()

    return () => {
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
        node.removeEventListener('click', handleNodeClickEvent)
      })
    }
  }, [processedSvg, selectedNodes, handleNodeClick])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      {/* CSS 锁定交互范围 */}
      <style>{`
        .lacan-svg-container svg * {
          pointer-events: none !important;
        }
        .lacan-svg-container .lacan-node {
          pointer-events: all !important;
          cursor: pointer;
        }
      `}</style>
      {/* 标题 */}
      <div className="text-center mb-2">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-xl' : 'text-base'}`}>
          Schema L
        </span>
      </div>
      {/* 使用处理后的 SVG 内容 - 居中 */}
      <div
        ref={containerRef}
        className="lacan-svg-container flex-1 w-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    </div>
  )
}
