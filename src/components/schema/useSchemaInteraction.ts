import { useCallback, useState } from 'react'

export function useSchemaInteraction<NodeId extends string>(
  onNodesSelected?: (node1: NodeId, node2: NodeId) => void,
) {
  const [selectedNodes, setSelectedNodes] = useState<NodeId[]>([])
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null)

  const handleNodeClick = useCallback((nodeId: NodeId) => {
    setSelectedNodes(prev => {
      const newSelected = prev.includes(nodeId)
        ? prev.filter(node => node !== nodeId)
        : prev.length >= 2
          ? [nodeId]
          : [...prev, nodeId]

      if (newSelected.length === 2 && onNodesSelected) {
        onNodesSelected(newSelected[0], newSelected[1])
      }

      return newSelected
    })
  }, [onNodesSelected])

  return {
    selectedNodes,
    hoveredNode,
    setHoveredNode,
    handleNodeClick,
  }
}
