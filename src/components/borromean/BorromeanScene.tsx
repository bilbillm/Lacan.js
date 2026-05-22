import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createBorromeanRenderResources } from './geometry'
import { createBorromeanSceneModel } from './model'

interface BorromeanSceneProps {
  isExpanded?: boolean
  selectedNodes?: string[]
  onSelectionChange?: (nodeIds: string[]) => void
}

export default function BorromeanScene({
  isExpanded = false,
  selectedNodes = [],
  onSelectionChange,
}: BorromeanSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [fallbackReason] = useState<'webgl' | null>(() => {
    if (typeof document === 'undefined') {
      return null
    }

    const webglProbe = document.createElement('canvas')
    const webglContext = webglProbe.getContext('webgl') ?? webglProbe.getContext('experimental-webgl')

    return webglContext ? null : 'webgl'
  })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (!isExpanded) {
      return
    }

    const host = hostRef.current
    const canvasHost = canvasRef.current

    if (!host || !canvasHost) {
      return
    }

    if (fallbackReason === 'webgl') {
      return
    }

    const scene = new THREE.Scene()
    scene.background = null
    const sceneModel = createBorromeanSceneModel()

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.35, 7.5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    canvasHost.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = true
    controls.dampingFactor = 0.06
    controls.rotateSpeed = 0.85
    controls.zoomSpeed = 0.92
    controls.minDistance = 4.8
    controls.maxDistance = 10.5
    controls.minPolarAngle = Math.PI / 3.2
    controls.maxPolarAngle = Math.PI - Math.PI / 3.4
    controls.target.set(0, 0, 0)
    controls.update()

    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    const renderResources = createBorromeanRenderResources(sceneModel)
    renderResources.ringMeshes.forEach((mesh) => {
      rootGroup.add(mesh)
    })
    renderResources.segmentHelpers.forEach((mesh) => {
      rootGroup.add(mesh)
    })
    renderResources.crossingHelpers.forEach((mesh) => {
      rootGroup.add(mesh)
    })
    renderResources.overlapHelpers.forEach((mesh) => {
      rootGroup.add(mesh)
    })

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7)
    keyLight.position.set(5, 6, 8)

    const rimLight = new THREE.PointLight(0x93c5fd, 8, 20, 2)
    rimLight.position.set(-4, -2, 6)

    scene.add(ambientLight, keyLight, rimLight)

    rootGroup.scale.setScalar(isExpanded ? 1 : 0.84)

    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = host

      if (clientWidth === 0 || clientHeight === 0) {
        return
      }

      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    resizeRenderer()

    const resizeObserver = new ResizeObserver(() => {
      resizeRenderer()
    })
    resizeObserver.observe(host)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const priorityByClass: Record<string, number> = {
      crossing: 0,
      overlap: 1,
      segment: 2,
    }

    const resolveHit = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect()

      if (bounds.width === 0 || bounds.height === 0) {
        return null
      }

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)

      const intersections = raycaster.intersectObjects(renderResources.raycastTargets, false)

      if (intersections.length === 0) {
        return null
      }

      return intersections.sort((left, right) => {
        const leftPriority = priorityByClass[String(left.object.userData.targetClass)] ?? Number.MAX_SAFE_INTEGER
        const rightPriority = priorityByClass[String(right.object.userData.targetClass)] ?? Number.MAX_SAFE_INTEGER

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority
        }

        return left.distance - right.distance
      })[0]
    }

    const handlePointerMove = (event: PointerEvent) => {
      const hit = resolveHit(event)
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'
    }

    const handlePointerDown = () => {
      renderer.domElement.style.cursor = 'grabbing'
    }

    const handlePointerUp = (event: PointerEvent) => {
      const hit = resolveHit(event)
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'

      if (!hit) {
        const fallbackOverlap = sceneModel.overlapRegions[0]

        if (fallbackOverlap) {
          onSelectionChange?.([`overlap:${fallbackOverlap.id}`])
        }

        return
      }

      const { targetClass, targetId } = hit.object.userData as { targetClass?: string; targetId?: string }

      if (!targetClass || !targetId) {
        return
      }

      onSelectionChange?.([`${targetClass}:${targetId}`])
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)
    renderer.domElement.style.cursor = 'grab'

    let animationFrameId = 0

    const renderLoop = () => {
      if (!prefersReducedMotion) {
        rootGroup.rotation.z += 0.0014
        rootGroup.rotation.y += 0.0008
      }

      controls.update()
      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(renderLoop)
    }

    animationFrameId = window.requestAnimationFrame(renderLoop)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
      renderer.domElement.removeEventListener('pointerup', handlePointerUp)
      renderResources.ringMeshes.forEach((mesh) => {
        rootGroup.remove(mesh)
      })
      renderResources.segmentHelpers.forEach((mesh) => {
        rootGroup.remove(mesh)
      })
      renderResources.crossingHelpers.forEach((mesh) => {
        rootGroup.remove(mesh)
      })
      renderResources.overlapHelpers.forEach((mesh) => {
        rootGroup.remove(mesh)
      })
      renderResources.trackedResources.forEach((resource) => {
        resource.dispose()
      })
      controls.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      scene.clear()
    }
  }, [fallbackReason, isExpanded, onSelectionChange, prefersReducedMotion])

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
      data-testid="borromean-scene-shell"
    >
      {!isExpanded ? (
        <div className="flex h-full w-full items-center justify-center p-4" data-testid="borromean-scene-preview">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-5 text-center backdrop-blur-md">
            <span className="text-xs font-light tracking-[0.35em] text-white/45">BORROMEAN KNOT</span>
            <span className="mt-3 text-sm text-white/65">Final chapter preview</span>
          </div>
        </div>
      ) : null}

      <div ref={canvasRef} className="absolute inset-0" data-testid="borromean-scene-canvas" />

      {isExpanded && fallbackReason === 'webgl' ? (
        <div className="absolute inset-0 flex items-center justify-center px-6" data-testid="borromean-scene-fallback">
          <div className="max-w-md rounded-[1.75rem] border border-white/12 bg-slate-950/45 px-6 py-5 text-center backdrop-blur-md">
            <p className="text-sm font-light tracking-[0.28em] text-white/60">WEBGL UNAVAILABLE</p>
            <p className="mt-3 text-sm text-white/55">
              The Borromean final chapter requires WebGL. This fallback preserves access without crashing the rest of the site.
            </p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 text-center">
        <div className="rounded-full border border-white/12 bg-slate-950/20 px-4 py-2 backdrop-blur-md">
          <span className="text-[0.65rem] font-light tracking-[0.35em] text-white/45">
            BORROMEAN CHAPTER READY · {selectedNodes.at(0) ?? `${selectedNodes.length.toString().padStart(2, '0')} TARGETS SELECTED`}
          </span>
        </div>
      </div>
    </div>
  )
}
