import { useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Constellation.css'

/**
 * Hero constellation — a fine ink/brass graph that draws itself in like a
 * drafting table coming to life, then settles into slow ambient drift.
 * Scoped to its parent, paused off-screen, static under reduced motion.
 */

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  kind: 'ink' | 'brass' | 'jade'
  born: number // draw-in delay (ms)
}

type Palette = {
  ink: string
  brass: string
  jade: string
}

const DRAW_IN_MS = 2400
const MAX_DPR = 1.5

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement)
  return {
    ink: cs.getPropertyValue('--at-ink-3').trim() || '#7d7560',
    brass: cs.getPropertyValue('--at-brass').trim() || '#96762f',
    jade: cs.getPropertyValue('--at-jade').trim() || '#20695a',
  }
}

function buildNodes(w: number, h: number): Node[] {
  const count = Math.max(54, Math.min(120, Math.round((w * h) / 12500)))
  const nodes: Node[] = []
  for (let i = 0; i < count; i++) {
    const roll = Math.random()
    const kind: Node['kind'] = roll < 0.08 ? 'brass' : roll < 0.13 ? 'jade' : 'ink'
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: kind === 'ink' ? 1.1 + Math.random() * 0.9 : 1.8 + Math.random() * 1.1,
      kind,
      born: Math.random() * (DRAW_IN_MS * 0.55),
    })
  }
  return nodes
}

export default function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { effectiveTheme } = useTheme()
  const paletteRef = useRef<Palette | null>(null)

  /* Re-read token colors whenever the theme flips. */
  useEffect(() => {
    // data-theme is applied in a ThemeProvider effect; read after it lands.
    const id = requestAnimationFrame(() => {
      paletteRef.current = readPalette()
    })
    return () => cancelAnimationFrame(id)
  }, [effectiveTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let nodes: Node[] = []
    let raf = 0
    let running = false
    let start = performance.now()
    let w = 0
    let h = 0

    const linkRadius = () => Math.min(260, Math.max(150, w * 0.16))

    function resize() {
      const rect = parent!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      w = rect.width
      h = rect.height
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes = buildNodes(w, h)
      start = performance.now()
      if (reduced) drawFrame(start + DRAW_IN_MS * 2)
    }

    function drawFrame(now: number) {
      const pal = paletteRef.current ?? readPalette()
      paletteRef.current = pal
      const t = reduced ? DRAW_IN_MS : now - start
      ctx!.clearRect(0, 0, w, h)

      const radius = linkRadius()

      /* Edges: each node links toward its neighbors within radius. */
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > radius) continue

          const fade = 1 - dist / radius
          const bornEdge = Math.max(a.born, b.born)
          /* Draw-in: edge strokes from a toward b after both endpoints are born. */
          let progress = 1
          if (t < DRAW_IN_MS) {
            progress = Math.min(1, Math.max(0, (t - bornEdge) / 600))
            if (progress <= 0) continue
          }

          const brassEdge = a.kind === 'brass' || b.kind === 'brass'
          ctx!.strokeStyle = brassEdge ? pal.brass : pal.ink
          ctx!.globalAlpha = (brassEdge ? 0.4 : 0.22) * fade
          ctx!.lineWidth = brassEdge ? 0.7 : 0.5
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress)
          ctx!.stroke()
        }
      }

      /* Nodes */
      for (const n of nodes) {
        let appear = 1
        if (t < DRAW_IN_MS) {
          appear = Math.min(1, Math.max(0, (t - n.born) / 420))
          if (appear <= 0) continue
        }
        const color = n.kind === 'brass' ? pal.brass : n.kind === 'jade' ? pal.jade : pal.ink
        ctx!.fillStyle = color
        ctx!.globalAlpha = (n.kind === 'ink' ? 0.55 : 0.85) * appear
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r * appear, 0, Math.PI * 2)
        ctx!.fill()

        /* One-time ring flourish as accent nodes land. */
        if (t < DRAW_IN_MS && n.kind !== 'ink' && appear < 1) {
          ctx!.strokeStyle = color
          ctx!.globalAlpha = (1 - appear) * 0.5
          ctx!.lineWidth = 0.8
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, n.r + appear * 14, 0, Math.PI * 2)
          ctx!.stroke()
        }
      }
      ctx!.globalAlpha = 1
    }

    function tick(now: number) {
      if (!running) return
      const t = now - start
      if (t >= DRAW_IN_MS) {
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < -8) n.x = w + 8
          if (n.x > w + 8) n.x = -8
          if (n.y < -8) n.y = h + 8
          if (n.y > h + 8) n.y = -8
        }
      }
      drawFrame(now)
      raf = requestAnimationFrame(tick)
    }

    function play() {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    function pause() {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()
    if (!reduced) play()

    const ro = new ResizeObserver(() => resize())
    ro.observe(parent)

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) play()
          else pause()
        })
      },
      { threshold: 0.02 }
    )
    io.observe(canvas)

    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />
}
