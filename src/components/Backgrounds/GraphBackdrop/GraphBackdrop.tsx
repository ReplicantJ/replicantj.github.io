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

type GraphNode = {
  ox: number
  oy: number
  phaseX: number
  phaseY: number
  ampX: number
  ampY: number
}

function buildNodesAndLinks(width: number, height: number) {
  const minSide = Math.min(width, height)
  const maxD = minSide * LINK_DIST_FR
  const maxD2 = maxD * maxD

  const nodes: GraphNode[] = Array.from({ length: NODE_COUNT }, () => ({
    ox: Math.random() * width,
    oy: Math.random() * height,
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    ampX: 14 + Math.random() * 30,
    ampY: 12 + Math.random() * 26,
  }))

  const links: [number, number][] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].ox - nodes[j].ox
      const dy = nodes[i].oy - nodes[j].oy
      if (dx * dx + dy * dy <= maxD2) {
        links.push([i, j])
      }
    }
  }

  return { nodes, links }
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

      ctx.fillStyle = `rgba(${LINE_RGB},${NODE_ALPHA})`
      for (const p of pos) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, NODE_RADIUS_CSS, 0, Math.PI * 2)
        ctx.fill()
      }
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
