import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import schemaLUrl from '../../svgs/lacan schema L_1.svg?url'
import schemaRUrl from '../../svgs/lacan schema R_1.svg?url'
import schemaIUrl from '../../svgs/lacan schema I_1.svg?url'
import graphDesireUrl from '../../svgs/lacan graph of desire_4.svg?url'
import schemaLPreview from '../../pngs/lacan-schema-L_1.png'
import schemaRPreview from '../../pngs/lacan-schema-R_1.png'
import schemaIPreview from '../../pngs/lacan-schema-I_1.png'
import graphDesirePreview from '../../pngs/lacan-graph-of-desire_4.png'
import type { TheoryVisualizationProps } from './types'

interface SchemaNode {
  id: string
  label: string
  x: number
  y: number
  radius: number
}

interface SchemaConfig {
  name: string
  viewBox: string
  previewUrl: string
  detailUrl: string
  selection: 'pair' | 'single'
  nodes: SchemaNode[]
}

const schemaConfigs = {
  'schema-l': {
    name: 'Schema L',
    viewBox: '0 0 143.109 81.646',
    previewUrl: schemaLPreview,
    detailUrl: schemaLUrl,
    selection: 'pair',
    nodes: [
      { id: 'S', label: 'S', x: 37.52, y: 12.48, radius: 6 },
      { id: 'A', label: 'A', x: 94.21, y: 12.48, radius: 6 },
      { id: 'a-prime', label: "a'", x: 37.52, y: 69.17, radius: 6 },
      { id: 'a', label: 'a', x: 94.21, y: 69.17, radius: 6 },
    ],
  },
  'schema-r': {
    name: 'Schema R',
    viewBox: '0 0 124.715 121.165',
    previewUrl: schemaRPreview,
    detailUrl: schemaRUrl,
    selection: 'single',
    nodes: [
      { id: 'imaginary', label: 'I', x: 31, y: 86, radius: 11 },
      { id: 'symbolic', label: 'S', x: 91, y: 31, radius: 11 },
      { id: 'reality', label: 'R', x: 62, y: 61, radius: 12 },
    ],
  },
  'schema-i': {
    name: 'Schema I',
    viewBox: '0 0 227.757 150.84',
    previewUrl: schemaIPreview,
    detailUrl: schemaIUrl,
    selection: 'pair',
    nodes: [
      { id: 'S', label: 'S', x: 71.34, y: 126.18, radius: 8 },
      { id: 'O', label: 'O', x: 213.08, y: 126.18, radius: 8 },
      { id: 'Sym', label: 'Sym', x: 14.17, y: 12.48, radius: 8 },
      { id: 'Im', label: 'Im', x: 14.17, y: 126.18, radius: 8 },
    ],
  },
  'graph-desire': {
    name: 'Graph of Desire',
    viewBox: '0 0 207.658 194.922',
    previewUrl: graphDesirePreview,
    detailUrl: graphDesireUrl,
    selection: 'pair',
    nodes: [
      { id: 'S', label: 'S', x: 66.91, y: 47.24, radius: 10 },
      { id: 'O', label: 'O', x: 139.19, y: 47.24, radius: 10 },
      { id: 'D', label: 'D', x: 41.79, y: 120.51, radius: 10 },
      { id: 'a', label: 'a', x: 164.31, y: 120.51, radius: 10 },
    ],
  },
} satisfies Record<string, SchemaConfig>

type ClassicSchemaKey = keyof typeof schemaConfigs

interface ClassicSchemaVisualizationProps extends TheoryVisualizationProps {
  schemaKey: ClassicSchemaKey
}

function ClassicSchemaVisualization({
  schemaKey,
  mode,
  language,
  active,
  onInsightChange,
}: ClassicSchemaVisualizationProps) {
  const config = schemaConfigs[schemaKey]
  const reduceMotion = useReducedMotion()
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const nodeOrder = useMemo(
    () => new Map(config.nodes.map((node, index) => [node.id, index])),
    [config.nodes],
  )

  const selectNode = (nodeId: string) => {
    if (mode !== 'detail') return

    if (config.selection === 'single') {
      const next = selectedNodes[0] === nodeId ? [] : [nodeId]
      setSelectedNodes(next)
      onInsightChange?.(next[0] ?? null)
      return
    }

    const next = selectedNodes.includes(nodeId)
      ? selectedNodes.filter((current) => current !== nodeId)
      : selectedNodes.length >= 2
        ? [nodeId]
        : [...selectedNodes, nodeId]

    setSelectedNodes(next)
    if (next.length === 2) {
      const ordered = [...next].sort((a, b) => (nodeOrder.get(a) ?? 0) - (nodeOrder.get(b) ?? 0))
      onInsightChange?.(ordered.join('_'))
    } else {
      onInsightChange?.(null)
    }
  }

  return (
    <motion.div
      className={`theory-visual theory-visual--classic theory-visual--${mode}`}
      data-visualization={schemaKey}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.65, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <img
        className="classic-schema-image"
        src={mode === 'detail' ? config.detailUrl : config.previewUrl}
        alt={config.name}
      />

      {mode === 'detail' && (
        <svg
          className="classic-schema-hit-layer"
          viewBox={config.viewBox}
          preserveAspectRatio="xMidYMid meet"
          aria-label={language === 'zh' ? `${config.name} 交互节点` : `${config.name} interactive nodes`}
        >
          {config.nodes.map((node) => {
            const selected = selectedNodes.includes(node.id)
            const hovered = hoveredNode === node.id
            const slug = node.id.replace(/[^a-z0-9]+/gi, '-')

            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="var(--schema-node-fill)"
                  stroke="var(--color-accent-current)"
                  animate={{
                    opacity: selected ? 1 : hovered ? 0.72 : 0.08,
                    scale: selected ? 1.08 : 1,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, pointerEvents: 'none' }}
                />
                <foreignObject
                  x={node.x - node.radius * 1.45}
                  y={node.y - node.radius * 1.45}
                  width={node.radius * 2.9}
                  height={node.radius * 2.9}
                  className="schema-node-foreign-object"
                >
                  <button
                    type="button"
                    className="schema-node-button"
                    data-testid={`schema-node-${slug}`}
                    aria-label={language === 'zh' ? `选择节点 ${node.label}` : `Select node ${node.label}`}
                    aria-pressed={selected}
                    onPointerEnter={() => setHoveredNode(node.id)}
                    onPointerLeave={() => setHoveredNode(null)}
                    onFocus={() => setHoveredNode(node.id)}
                    onBlur={() => setHoveredNode(null)}
                    onClick={() => selectNode(node.id)}
                  >
                    <span>{node.label}</span>
                  </button>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      )}
    </motion.div>
  )
}

export function SchemaLVisualization(props: TheoryVisualizationProps) {
  return <ClassicSchemaVisualization {...props} schemaKey="schema-l" />
}

export function SchemaRVisualization(props: TheoryVisualizationProps) {
  return <ClassicSchemaVisualization {...props} schemaKey="schema-r" />
}

export function SchemaIVisualization(props: TheoryVisualizationProps) {
  return <ClassicSchemaVisualization {...props} schemaKey="schema-i" />
}

export function GraphDesireVisualization(props: TheoryVisualizationProps) {
  return <ClassicSchemaVisualization {...props} schemaKey="graph-desire" />
}
