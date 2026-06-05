import { Fragment } from 'react'

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
        <span
          className={`tracking-widest ${isExpanded ? 'text-xl' : 'text-base'}`}
          style={{
            color: 'var(--lacan-muted)',
            fontFamily: 'var(--lacan-title-font)',
            fontWeight: 700,
          }}
        >
          {title}
        </span>
      </div>

      <div className="relative flex-1 w-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-contain"
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            filter: 'sepia(0.35) saturate(0.78) contrast(1.08) brightness(0.86) opacity(0.88)',
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full"
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
              <Fragment key={node.id}>
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  className="pointer-events-none transition-all duration-200"
                  fill="transparent"
                  stroke={isSelected ? 'var(--lacan-vermilion)' : isHovered ? 'rgba(107,29,14,0.56)' : 'transparent'}
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 0}
                  strokeDasharray={isHovered && !isSelected ? '4 2' : '0'}
                />
                <foreignObject
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
                    onPointerDown={(event) => event.preventDefault()}
                    onMouseEnter={() => onNodeHover(node.id)}
                    onMouseLeave={() => onNodeHover(null)}
                    onClick={() => onNodeClick(node.id)}
                  />
                </foreignObject>
              </Fragment>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
