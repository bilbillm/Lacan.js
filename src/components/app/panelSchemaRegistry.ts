import type { LazyExoticComponent, ComponentType } from 'react'

export type InteractiveSchemaComponent = LazyExoticComponent<
  ComponentType<{
    isExpanded?: boolean
    onNodesSelected?: (node1: string, node2: string) => void
  }>
>

export type NonInteractiveSchemaComponent = LazyExoticComponent<
  ComponentType<{
    isExpanded?: boolean
  }>
>

export interface PanelSchemaComponents {
  SchemaL: InteractiveSchemaComponent
  SchemaR: NonInteractiveSchemaComponent
  SchemaI: InteractiveSchemaComponent
  SchemaD: InteractiveSchemaComponent
}

type PanelSchemaKey = keyof PanelSchemaComponents

interface PanelSchemaRegistryEntry {
  schema: PanelSchemaKey
}

const panelSchemaRegistry: Record<string, PanelSchemaRegistryEntry> = {
  'panel-1': { schema: 'SchemaL' },
  'panel-2': { schema: 'SchemaR' },
  'panel-3': { schema: 'SchemaI' },
  'panel-4': { schema: 'SchemaD' },
}

export type ResolvedPanelSchema =
  | { interactive: true; Component: InteractiveSchemaComponent }
  | { interactive: false; Component: NonInteractiveSchemaComponent }

export function resolvePanelSchema(
  panelId: string,
  components: PanelSchemaComponents,
): ResolvedPanelSchema | null {
  const entry = panelSchemaRegistry[panelId]

  if (!entry) {
    return null
  }

  if (entry.schema === 'SchemaR') {
    return {
      interactive: false,
      Component: components.SchemaR,
    }
  }

  return {
    interactive: true,
    Component: components[entry.schema],
  }
}
