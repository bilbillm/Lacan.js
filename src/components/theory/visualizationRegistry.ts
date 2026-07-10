import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { VisualizationKey } from '../app/panels'
import type { TheoryVisualizationProps } from './types'

type LazyVisualization = LazyExoticComponent<ComponentType<TheoryVisualizationProps>>

export const visualizationRegistry: Record<VisualizationKey, LazyVisualization> = {
  'schema-l': lazy(() => import('./ClassicSchemaVisualization').then((module) => ({ default: module.SchemaLVisualization }))),
  'schema-r': lazy(() => import('./ClassicSchemaVisualization').then((module) => ({ default: module.SchemaRVisualization }))),
  'schema-i': lazy(() => import('./ClassicSchemaVisualization').then((module) => ({ default: module.SchemaIVisualization }))),
  'graph-desire': lazy(() => import('./ClassicSchemaVisualization').then((module) => ({ default: module.GraphDesireVisualization }))),
  'four-discourses': lazy(() => import('./FourDiscoursesVisualization')),
  sexuation: lazy(() => import('./SexuationVisualization')),
  'optical-model': lazy(() => import('./OpticalModelVisualization')),
  'subject-topology': lazy(() => import('./TopologyVisualization')),
}
