import { useEffect, useRef } from 'react'

/*
 * Three layers, all 2D canvas:
 *   1. sim canvas (offscreen, low-res) — particles draw soft radial blobs,
 *      faded each frame with a translucent black rect (trails) and composited
 *      with 'lighter' (glow).
 *   2. sample — getImageData on the sim, one lookup per character cell.
 *   3. ascii pass — brightness above threshold gets a fillText, colored from a
 *      pre-quantized grayscale palette so fillStyle rarely changes.
 * A spinning glyph mask (the ohm symbol) wins any cell it covers.
 */

const FONT_SIZE = 12
const FONT = `${FONT_SIZE}px ui-monospace, Menlo, Consolas, monospace`
const CELL_W = 8
const CELL_H = 14
const FILL_CHARS = 'SOHAM'
const LOGO_TEXT = 'Ω'
const LOGO_Y = 0.72 // preferred vertical center, as a fraction of height
const LOGO_ROWS = 18 // glyph height in cells at full size
// the paragraph wraps to roughly twice as many lines on a phone as on a
// desktop, so on a short screen it reaches past LOGO_Y. The mark is pushed
// below the text and shrunk to whatever is left, down to LOGO_MIN_ROWS.
const LOGO_MIN_ROWS = 7 // under this much room the mark is dropped entirely
const LOGO_GAP_ROWS = 2 // clear cells kept between the text and the mark
const LOGO_ASPECT = 1.7 // mask box width relative to its height, in cells
// cells are taller than wide, so a glyph measured in cells comes out stretched
// vertically. CELL_H / CELL_W (1.75) is the true-proportion correction, but a
// bold omega is a wide glyph, so back it off to keep the mark upright.
const LOGO_STRETCH = 1.3
// mask pixels per character cell. The mask is sampled one value per cell, so
// without supersampling the glyph edges land on (or off) a cell all at once.
const LOGO_SS = 6
const LOGO_MIN_COVER = 0.04 // below this a cell is not part of the mark
const LOGO_FADE = 0.35 // coverage at which a cell reaches full opacity

const SIM_W = 400
const BLOB_R = 7
const STEPS = 50
const MAX_P = 800

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  drag: number
  active: boolean
}

type LogoCell = { r: number; c: number; ch: string; d: number; f: number }

type Props = {
  // the text block the mark has to stay clear of
  contentRef?: React.RefObject<HTMLElement | null>
}

export default function AsciiParticles({ contentRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let simH = 250
    let cols = 0
    let rows = 0
    let dpr = 1

    const sim = document.createElement('canvas')
    const simCtx = sim.getContext('2d', { willReadFrequently: true })
    if (!simCtx) return

    // pre-rendered glow sprite
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = BLOB_R * 2
    const spriteCtx = sprite.getContext('2d')
    if (!spriteCtx) return
    const grad = spriteCtx.createRadialGradient(
      BLOB_R,
      BLOB_R,
      0,
      BLOB_R,
      BLOB_R,
      BLOB_R
    )
    grad.addColorStop(0, 'rgba(255,255,255,0.30)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.08)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    spriteCtx.fillStyle = grad
    spriteCtx.fillRect(0, 0, BLOB_R * 2, BLOB_R * 2)

    // quantized grayscale palette — 140..212 gray, alpha capped at 85%
    const palette: string[] = []
    for (let i = 0; i <= STEPS; i++) {
      const t = Math.min(1, i / STEPS)
      const v = 140 + Math.floor(t * 72)
      const a = Math.max(0.05, t * 0.85)
      palette.push(`rgba(${v},${v},${v},${a})`)
    }

    const particles: Particle[] = Array.from({ length: MAX_P }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 1,
      drag: 0.96,
      active: false,
    }))
    let pIdx = 0
    const mouse = { x: SIM_W / 2, y: 0, has: false }

    function spawn(
      x: number,
      y: number,
      vx: number,
      vy: number,
      life: number,
      drag: number
    ) {
      const p = particles[pIdx++ % MAX_P]
      p.x = x
      p.y = y
      p.vx = vx
      p.vy = vy
      p.maxLife = p.life = life
      p.drag = drag
      p.active = true
    }

    // trail particles are pushed opposite the motion direction
    function emitTrail(x: number, y: number) {
      const dx = x - mouse.x
      const dy = y - mouse.y
      const dist = Math.hypot(dx, dy)
      if (dist > 0.3) {
        const n = Math.min(5, Math.ceil(dist * 0.7))
        for (let i = 0; i < n; i++) {
          spawn(
            x + (Math.random() - 0.5) * 3,
            y + (Math.random() - 0.5) * 3,
            -dx * 0.25 + (Math.random() - 0.5) * 0.4,
            -dy * 0.25 + (Math.random() - 0.5) * 0.4 - 0.2,
            30 + Math.random() * 45,
            0.94 + Math.random() * 0.04
          )
        }
      }
      mouse.x = x
      mouse.y = y
    }

    function emitExplosion(x: number, y: number) {
      const N = 80
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + Math.random() * 0.5
        const sp = 1 + Math.random() * 2.5
        spawn(
          x,
          y,
          Math.cos(a) * sp,
          Math.sin(a) * sp - 0.5,
          40 + Math.random() * 50,
          0.93 + Math.random() * 0.05
        )
      }
    }

    function stepParticles() {
      for (const p of particles) {
        if (!p.active) continue
        if (--p.life <= 0) {
          p.active = false
          continue
        }
        p.vy += 0.015 // gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.x += p.vx
        p.y += p.vy
      }
    }

    function drawSim() {
      simCtx!.globalCompositeOperation = 'source-over'
      simCtx!.fillStyle = 'rgba(0,0,0,0.35)'
      simCtx!.fillRect(0, 0, SIM_W, simH)
      simCtx!.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        if (!p.active) continue
        simCtx!.globalAlpha = (p.life / p.maxLife) * 0.8
        simCtx!.drawImage(sprite, p.x - BLOB_R, p.y - BLOB_R)
      }
      simCtx!.globalAlpha = 1
    }

    // logo mask. The glyph is rasterized ONCE, supersampled LOGO_SS x per cell;
    // each frame only resamples that bitmap horizontally to fake a spin about
    // the Y axis, then box-filters it down to one coverage value per character
    // cell. Rasterizing live text at a changing scale every frame was what made
    // the mark stutter sideways: font grid-fitting snapped the glyph edges to
    // different pixels frame to frame, and at one mask pixel per cell that snap
    // moved the mark a whole cell.
    const glyph = document.createElement('canvas')
    const glyphCtx = glyph.getContext('2d', { willReadFrequently: true })
    if (!glyphCtx) return
    const mask = document.createElement('canvas')
    const maskCtx = mask.getContext('2d', { willReadFrequently: true })
    if (!maskCtx) return
    let logoCols = 0
    let logoRows = 0
    let logoOffC = 0
    let logoOffR = 0
    let inkX = 0 // ink bounding box of the rasterized glyph, in mask pixels
    let inkW = 0
    let textBottom = 0 // viewport y of the bottom of the text block, in px

    function measureText() {
      const el = contentRef?.current
      textBottom = el ? el.getBoundingClientRect().bottom : 0
    }

    function setupLogo() {
      // the mark sits below the text, never across it. With room to spare that
      // is the LOGO_Y position; on a short screen the text pushes it down and
      // it shrinks to fit what is left.
      const textRow = Math.ceil(textBottom / CELL_H) + LOGO_GAP_ROWS
      const room = rows - textRow
      if (room < LOGO_MIN_ROWS) {
        // nowhere legible to put it — a glyph chopped off by the bottom of the
        // screen reads worse than no glyph. drawLogoMask bails on logoCols < 1.
        logoRows = logoCols = 0
        return
      }
      logoRows = Math.min(LOGO_ROWS, room)
      logoCols = Math.max(1, Math.round(logoRows * LOGO_ASPECT))
      logoOffC = Math.floor((cols - logoCols) / 2)
      // prefer LOGO_Y, but never rise above the text
      logoOffR = Math.min(
        rows - logoRows,
        Math.max(textRow, Math.floor(rows * LOGO_Y - logoRows / 2))
      )

      const w = logoCols * LOGO_SS
      const h = logoRows * LOGO_SS
      glyph.width = mask.width = w
      glyph.height = mask.height = h

      glyphCtx!.clearRect(0, 0, w, h)
      glyphCtx!.font = `900 ${h}px system-ui, sans-serif`
      glyphCtx!.textBaseline = 'middle'
      glyphCtx!.textAlign = 'center'
      glyphCtx!.fillStyle = '#fff'
      glyphCtx!.fillText(LOGO_TEXT, w / 2, h / 2 + LOGO_SS * 2)

      // measure the ink so the spin scales about the glyph's true centre rather
      // than the canvas centre — side bearings differ from font to font, and an
      // off-centre axis drags the mark sideways as it squashes
      const px = glyphCtx!.getImageData(0, 0, w, h).data
      let lo = w
      let hi = -1
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (px[(y * w + x) * 4 + 3] < 8) continue
          if (x < lo) lo = x
          if (x > hi) hi = x
        }
      }
      inkX = hi < lo ? 0 : lo
      inkW = hi < lo ? w : hi - lo + 1
    }

    function drawLogoMask(t: number, out: LogoCell[]) {
      if (logoCols < 1 || logoRows < 1) return
      const w = mask.width
      const h = mask.height
      const spin = Math.cos(t * 0.4)
      // spin squashes the width; LOGO_STRETCH undoes the cell-grid stretch
      const destW = Math.max(0.5, inkW * LOGO_STRETCH * Math.abs(spin))

      maskCtx!.clearRect(0, 0, w, h)
      maskCtx!.save()
      maskCtx!.translate(w / 2, 0)
      if (spin < 0) maskCtx!.scale(-1, 1) // edge-on, now showing the back face
      maskCtx!.drawImage(glyph, inkX, 0, inkW, h, -destW / 2, 0, destW, h)
      maskCtx!.restore()

      const img = maskCtx!.getImageData(0, 0, w, h).data
      const bright = 0.4 + Math.abs(spin) * 0.6 // dim while edge-on
      const cellArea = LOGO_SS * LOGO_SS * 255
      for (let r = 0; r < logoRows; r++) {
        const gr = logoOffR + r
        if (gr < 0 || gr >= rows) continue
        for (let c = 0; c < logoCols; c++) {
          const gc = logoOffC + c
          if (gc < 0 || gc >= cols) continue
          // mean alpha over the cell's block of mask pixels — a continuous
          // coverage, so an edge cell fades instead of popping on at a threshold
          let sum = 0
          for (let y = 0; y < LOGO_SS; y++) {
            const row = (r * LOGO_SS + y) * w + c * LOGO_SS
            for (let x = 0; x < LOGO_SS; x++) sum += img[(row + x) * 4 + 3]
          }
          const cover = sum / cellArea
          if (cover < LOGO_MIN_COVER) continue
          out.push({
            r: gr,
            c: gc,
            ch: LOGO_TEXT,
            d: bright,
            f: Math.min(1, cover / LOGO_FADE),
          })
        }
      }
    }

    let raf = 0

    function frame(now: number) {
      stepParticles()
      drawSim()

      const data = simCtx!.getImageData(0, 0, SIM_W, simH).data
      ctx!.clearRect(0, 0, canvas!.width / dpr, canvas!.height / dpr)
      ctx!.font = FONT
      ctx!.textBaseline = 'top'

      const logoCells: LogoCell[] = []
      drawLogoMask(now / 1000, logoCells)
      const logoSet = new Set(logoCells.map((l) => l.r * cols + l.c))

      let lastStep = -1
      for (let r = 0; r < rows; r++) {
        const sy = Math.min(simH - 1, ((r / rows) * simH) | 0) * SIM_W
        for (let c = 0; c < cols; c++) {
          if (logoSet.has(r * cols + c)) continue // logo wins the cell
          const sx = Math.min(SIM_W - 1, ((c / cols) * SIM_W) | 0)
          const i = (sy + sx) * 4
          let b = ((data[i] + data[i + 1] + data[i + 2]) / 765) * 0.65
          if (b < 0.025) continue
          if (b > 1) b = 1
          const step = (b * STEPS + 0.5) | 0
          if (step !== lastStep) {
            ctx!.fillStyle = palette[step]
            lastStep = step
          }
          ctx!.fillText(FILL_CHARS[c % FILL_CHARS.length], c * CELL_W, r * CELL_H)
        }
      }

      // logo cells breathe with a per-row / per-column sine
      const tSec = now / 1000
      for (const l of logoCells) {
        let d =
          l.d +
          Math.sin(l.r * 0.25 - tSec * 2) * 0.12 +
          Math.sin(l.c * 0.3 - tSec * 1.5) * 0.08
        d = Math.max(0.35, Math.min(1, d)) * l.f // f softens the mark's edge
        const step = (d * STEPS + 0.5) | 0
        if (step !== lastStep) {
          ctx!.fillStyle = palette[step]
          lastStep = step
        }
        ctx!.fillText(l.ch, l.c * CELL_W, l.r * CELL_H)
      }

      raf = requestAnimationFrame(frame)
    }

    function resize() {
      dpr = window.devicePixelRatio || 1
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = `${window.innerWidth}px`
      canvas!.style.height = `${window.innerHeight}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(window.innerWidth / CELL_W)
      rows = Math.floor(window.innerHeight / CELL_H)
      simH = Math.round((SIM_W * window.innerHeight) / window.innerWidth)
      sim.width = SIM_W
      sim.height = simH
      measureText()
      setupLogo()
    }

    const toSim = (e: PointerEvent): [number, number] => [
      (e.clientX / window.innerWidth) * SIM_W,
      (e.clientY / window.innerHeight) * simH,
    ]

    const onMove = (e: PointerEvent) => {
      const [x, y] = toSim(e)
      if (!mouse.has) {
        mouse.x = x
        mouse.y = y
        mouse.has = true
      }
      emitTrail(x, y)
    }
    const onDown = (e: PointerEvent) => emitExplosion(...toSim(e))

    resize()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('resize', resize)

    // the paragraph reflows when the webfont swaps in, which moves its bottom
    // edge — re-place the mark whenever the text block changes size
    const ro = new ResizeObserver(() => {
      measureText()
      setupLogo()
    })
    if (contentRef?.current) ro.observe(contentRef.current)

    // opening burst so the first frame isn't blank
    emitExplosion(SIM_W / 2, simH / 2)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', resize)
      ro.disconnect()
    }
  }, [contentRef])

  return (
    <canvas
      ref={canvasRef}
      className="ascii-canvas"
      // blocks the right-click "Copy image" / "Save image as" menu
      onContextMenu={(e) => e.preventDefault()}
    />
  )
}
