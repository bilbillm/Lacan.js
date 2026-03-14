import schemaIUrl from '../svgs/lacan schema I_1.svg?url'
import schemaIGalleryUrl from '../pngs/lacan-schema-I_1.png'
import { InteractiveSchemaFrame, type SchemaNodeConfig } from './schema/InteractiveSchemaFrame'
import { useSchemaInteraction } from './schema/useSchemaInteraction'

interface SchemaIProps {
  isExpanded?: boolean
  onNodesSelected?: (node1: string, node2: string) => void
}

type NodeId = 'S' | 'O' | 'Sym' | 'Im'

// Schema I 的四个节点配置
// 基于 SVG viewBox="0 0 227.757 150.84"
const NODES: SchemaNodeConfig<NodeId>[] = [
  { id: 'S', cx: 71.34, cy: 126.18, r: 8 },    // 中心 S
  { id: 'O', cx: 213.08, cy: 126.18, r: 8 },   // 右侧 O
  { id: 'Sym', cx: 14.17, cy: 12.48, r: 8 },   // 左上 Sym
  { id: 'Im', cx: 14.17, cy: 126.18, r: 8 },   // 左下 Im
]

export default function SchemaI({ isExpanded = false, onNodesSelected }: SchemaIProps) {
  const { selectedNodes, hoveredNode, setHoveredNode, handleNodeClick } = useSchemaInteraction<NodeId>(onNodesSelected)
  const imageUrl = isExpanded ? schemaIUrl : schemaIGalleryUrl

  return (
    <InteractiveSchemaFrame
      isExpanded={isExpanded}
      title="Schema I"
      imageUrl={imageUrl}
      imageAlt="Schema I"
      viewBox="0 0 227.757 150.84"
      nodes={NODES}
      selectedNodes={selectedNodes}
      hoveredNode={hoveredNode}
      onNodeHover={setHoveredNode}
      onNodeClick={handleNodeClick}
    />
  )
}
