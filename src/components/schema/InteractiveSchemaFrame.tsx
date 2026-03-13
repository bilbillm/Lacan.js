interface SchemaNodeConfig<NodeId extends string> {
  id: NodeId
  cx: number
  cy: number
  r: number
}

interface InteractiveSchemaFrameProps<NodeId extends string> {
  isExpanded?: boolean
  title: string
  imageUrl: string
  imageAlt: string
  viewBox: string
  nodes: SchemaNodeConfig<NodeId>[]
  selectedNodes: NodeId[]
  hoveredNode: NodeId | null
  onNodeHover: (nodeId: NodeId | null) => void
  onNodeClick: (nodeId: NodeId) => void
}

export type { SchemaNodeConfig }

export function InteractiveSchemaFrame<NodeId extends string>({
  isExpanded = false,
  title,
  imageUrl,
  imageAlt,
  viewBox,
  nodes,
  selectedNodes,
  hoveredNode,
  onNodeHover,
  onNodeClick,
}: InteractiveSchemaFrameProps<NodeId>) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      <div className="text-center mb-2">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-xl' : 'text-base'}`}>
          {title}
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full max-w-full max-h-full"
          style={{
            display: 'block',
            filter: 'invert(1) opacity(0.8)',
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <title>{imageAlt}</title>
          {nodes.map(node => {
            const isSelected = selectedNodes.includes(node.id)
            const isHovered = hoveredNode === node.id

            return (
              <>
                <circle
                  key={`${node.id}-circle`}
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  className="transition-all duration-200"
                  fill="transparent"
                  stroke={isSelected ? '#fff' : isHovered ? 'rgba(255,255,255,0.6)' : 'transparent'}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 0}
                  strokeDasharray={isHovered && !isSelected ? '4 2' : '0'}
                />
                <foreignObject
                  key={`${node.id}-button`}
                  x={node.cx - node.r}
                  y={node.cy - node.r}
                  width={node.r * 2}
                  height={node.r * 2}
                  className="pointer-events-auto overflow-visible"
                >
                  <button
                    type="button"
                    aria-label={`Select node ${node.id}`}
                    className="w-full h-full cursor-pointer rounded-full bg-transparent border-0 p-0"
                    onMouseEnter={() => onNodeHover(node.id)}
                    onMouseLeave={() => onNodeHover(null)}
                    onClick={() => onNodeClick(node.id)}
                  />
                </foreignObject>
              </>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
