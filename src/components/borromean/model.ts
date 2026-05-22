import * as THREE from 'three'

export type BorromeanRingId = 'real' | 'symbolic' | 'imaginary'
export type BorromeanSegmentId =
  | 'real-segment-a'
  | 'real-segment-b'
  | 'symbolic-segment-a'
  | 'symbolic-segment-b'
  | 'imaginary-segment-a'
  | 'imaginary-segment-b'

export type BorromeanCrossingId = 'rs-crossing' | 'si-crossing' | 'ir-crossing'
export type BorromeanOverlapRegionId = 'real-symbolic-region' | 'symbolic-imaginary-region' | 'imaginary-real-region'

export interface BorromeanRingDefinition {
  id: BorromeanRingId
  label: string
  color: number
  planeNormal: THREE.Vector3
  planeOffset: THREE.Vector3
  majorRadius: number
  minorRadius: number
  phaseOffset: number
  verticalWaveAmplitude: number
  rotationEuler: THREE.Euler
}

export interface BorromeanSegmentDefinition {
  id: BorromeanSegmentId
  ringId: BorromeanRingId
  startT: number
  endT: number
}

export interface BorromeanCrossingDefinition {
  id: BorromeanCrossingId
  ringIds: [BorromeanRingId, BorromeanRingId]
  anchorTByRing: Record<BorromeanRingId, number | null>
  overRingId: BorromeanRingId
}

export interface BorromeanOverlapRegionDefinition {
  id: BorromeanOverlapRegionId
  ringIds: [BorromeanRingId, BorromeanRingId]
  crossingIds: [BorromeanCrossingId, BorromeanCrossingId]
}

export interface BorromeanSceneModel {
  tubeRadius: number
  rings: BorromeanRingDefinition[]
  segments: BorromeanSegmentDefinition[]
  crossings: BorromeanCrossingDefinition[]
  overlapRegions: BorromeanOverlapRegionDefinition[]
}

export const BORROMEAN_RING_IDS: BorromeanRingId[] = ['real', 'symbolic', 'imaginary']

export function createBorromeanSceneModel(): BorromeanSceneModel {
  return {
    tubeRadius: 0.14,
    rings: [
      {
        id: 'real',
        label: 'The Real',
        color: 0x93c5fd,
        planeNormal: new THREE.Vector3(0, 1, 0),
        planeOffset: new THREE.Vector3(0, 0.52, 0),
        majorRadius: 1.72,
        minorRadius: 1.48,
        phaseOffset: 0,
        verticalWaveAmplitude: 0.18,
        rotationEuler: new THREE.Euler(0.5, 0.05, -0.12),
      },
      {
        id: 'symbolic',
        label: 'The Symbolic',
        color: 0xf9a8d4,
        planeNormal: new THREE.Vector3(0.866, -0.25, 0.433).normalize(),
        planeOffset: new THREE.Vector3(-0.68, -0.24, 0.16),
        majorRadius: 1.7,
        minorRadius: 1.46,
        phaseOffset: (Math.PI * 2) / 3,
        verticalWaveAmplitude: 0.16,
        rotationEuler: new THREE.Euler(-0.42, -0.7, 0.82),
      },
      {
        id: 'imaginary',
        label: 'The Imaginary',
        color: 0xfcd34d,
        planeNormal: new THREE.Vector3(-0.866, -0.25, 0.433).normalize(),
        planeOffset: new THREE.Vector3(0.68, -0.24, -0.16),
        majorRadius: 1.68,
        minorRadius: 1.44,
        phaseOffset: (Math.PI * 4) / 3,
        verticalWaveAmplitude: 0.17,
        rotationEuler: new THREE.Euler(-0.45, 0.76, -0.8),
      },
    ],
    segments: [
      { id: 'real-segment-a', ringId: 'real', startT: 0.08, endT: 0.52 },
      { id: 'real-segment-b', ringId: 'real', startT: 0.52, endT: 1.08 },
      { id: 'symbolic-segment-a', ringId: 'symbolic', startT: 0.14, endT: 0.61 },
      { id: 'symbolic-segment-b', ringId: 'symbolic', startT: 0.61, endT: 1.14 },
      { id: 'imaginary-segment-a', ringId: 'imaginary', startT: 0.22, endT: 0.72 },
      { id: 'imaginary-segment-b', ringId: 'imaginary', startT: 0.72, endT: 1.22 },
    ],
    crossings: [
      {
        id: 'rs-crossing',
        ringIds: ['real', 'symbolic'],
        anchorTByRing: { real: 0.14, symbolic: 0.66, imaginary: null },
        overRingId: 'real',
      },
      {
        id: 'si-crossing',
        ringIds: ['symbolic', 'imaginary'],
        anchorTByRing: { real: null, symbolic: 0.18, imaginary: 0.68 },
        overRingId: 'symbolic',
      },
      {
        id: 'ir-crossing',
        ringIds: ['imaginary', 'real'],
        anchorTByRing: { real: 0.72, symbolic: null, imaginary: 0.22 },
        overRingId: 'imaginary',
      },
    ],
    overlapRegions: [
      {
        id: 'real-symbolic-region',
        ringIds: ['real', 'symbolic'],
        crossingIds: ['rs-crossing', 'ir-crossing'],
      },
      {
        id: 'symbolic-imaginary-region',
        ringIds: ['symbolic', 'imaginary'],
        crossingIds: ['si-crossing', 'rs-crossing'],
      },
      {
        id: 'imaginary-real-region',
        ringIds: ['imaginary', 'real'],
        crossingIds: ['ir-crossing', 'si-crossing'],
      },
    ],
  }
}
