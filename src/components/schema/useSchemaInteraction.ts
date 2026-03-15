import { useCallback, useState } from 'react'

export function getNextSelectedNodes<NodeId extends string>(currentSelectedNodes: NodeId[], nodeId: NodeId) {
  return currentSelectedNodes.includes(nodeId)
    ? currentSelectedNodes.filter(node => node !== nodeId)
    : currentSelectedNodes.length >= 2
      ? [nodeId]
      : [...currentSelectedNodes, nodeId]
}

export function useSchemaInteraction<NodeId extends string>(
  selectedNodes: NodeId[],
  onSelectionChange?: (nodeIds: NodeId[]) => void,
) {
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null)

  const handleNodeClick = useCallback((nodeId: NodeId) => {
    const newSelected = getNextSelectedNodes(selectedNodes, nodeId)
    onSelectionChange?.(newSelected)
  }, [onSelectionChange, selectedNodes])

  return {
    selectedNodes,
    hoveredNode,
    setHoveredNode,
    handleNodeClick,
  }
}
