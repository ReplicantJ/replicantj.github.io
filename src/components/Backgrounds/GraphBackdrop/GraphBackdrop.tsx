import { useEffect, useRef } from 'react'
import './GraphBackdrop.css'

/** Default node count on tablet/desktop viewports. */
const NODE_COUNT_DEFAULT = 220
/** Halved node count on narrow viewports (phones); reduces edge-pair work and improves cluster legibility. */
const NODE_COUNT_NARROW = 110
/** CSS-pixel width below which NODE_COUNT_NARROW is used. Sits just above the 480px breakpoint in src/App.css with a small buffer for tablets in portrait. */
const NARROW_VIEWPORT_PX = 600
/** Max distance (fraction of min viewport side) to create a link */
const LINK_DIST_FR = 0.175
const LINE_WIDTH_CSS = 1.15
const NODE_RADIUS_CSS = 2.35
/** Slow oscillation for organic drift */
const TIME_SCALE = 0.00022

/** Nodes below this normalized glow value are skipped entirely (both halo and edge boost). */
const GLOW_THRESHOLD = 0.08
/** Halo radius for the single brightest hub; scales down with importance. */
const GLOW_MAX_RADIUS_CSS = 22
/** Additive alpha added to edge strokes when at least one endpoint is glowing. */
const EDGE_BOOST_ALPHA = 0.22
/** Density radius as a multiple of the link radius (wider, so density isn't just degree restated). */
const DENSITY_RADIUS_FR = LINK_DIST_FR * 1.6
/** Blend weights between degree and density when scoring nodes for cluster seed selection. */
const DEGREE_WEIGHT = 0.6
const DENSITY_WEIGHT = 0.4
/** Anomaly cluster size, randomized per build for visual variety. */
const CLUSTER_MIN_SIZE = 3
const CLUSTER_MAX_SIZE = 6
/** Outermost cluster member is (1 - CLUSTER_FALLOFF) as bright as the seed. */
const CLUSTER_FALLOFF = 0.4
/** Top structural scores used as precomputed rotation candidates. */
const CANDIDATE_POOL_SIZE = 10
/** Jittered interval between rotating which candidate cluster is active. */
const CLUSTER_ROTATE_MIN_MS = 14000
const CLUSTER_ROTATE_MAX_MS = 32000
const CANDIDATE_WEIGHT_EPS = 1e-6
const CANDIDATE_WEIGHT_EXP = 2
const PULSE_PERIOD_MIN_MS = 3200
const PULSE_PERIOD_MAX_MS = 5200
/** Constant pulse factor used when prefers-reduced-motion is active. */
const REDUCED_MOTION_PULSE = 0.6

type GraphPalette = {
  lineRgb: string
  lineAlpha: number
  nodeAlpha: number
  glowRgb: string
}

const PALETTE_DARK: GraphPalette = {
  lineRgb: '255,255,255',
  lineAlpha: 0.16,
  nodeAlpha: 0.22,
  /** Orange glow tuned to match dark --accent-warm-bright (#c4703e). */
  glowRgb: '196,112,62',
}

const PALETTE_LIGHT: GraphPalette = {
  lineRgb: '107,93,72',
  lineAlpha: 0.09,
  nodeAlpha: 0.14,
  /** Verdigris (--purple-mid #4a9d87). */
  glowRgb: '74,157,135',
}

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

function randomRotateIntervalMs(): number {
  return (
    CLUSTER_ROTATE_MIN_MS +
    Math.random() * (CLUSTER_ROTATE_MAX_MS - CLUSTER_ROTATE_MIN_MS)
  )
}

/** Picks an index ≠ currentIdx with probability ∝ weights[i] among the rest. */
function pickWeightedDifferent(
  weights: number[],
  currentIdx: number
): number {
  const n = weights.length
  if (n <= 1) return 0
  let sum = 0
  for (let i = 0; i < n; i++) {
    if (i !== currentIdx) sum += weights[i]
  }
  if (sum <= 0) {
    const others: number[] = []
    for (let i = 0; i < n; i++) {
      if (i !== currentIdx) others.push(i)
    }
    return others[Math.floor(Math.random() * others.length)]!
  }
  let r = Math.random() * sum
  for (let i = 0; i < n; i++) {
    if (i === currentIdx) continue
    r -= weights[i]
    if (r <= 0) return i
  }
  for (let i = n - 1; i >= 0; i--) {
    if (i !== currentIdx) return i
  }
  return 0
}

function importanceForSeed(
  nodes: GraphNode[],
  seedIdx: number,
  K: number
): number[] {
  const importance = new Array<number>(nodes.length).fill(0)
  const seed = nodes[seedIdx]
  const ranked: { i: number; d2: number }[] = []
  for (let i = 0; i < nodes.length; i++) {
    if (i === seedIdx) continue
    const dx = nodes[i].ox - seed.ox
    const dy = nodes[i].oy - seed.oy
    ranked.push({ i, d2: dx * dx + dy * dy })
  }
  ranked.sort((a, b) => a.d2 - b.d2)

  importance[seedIdx] = 1.0
  const memberCount = Math.min(K - 1, ranked.length)
  const denom = Math.max(1, K - 1)
  for (let r = 0; r < memberCount; r++) {
    const t = (r + 1) / denom
    importance[ranked[r].i] = 1.0 - CLUSTER_FALLOFF * t
  }
  return importance
}

function buildNodesAndLinks(width: number, height: number) {
  const minSide = Math.min(width, height)
  const maxD = minSide * LINK_DIST_FR
  const maxD2 = maxD * maxD
  const densityR = minSide * DENSITY_RADIUS_FR
  const densityR2 = densityR * densityR

  const nodeCount =
    width < NARROW_VIEWPORT_PX ? NODE_COUNT_NARROW : NODE_COUNT_DEFAULT

  const nodes: GraphNode[] = Array.from({ length: nodeCount }, () => ({
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

  const degree = new Array<number>(nodeCount).fill(0)
  const density = new Array<number>(nodeCount).fill(0)
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

  if (nodes.length === 0) {
    return { nodes, links, clusterCandidates: [], clusterWeights: [] }
  }

  let maxDegree = 0
  let maxDensity = 0
  for (let i = 0; i < nodes.length; i++) {
    if (degree[i] > maxDegree) maxDegree = degree[i]
    if (density[i] > maxDensity) maxDensity = density[i]
  }
  const degDenom = maxDegree || 1
  const denDenom = maxDensity || 1

  const scores = new Array<number>(nodes.length)
  for (let i = 0; i < nodes.length; i++) {
    const dN = degree[i] / degDenom
    const pN = density[i] / denDenom
    scores[i] = DEGREE_WEIGHT * dN + DENSITY_WEIGHT * pN
  }

  const sortedIdx = Array.from({ length: nodes.length }, (_, i) => i)
  sortedIdx.sort((a, b) => scores[b] - scores[a])

  const pool = Math.min(CANDIDATE_POOL_SIZE, nodes.length)
  const candidateSeeds = sortedIdx.slice(0, pool)

  const K =
    CLUSTER_MIN_SIZE +
    Math.floor(Math.random() * (CLUSTER_MAX_SIZE - CLUSTER_MIN_SIZE + 1))

  const clusterCandidates: number[][] = []
  for (const seedIdx of candidateSeeds) {
    clusterCandidates.push(importanceForSeed(nodes, seedIdx, K))
  }

  const clusterWeights: number[] = []
  let wSum = 0
  for (const seedIdx of candidateSeeds) {
    const raw = Math.max(scores[seedIdx], CANDIDATE_WEIGHT_EPS)
    const w = Math.pow(raw, CANDIDATE_WEIGHT_EXP)
    clusterWeights.push(w)
    wSum += w
  }
  for (let c = 0; c < clusterWeights.length; c++) {
    clusterWeights[c] /= wSum
  }

  return { nodes, links, clusterCandidates, clusterWeights }
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

export type GraphBackdropTheme = 'dark' | 'light'

export default function GraphBackdrop({
  theme = 'dark',
}: {
  theme?: GraphBackdropTheme
}) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const {
      lineRgb: LINE_RGB,
      lineAlpha: LINE_ALPHA,
      nodeAlpha: NODE_ALPHA,
      glowRgb: GLOW_RGB,
    } = theme === 'light' ? PALETTE_LIGHT : PALETTE_DARK

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
    let clusterCandidates: number[][] = []
    let clusterWeights: number[] = []
    let activeCluster = 0
    let nextClusterSwitchAt = 0
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
      clusterCandidates = built.clusterCandidates
      clusterWeights = built.clusterWeights
      activeCluster = 0
      if (clusterCandidates.length === 0) {
        importance = []
      } else {
        importance = clusterCandidates[0]
      }
      glow = new Array<number>(nodes.length).fill(0)
      nextClusterSwitchAt = performance.now() + randomRotateIntervalMs()
    }

    const loop = (now: number) => {
      if (
        !reducedMotion &&
        clusterCandidates.length > 1 &&
        now >= nextClusterSwitchAt
      ) {
        activeCluster = pickWeightedDifferent(clusterWeights, activeCluster)
        importance = clusterCandidates[activeCluster]
        nextClusterSwitchAt = now + randomRotateIntervalMs()
      }
      drawFrame(now)
      raf = requestAnimationFrame(loop)
    }

    const syncMotionAndRaf = () => {
      reducedMotion = mq.matches
      cancelAnimationFrame(raf)
      raf = 0
      if (reducedMotion) {
        if (clusterCandidates.length > 0) {
          activeCluster = 0
          importance = clusterCandidates[0]
        }
        drawFrame(0)
      } else {
        nextClusterSwitchAt = performance.now() + randomRotateIntervalMs()
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
  }, [theme])

  return <div ref={wrapRef} className="graph-backdrop" />
}
