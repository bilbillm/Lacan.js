import type { LazyExoticComponent, ComponentType } from 'react'
import { panels, type PanelDefinition } from './panels'

export type InteractiveSchemaComponent = LazyExoticComponent<
  ComponentType<{
    isExpanded?: boolean
    selectedNodes?: string[]
    onSelectionChange?: (nodeIds: string[]) => void
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

const panelDefinitionMap = new Map<string, PanelDefinition>(panels.map(panel => [panel.id, panel]))

export type ResolvedPanelSchema =
  | { interactive: true; Component: InteractiveSchemaComponent }
  | { interactive: false; Component: NonInteractiveSchemaComponent }

export function resolvePanelSchema(
  panelId: string,
  components: PanelSchemaComponents,
): ResolvedPanelSchema | null {
  const entry = panelDefinitionMap.get(panelId)

  if (!entry?.schemaKey) {
    return null
  }

  if (!entry.interactive) {
    return {
      interactive: false,
      Component: components[entry.schemaKey] as NonInteractiveSchemaComponent,
    }
  }

  return {
    interactive: true,
    Component: components[entry.schemaKey] as InteractiveSchemaComponent,
  }
}
