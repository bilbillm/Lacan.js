export interface PanelData {
  id: string
  title: string
  galleryLabel?: string
}

export type SchemaKey = 'SchemaL' | 'SchemaR' | 'SchemaI' | 'SchemaD'

export interface PanelDefinition extends PanelData {
  schemaKey?: SchemaKey
  interactive: boolean
}

export const panels: PanelDefinition[] = [
  { id: 'panel-1', title: 'Mirror Stage', galleryLabel: 'Mirror Stage', schemaKey: 'SchemaL', interactive: true },
  { id: 'panel-2', title: 'The Symbolic', galleryLabel: 'The Symbolic', schemaKey: 'SchemaR', interactive: false },
  { id: 'panel-3', title: 'The Imaginary', galleryLabel: 'The Imaginary', schemaKey: 'SchemaI', interactive: true },
  { id: 'panel-4', title: 'The Real', galleryLabel: 'The Real', schemaKey: 'SchemaD', interactive: true },
  { id: 'panel-5', title: 'Panel 5', galleryLabel: 'Panel 5', interactive: false },
  { id: 'panel-6', title: 'Panel 6', galleryLabel: 'Panel 6', interactive: false },
  { id: 'panel-7', title: 'Panel 7', galleryLabel: 'Panel 7', interactive: false },
  { id: 'panel-8', title: 'Panel 8', galleryLabel: 'Panel 8', interactive: false },
]
