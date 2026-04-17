import { useEffect, useRef } from 'react'
import './GraphBackdrop.css'

const NODE_COUNT = 220
/** Max distance (fraction of min viewport side) to create a link */
const LINK_DIST_FR = 0.175
const LINE_RGB = '255,255,255'
const LINE_ALPHA = 0.16
const NODE_ALPHA = 0.22
const LINE_WIDTH_CSS = 1.15
const NODE_RADIUS_CSS = 2.35
/** Slow oscillation for organic drift */
const TIME_SCALE = 0.00022

/** Orange glow tuned to match --accent-warm-bright (#c4703e = 196,112,62). */
const GLOW_RGB = '196,112,62'
/** Nodes below this normalized glow value are skipped entirely (both halo and edge boost). */
const GLOW_THRESHOLD = 0.08
/** Halo radius for the single brightest hub; scales down with importance. */
const GLOW_MAX_RADIUS_CSS = 22
/** Additive alpha added to edge strokes when at least one endpoint is glowing. */
const EDGE_BOOST_ALPHA = 0.22
/** Density radius as a multiple of the link radius (wider, so density isn't just degree restated). */
const DENSITY_RADIUS_FR = LINK_DIST_FR * 1.6
/** Blend weights between degree and density when computing each node's score. */
const DEGREE_WEIGHT = 0.6
const DENSITY_WEIGHT = 0.4
/** Soft curve on the normalized score so only real hubs pop. */
const IMPORTANCE_EXP = 1.6
const PULSE_PERIOD_MIN_MS = 3200
const PULSE_PERIOD_MAX_MS = 5200
/** Constant pulse factor used when prefers-reduced-motion is active. */
const REDUCED_MOTION_PULSE = 0.6

type GraphNode = {
  ox: number
  oy: number
  phaseX: number
  phaseY: number
  ampX: number
  ampY: number
  pulsePhase: number
  pulsePeriodMs: number
}

function buildNodesAndLinks(width: number, height: number) {
  const minSide = Math.min(width, height)
  const maxD = minSide * LINK_DIST_FR
  const maxD2 = maxD * maxD
  const densityR = minSide * DENSITY_RADIUS_FR
  const densityR2 = densityR * densityR

  const nodes: GraphNode[] = Array.from({ length: NODE_COUNT }, () => ({
    ox: Math.random() * width,
    oy: Math.random() * height,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    ampX: 14 + Math.random() * 30,
    ampY: 12 + Math.random() * 26,
    pulsePhase: Math.random() * Math.PI * 2,
    pulsePeriodMs:
      PULSE_PERIOD_MIN_MS +
      Math.random() * (PULSE_PERIOD_MAX_MS - PULSE_PERIOD_MIN_MS),
  }))

  const degree = new Array<number>(nodes.length).fill(0)
  const density = new Array<number>(nodes.length).fill(0)
  const links: [number, number][] = []

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].ox - nodes[j].ox
      const dy = nodes[i].oy - nodes[j].oy
      const d2 = dx * dx + dy * dy
      if (d2 <= maxD2) {
        links.push([i, j])
        degree[i]++
        degree[j]++
      }
      if (d2 <= densityR2) {
        density[i]++
        density[j]++
      }
    }
  }

  let maxDegree = 0
  let maxDensity = 0
  for (let i = 0; i < nodes.length; i++) {
    if (degree[i] > maxDegree) maxDegree = degree[i]
    if (density[i] > maxDensity) maxDensity = density[i]
  }
  const degDenom = maxDegree || 1
  const denDenom = maxDensity || 1

  const importance = new Array<number>(nodes.length)
  for (let i = 0; i < nodes.length; i++) {
    const dN = degree[i] / degDenom
    const pN = density[i] / denDenom
    const score = Math.min(
      1,
      Math.max(0, DEGREE_WEIGHT * dN + DENSITY_WEIGHT * pN)
    )
    importance[i] = Math.pow(score, IMPORTANCE_EXP)
  }

  return { nodes, links, importance }
}

function positionAt(
  n: GraphNode,
  t: number,
  width: number,
  height: number
): { x: number; y: number } {
  const ax = Math.sin(t * TIME_SCALE + n.phaseX) * n.ampX
  const ay = Math.cos(t * TIME_SCALE * 0.93 + n.phaseY) * n.ampY
  let x = n.ox + ax
  let y = n.oy + ay
  x = Math.max(0, Math.min(width, x))
  y = Math.max(0, Math.min(height, y))
  return { x, y }
}

export default function GraphBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    wrap.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      canvas.remove()
      return
    }

    let nodes: GraphNode[] = []
    let links: [number, number][] = []
    let importance: number[] = []
    let glow: number[] = []
    let dpr = 1
    let cssW = 0
    let cssH = 0
    let raf = 0
    let reducedMotion = mq.matches

    const drawFrame = (t: number) => {
      const w = cssW
      const h = cssH
      if (w < 1 || h < 1) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const pos = nodes.map(n => positionAt(n, t, w, h))

      for (let i = 0; i < nodes.length; i++) {
        const imp = importance[i]
        if (imp <= 0) {
          glow[i] = 0
          continue
        }
        let pulse: number
        if (reducedMotion) {
          pulse = REDUCED_MOTION_PULSE
        } else {
          const n = nodes[i]
          const phase = (t / n.pulsePeriodMs) * Math.PI * 2 + n.pulsePhase
          pulse = 0.5 + 0.5 * Math.sin(phase)
        }
        glow[i] = imp * pulse
      }

      ctx.lineWidth = LINE_WIDTH_CSS
      ctx.lineCap = 'round'
      for (const [a, b] of links) {
        const pa = pos[a]
        const pb = pos[b]
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(${LINE_RGB},${LINE_ALPHA})`
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'lighter'
      for (const [a, b] of links) {
        const g = Math.max(glow[a], glow[b])
        if (g <= GLOW_THRESHOLD) continue
        const pa = pos[a]
        const pb = pos[b]
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(${GLOW_RGB},${EDGE_BOOST_ALPHA * g})`
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'

      ctx.fillStyle = `rgba(${LINE_RGB},${NODE_ALPHA})`
      for (const p of pos) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, NODE_RADIUS_CSS, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < nodes.length; i++) {
        const g = glow[i]
        if (g <= GLOW_THRESHOLD) continue
        const p = pos[i]
        const radius = GLOW_MAX_RADIUS_CSS * (0.35 + 0.65 * importance[i])
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        grad.addColorStop(0, `rgba(${GLOW_RGB},${0.55 * g})`)
        grad.addColorStop(1, `rgba(${GLOW_RGB},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(${GLOW_RGB},${0.8 * g})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, NODE_RADIUS_CSS, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const applySize = () => {
      const rect = wrap.getBoundingClientRect()
      cssW = Math.max(1, Math.floor(rect.width))
      cssH = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      const built = buildNodesAndLinks(cssW, cssH)
      nodes = built.nodes
      links = built.links
      importance = built.importance
      glow = new Array<number>(nodes.length).fill(0)
    }

    const loop = (now: number) => {
      drawFrame(now)
      raf = requestAnimationFrame(loop)
    }

    const syncMotionAndRaf = () => {
      reducedMotion = mq.matches
      cancelAnimationFrame(raf)
      raf = 0
      if (reducedMotion) {
        drawFrame(0)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }

    const ro = new ResizeObserver(() => {
      applySize()
      if (reducedMotion) {
        drawFrame(0)
      }
    })
    ro.observe(wrap)
    applySize()

    if (reducedMotion) {
      drawFrame(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    mq.addEventListener('change', syncMotionAndRaf)

    return () => {
      mq.removeEventListener('change', syncMotionAndRaf)
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.remove()
    }
  }, [])

  return <div ref={wrapRef} className="graph-backdrop" />
}
