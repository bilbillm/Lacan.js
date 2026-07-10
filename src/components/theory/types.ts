import type { Language } from '../../i18n'

export type VisualizationMode = 'preview' | 'detail'

export interface TheoryVisualizationProps {
  mode: VisualizationMode
  language: Language
  active: boolean
  onInsightChange?: (insightId: string | null) => void
}
