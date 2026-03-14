import schemaDUrl from '../svgs/lacan graph of desire_4.svg?url'
import schemaDGalleryUrl from '../pngs/lacan-graph-of-desire_4.png'
import { InteractiveSchemaFrame, type SchemaNodeConfig } from './schema/InteractiveSchemaFrame'
import { useSchemaInteraction } from './schema/useSchemaInteraction'

interface SchemaDProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'O' | 'D' | 'a'

// Graph of Desire 的四个节点配置
// 基于 SVG viewBox="0 0 207.658 194.922"
const NODES: SchemaNodeConfig<NodeId>[] = [
  { id: 'S', cx: 66.91, cy: 47.24, r: 10 },     // 左上 S
  { id: 'O', cx: 139.19, cy: 47.24, r: 10 },    // 右上 O
  { id: 'D', cx: 41.79, cy: 120.51, r: 10 },    // 左下 D
  { id: 'a', cx: 164.31, cy: 120.51, r: 10 },   // 右下 a
]

export default function SchemaD({ isExpanded = false, onNodesSelected }: SchemaDProps) {
  const { selectedNodes, hoveredNode, setHoveredNode, handleNodeClick } = useSchemaInteraction<NodeId>(onNodesSelected)
  const imageUrl = isExpanded ? schemaDUrl : schemaDGalleryUrl

  return (
    <InteractiveSchemaFrame
      isExpanded={isExpanded}
      title="Graph of Desire"
      imageUrl={imageUrl}
      imageAlt="Graph of Desire"
      viewBox="0 0 207.658 194.922"
      nodes={NODES}
      selectedNodes={selectedNodes}
      hoveredNode={hoveredNode}
      onNodeHover={setHoveredNode}
      onNodeClick={handleNodeClick}
    />
  )
}
