import * as THREE from 'three'
import type {
  BorromeanCrossingDefinition,
  BorromeanOverlapRegionDefinition,
  BorromeanRingDefinition,
  BorromeanRingId,
  BorromeanSceneModel,
  BorromeanSegmentDefinition,
} from './model'

const TAU = Math.PI * 2

class BorromeanRingCurve extends THREE.Curve<THREE.Vector3> {
  private readonly ring: BorromeanRingDefinition

  constructor(ring: BorromeanRingDefinition) {
    super()
    this.ring = ring
  }

  override getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const angle = t * TAU + this.ring.phaseOffset
    const ellipsePoint = new THREE.Vector3(
      Math.cos(angle) * this.ring.majorRadius,
      Math.sin(angle) * this.ring.minorRadius,
      Math.sin(angle * 2) * this.ring.verticalWaveAmplitude,
    )

    ellipsePoint.applyEuler(this.ring.rotationEuler)
    ellipsePoint.add(this.ring.planeOffset)

    return optionalTarget.copy(ellipsePoint)
  }
}

export interface BorromeanRenderResources {
  ringMeshes: Map<BorromeanRingId, THREE.Mesh>
  segmentHelpers: THREE.Mesh[]
  crossingHelpers: THREE.Mesh[]
  overlapHelpers: THREE.Mesh[]
  raycastTargets: THREE.Object3D[]
  trackedResources: Array<{ dispose: () => void }>
}

export function createBorromeanRenderResources(model: BorromeanSceneModel): BorromeanRenderResources {
  const ringMeshes = new Map<BorromeanRingId, THREE.Mesh>()
  const segmentHelpers: THREE.Mesh[] = []
  const crossingHelpers: THREE.Mesh[] = []
  const overlapHelpers: THREE.Mesh[] = []
  const raycastTargets: THREE.Object3D[] = []
  const trackedResources: Array<{ dispose: () => void }> = []

  const ringCurveMap = new Map<BorromeanRingId, BorromeanRingCurve>()

  for (const ring of model.rings) {
    const curve = new BorromeanRingCurve(ring)
    ringCurveMap.set(ring.id, curve)

    const geometry = new THREE.TubeGeometry(curve, 240, model.tubeRadius, 24, true)
    const material = new THREE.MeshPhysicalMaterial({
      color: ring.color,
      emissive: ring.color,
      emissiveIntensity: 0.18,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.85,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 0.94,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = `ring:${ring.id}`
    ringMeshes.set(ring.id, mesh)
    trackedResources.push(geometry, material)
  }

  for (const segment of model.segments) {
    const ring = model.rings.find(candidate => candidate.id === segment.ringId)
    const curve = ringCurveMap.get(segment.ringId)

    if (!ring || !curve) {
      continue
    }

    const helper = createSegmentHelper(segment, curve, ring.color, model.tubeRadius)
    segmentHelpers.push(helper.mesh)
    raycastTargets.push(helper.mesh)
    trackedResources.push(helper.geometry, helper.material)
  }

  for (const crossing of model.crossings) {
    const helper = createCrossingHelper(crossing, model.rings, ringCurveMap, model.tubeRadius)
    crossingHelpers.push(helper.mesh)
    raycastTargets.push(helper.mesh)
    trackedResources.push(helper.geometry, helper.material)
  }

  for (const overlapRegion of model.overlapRegions) {
    const helper = createOverlapHelper(overlapRegion, model.crossings, model.rings, ringCurveMap, model.tubeRadius)
    overlapHelpers.push(helper.mesh)
    raycastTargets.push(helper.mesh)
    trackedResources.push(helper.geometry, helper.material)
  }

  return {
    ringMeshes,
    segmentHelpers,
    crossingHelpers,
    overlapHelpers,
    raycastTargets,
    trackedResources,
  }
}

function createSegmentHelper(
  segment: BorromeanSegmentDefinition,
  curve: BorromeanRingCurve,
  color: number,
  tubeRadius: number,
) {
  const [startT, endT] = normalizeSegmentRange(segment.startT, segment.endT)
  const arcCurve = new THREE.CatmullRomCurve3(sampleCurveRange(curve, startT, endT, 18), true)
  const geometry = new THREE.TubeGeometry(arcCurve, 64, tubeRadius * 1.22, 12, true)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.001,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = `segment:${segment.id}`
  mesh.userData = {
    targetClass: 'segment',
    targetId: segment.id,
    ringId: segment.ringId,
  }

  return { mesh, geometry, material }
}

function createCrossingHelper(
  crossing: BorromeanCrossingDefinition,
  rings: BorromeanRingDefinition[],
  ringCurveMap: Map<BorromeanRingId, BorromeanRingCurve>,
  tubeRadius: number,
) {
  const points = crossing.ringIds
    .map((ringId) => {
      const t = crossing.anchorTByRing[ringId]
      const curve = ringCurveMap.get(ringId)

      if (t == null || !curve) {
        return null
      }

      return curve.getPoint(t % 1)
    })
    .filter((point): point is THREE.Vector3 => point !== null)

  const anchor = averagePoints(points)
  const overRingColor = rings.find((ring) => ring.id === crossing.overRingId)?.color ?? 0xffffff
  const geometry = new THREE.SphereGeometry(tubeRadius * 1.7, 18, 18)
  const material = new THREE.MeshBasicMaterial({
    color: overRingColor,
    transparent: true,
    opacity: 0.001,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(anchor)
  mesh.name = `crossing:${crossing.id}`
  mesh.userData = {
    targetClass: 'crossing',
    targetId: crossing.id,
    ringIds: crossing.ringIds,
  }

  return { mesh, geometry, material }
}

function createOverlapHelper(
  overlapRegion: BorromeanOverlapRegionDefinition,
  crossings: BorromeanCrossingDefinition[],
  rings: BorromeanRingDefinition[],
  ringCurveMap: Map<BorromeanRingId, BorromeanRingCurve>,
  tubeRadius: number,
) {
  const anchorPoints = overlapRegion.crossingIds
    .map((crossingId) => crossings.find((entry) => entry.id === crossingId))
    .filter((entry): entry is BorromeanCrossingDefinition => Boolean(entry))
    .flatMap((crossing) =>
      crossing.ringIds
        .map((ringId) => {
          const t = crossing.anchorTByRing[ringId]
          const curve = ringCurveMap.get(ringId)

          if (t == null || !curve) {
            return null
          }

          return curve.getPoint(t % 1)
        })
        .filter((point): point is THREE.Vector3 => point !== null),
    )

  const center = averagePoints(anchorPoints)
  center.lerp(new THREE.Vector3(0, 0, 0), 0.35)
  const color = rings.find((ring) => ring.id === overlapRegion.ringIds[0])?.color ?? 0xffffff
  const geometry = new THREE.CircleGeometry(tubeRadius * 6.4, 32)
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.001,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(center)
  mesh.lookAt(new THREE.Vector3(0, 0, 0))
  mesh.name = `overlap:${overlapRegion.id}`
  mesh.userData = {
    targetClass: 'overlap',
    targetId: overlapRegion.id,
    ringIds: overlapRegion.ringIds,
  }

  return { mesh, geometry, material }
}

function sampleCurveRange(curve: BorromeanRingCurve, startT: number, endT: number, steps: number) {
  const points: THREE.Vector3[] = []

  for (let index = 0; index <= steps; index += 1) {
    const ratio = index / steps
    const t = (startT + (endT - startT) * ratio) % 1
    points.push(curve.getPoint(t))
  }

  return points
}

function normalizeSegmentRange(startT: number, endT: number) {
  const normalizedStart = ((startT % 1) + 1) % 1
  let normalizedEnd = ((endT % 1) + 1) % 1

  if (normalizedEnd <= normalizedStart) {
    normalizedEnd += 1
  }

  return [normalizedStart, normalizedEnd] as const
}

function averagePoints(points: THREE.Vector3[]) {
  if (points.length === 0) {
    return new THREE.Vector3(0, 0, 0)
  }

  const sum = points.reduce((accumulator, point) => accumulator.add(point), new THREE.Vector3())
  return sum.multiplyScalar(1 / points.length)
}
