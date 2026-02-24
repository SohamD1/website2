import { useEffect, useRef } from 'react'
import WebGLFluidEnhanced from 'webgl-fluid-enhanced'

type FluidConfig = {
  simResolution: number
  dyeResolution: number
  captureResolution: number
  densityDissipation: number
  velocityDissipation: number
  pressure: number
  pressureIterations: number
  curl: number
  splatRadius: number
  splatForce: number
  shading: boolean
  colorful: boolean
  colorUpdateSpeed: number
  colorPalette: string[]
  hover: boolean
  backgroundColor: string
  inverted: boolean
  transparent: boolean
  brightness: number
  bloom: boolean
  bloomIterations: number
  bloomResolution: number
  bloomIntensity: number
  bloomThreshold: number
  bloomSoftKnee: number
  sunrays: boolean
  sunraysResolution: number
  sunraysWeight: number
}

type PointerConfig = {
  splatIntervalMs: number
  forceMultiplier: number
  maxForce: number
  minMovementPx: number
}

const DEFAULT_FLUID_CONFIG: FluidConfig = {
  simResolution: 100,
  dyeResolution: 2048,
  captureResolution: 128,
  densityDissipation: 1,
  velocityDissipation: 1,
  pressure: 0,
  pressureIterations: 60,
  curl: 0,
  splatRadius: 0.26,
  splatForce: 100,
  shading: false,
  colorful: false,
  colorUpdateSpeed: 10.1,
  colorPalette: ['#3b2cff', '#5b3df5', '#7b5cff', '#ff1493'],
  hover: false,
  backgroundColor: '#000000',
  inverted: false,
  transparent: true,
  brightness: 0.15,
  bloom: false,
  bloomIterations: 8,
  bloomResolution: 256,
  bloomIntensity: 0.15,
  bloomThreshold: 0,
  bloomSoftKnee: 0,
  sunrays: true,
  sunraysResolution: 129,
  sunraysWeight: 1,
}

const DEFAULT_POINTER_CONFIG: PointerConfig = {
  splatIntervalMs: 1,
  forceMultiplier: 3.2,
  maxForce: 600,
  minMovementPx: 0,
}

const SMALL_SCREEN_QUERY = '(max-width: 768px)'

const SMALL_SCREEN_FLUID_OVERRIDES: Partial<FluidConfig> = {
  dyeResolution: 1024,
  pressureIterations: 24,
}

const SMALL_SCREEN_POINTER_OVERRIDES: Partial<PointerConfig> = {
  splatIntervalMs: 4,
  minMovementPx: 0.2,
}

const getResponsiveDefaultConfigs = (isSmallScreen: boolean) => {
  const fluidConfig: FluidConfig = {
    ...DEFAULT_FLUID_CONFIG,
    colorPalette: [...DEFAULT_FLUID_CONFIG.colorPalette],
    ...(isSmallScreen ? SMALL_SCREEN_FLUID_OVERRIDES : {}),
  }

  const pointerConfig: PointerConfig = {
    ...DEFAULT_POINTER_CONFIG,
    ...(isSmallScreen ? SMALL_SCREEN_POINTER_OVERRIDES : {}),
  }

  return { fluidConfig, pointerConfig }
}

const LiquidBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pointerConfigRef = useRef<PointerConfig>(DEFAULT_POINTER_CONFIG)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isSmallScreen = window.matchMedia(SMALL_SCREEN_QUERY).matches
    const { fluidConfig, pointerConfig } = getResponsiveDefaultConfigs(isSmallScreen)
    pointerConfigRef.current = pointerConfig

    const fluid = new WebGLFluidEnhanced(container)

    Object.assign(container.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',
      opacity: '1',
      pointerEvents: 'none',
    })

    fluid.setConfig(fluidConfig)
    fluid.start()

    let previousX: number | null = null
    let previousY: number | null = null
    let lastSplatAt = 0
    let latestEvent: PointerEvent | null = null
    let frameId: number | null = null

    const getAlignedPointerPosition = (event: PointerEvent) => {
      const canvas = container.querySelector('canvas')
      if (!canvas) return null

      const rect = canvas.getBoundingClientRect()
      const localX = event.clientX - rect.left
      const localY = event.clientY - rect.top
      const xScale = canvas.clientWidth > 0 ? canvas.width / canvas.clientWidth : 1

      return {
        x: localX * xScale,
        y: localY,
        xScale,
      }
    }

    const processPointer = () => {
      frameId = null
      if (!latestEvent) return

      const event = latestEvent
      latestEvent = null
      const pointer = getAlignedPointerPosition(event)
      if (!pointer) return

      if (previousX === null || previousY === null) {
        previousX = event.clientX
        previousY = event.clientY
        return
      }

      const deltaX = event.clientX - previousX
      const deltaY = event.clientY - previousY
      previousX = event.clientX
      previousY = event.clientY

      const currentPointerConfig = pointerConfigRef.current
      if (Math.abs(deltaX) < currentPointerConfig.minMovementPx && Math.abs(deltaY) < currentPointerConfig.minMovementPx) return

      const now = performance.now()
      if (now - lastSplatAt < currentPointerConfig.splatIntervalMs) return
      lastSplatAt = now

      const movementMagnitude = Math.hypot(deltaX, deltaY)
      const lowMotionBoost = movementMagnitude < 8 ? 1.8 : 1
      const dxRaw = deltaX * currentPointerConfig.forceMultiplier * lowMotionBoost * pointer.xScale
      const dyRaw = -deltaY * currentPointerConfig.forceMultiplier * lowMotionBoost
      const dx = Math.max(-currentPointerConfig.maxForce, Math.min(currentPointerConfig.maxForce, dxRaw))
      const dy = Math.max(-currentPointerConfig.maxForce, Math.min(currentPointerConfig.maxForce, dyRaw))

      fluid.splatAtLocation(pointer.x, pointer.y, dx, dy)
    }

    const handlePointerMove = (event: PointerEvent) => {
      latestEvent = event
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(processPointer)
    }

    const handlePointerDown = (event: PointerEvent) => {
      const pointer = getAlignedPointerPosition(event)
      if (!pointer) return

      const currentPointerConfig = pointerConfigRef.current
      const clickForce = Math.max(90, currentPointerConfig.maxForce * 0.3)
      const angle = Math.random() * Math.PI * 2
      const dx = Math.cos(angle) * clickForce
      const dy = Math.sin(angle) * clickForce

      fluid.splatAtLocation(pointer.x, pointer.y, dx, dy)
      previousX = event.clientX
      previousY = event.clientY
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
      fluid.stop()
    }
  }, [])

  return <div ref={containerRef} className="fluid-background" aria-hidden="true" />
}

export default LiquidBackground
