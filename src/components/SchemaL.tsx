import schemaLUrl from '../svgs/lacan schema L_1.svg?url'
import schemaLGalleryUrl from '../pngs/lacan-schema-L_1.png'
import { InteractiveSchemaFrame, type SchemaNodeConfig } from './schema/InteractiveSchemaFrame'
import { useSchemaInteraction } from './schema/useSchemaInteraction'

interface SchemaLProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'A' | 'a' | "a'"

// Schema L 的四个节点配置
// 基于 SVG viewBox="0 0 143.109 81.646"
const NODES: SchemaNodeConfig<NodeId>[] = [
  { id: 'S', cx: 37.52, cy: 12.48, r: 6 },   // 左下 S (黑色填充)
  { id: 'A', cx: 94.21, cy: 12.48, r: 6 },   // 右下 A (黑色填充)
  { id: "a'", cx: 37.52, cy: 69.17, r: 6 },  // 左上 a' (白色填充)
  { id: 'a', cx: 94.21, cy: 69.17, r: 6 },   // 右上 a (白色填充)
]

export default function SchemaL({ isExpanded = false, onNodesSelected }: SchemaLProps) {
  const { selectedNodes, hoveredNode, setHoveredNode, handleNodeClick } = useSchemaInteraction<NodeId>(onNodesSelected)
  const imageUrl = isExpanded ? schemaLUrl : schemaLGalleryUrl

  return (
    <InteractiveSchemaFrame
      isExpanded={isExpanded}
      title="Schema L"
      imageUrl={imageUrl}
      imageAlt="Schema L"
      viewBox="0 0 143.109 81.646"
      nodes={NODES}
      selectedNodes={selectedNodes}
      hoveredNode={hoveredNode}
      onNodeHover={setHoveredNode}
      onNodeClick={handleNodeClick}
    />
  )
}
