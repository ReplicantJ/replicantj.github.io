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

const TAU = Math.PI * 2

/* ===== Easter-egg relics — steampunk chart marginalia ===== */

type RelicKind =
  | 'rocket' | 'dyson' | 'blackhole' | 'supernova' | 'planet' | 'comet' | 'airship'

const RELIC_KINDS: RelicKind[] = [
  'rocket', 'dyson', 'blackhole', 'supernova', 'planet', 'comet', 'airship',
]

const DIRECTIONAL = new Set<RelicKind>(['rocket', 'comet', 'airship'])

type Relic = {
  kind: RelicKind
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  scale: number
  born: number
}

/* Drift pace: heavy celestial bodies barely creep; powered craft cruise at node pace. */
function relicSpeed(kind: RelicKind): number {
  return DIRECTIONAL.has(kind) ? 0.04 + Math.random() * 0.045 : 0.006 + Math.random() * 0.01
}

function relicsRequested(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('relics')
}

function buildRelics(w: number, h: number, bornBase = DRAW_IN_MS): Relic[] {
  /* ?relics=all lays the whole catalog out for inspection — itself an easter egg. */
  if (relicsRequested()) {
    return RELIC_KINDS.map((kind, i) => ({
      kind,
      x: ((i + 0.5) / RELIC_KINDS.length) * w,
      y: h * 0.5,
      vx: 0,
      vy: 0,
      rot: DIRECTIONAL.has(kind) ? -0.35 : 0,
      scale: 1.15,
      born: i * 160,
    }))
  }
  return RELIC_KINDS.map((kind, i) => {
    let x = w * 0.5
    let y = h * 0.5
    /* keep clear of the hero name in the center */
    for (let tries = 0; tries < 24; tries++) {
      x = 40 + Math.random() * (w - 80)
      y = 40 + Math.random() * (h - 80)
      if (Math.abs(x - w / 2) > w * 0.3 || Math.abs(y - h / 2) > h * 0.26) break
    }
    const heading = Math.random() * TAU
    const speed = relicSpeed(kind)
    const vx = Math.cos(heading) * speed
    const vy = Math.sin(heading) * speed
    return {
      kind,
      x,
      y,
      vx,
      vy,
      rot: DIRECTIONAL.has(kind) ? Math.atan2(vy, vx) : (Math.random() - 0.5) * 0.35,
      scale: 0.6 + Math.random() * 0.3,
      born: bornBase + 400 + i * 260,
    }
  })
}

type Ctx = CanvasRenderingContext2D

function drawRocket(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.42 * a
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.moveTo(26, 0)
  ctx.quadraticCurveTo(8, -10, -16, -8)
  ctx.lineTo(-16, 8)
  ctx.quadraticCurveTo(8, 10, 26, 0)
  ctx.moveTo(-10, -8.5)
  ctx.lineTo(-22, -15)
  ctx.lineTo(-16, -6)
  ctx.moveTo(-10, 8.5)
  ctx.lineTo(-22, 15)
  ctx.lineTo(-16, 6)
  ctx.stroke()
  ctx.strokeStyle = pal.brass
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(6, 0, 4, 0, TAU)
  ctx.stroke()
  ctx.lineWidth = hl
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(-20, 0)
  ctx.lineTo(-33, 0)
  ctx.moveTo(-19, -4)
  ctx.lineTo(-28, -6.5)
  ctx.moveTo(-19, 4)
  ctx.lineTo(-28, 6.5)
  ctx.stroke()
  ctx.setLineDash([])
}

function drawDyson(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.42 * a
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.arc(0, 0, 22, 0, TAU)
  ctx.stroke()
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.ellipse(0, 0, 22, 8, 0, 0, TAU)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(0, 0, 22, 8, Math.PI / 3, 0, TAU)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, -27)
  ctx.lineTo(0, 27)
  ctx.stroke()
  ctx.fillStyle = pal.brass
  ctx.strokeStyle = pal.brass
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(0, 0, 4, 0, TAU)
  ctx.fill()
  ctx.lineWidth = lw
  ctx.beginPath()
  for (let k = 0; k < 4; k++) {
    const ang = Math.PI / 4 + (k * Math.PI) / 2
    ctx.moveTo(Math.cos(ang) * 7, Math.sin(ang) * 7)
    ctx.lineTo(Math.cos(ang) * 11, Math.sin(ang) * 11)
  }
  ctx.stroke()
}

function drawBlackHole(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.fillStyle = pal.ink
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(0, 0, 6, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = pal.brass
  ctx.globalAlpha = 0.55 * a
  ctx.lineWidth = lw
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.ellipse(0, 0, 19, 6, 0, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.ellipse(0, 0, 19, 6, 0, 0, Math.PI) /* solid front half */
  ctx.stroke()
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.35 * a
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.arc(0, 0, 11, Math.PI * 1.15, Math.PI * 1.85) /* lensing arc above */
  ctx.stroke()
}

function drawSupernova(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.fillStyle = pal.jade
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(0, 0, 3, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = pal.brass
  ctx.lineWidth = lw
  ctx.beginPath()
  for (let k = 0; k < 8; k++) {
    const ang = (k * Math.PI) / 4
    ctx.moveTo(Math.cos(ang) * 8, Math.sin(ang) * 8)
    ctx.lineTo(Math.cos(ang) * 21, Math.sin(ang) * 21)
  }
  ctx.stroke()
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.4 * a
  ctx.lineWidth = hl
  ctx.beginPath()
  for (let k = 0; k < 8; k++) {
    const ang = Math.PI / 8 + (k * Math.PI) / 4
    ctx.moveTo(Math.cos(ang) * 8, Math.sin(ang) * 8)
    ctx.lineTo(Math.cos(ang) * 13.5, Math.sin(ang) * 13.5)
  }
  ctx.stroke()
  ctx.globalAlpha = 0.25 * a
  ctx.setLineDash([3, 4])
  ctx.beginPath()
  ctx.arc(0, 0, 25, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
}

function drawPlanet(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.42 * a
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.arc(0, 0, 10.5, 0, TAU)
  ctx.stroke()
  ctx.globalAlpha = 0.3 * a
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.arc(-3.5, 0, 8.2, -1.25, 1.25) /* terminator shading hint */
  ctx.stroke()
  ctx.strokeStyle = pal.brass
  ctx.globalAlpha = 0.55 * a
  ctx.lineWidth = lw
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.ellipse(0, 0, 20, 6.5, -0.28, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.ellipse(0, 0, 20, 6.5, -0.28, 0, Math.PI) /* solid front of ring */
  ctx.stroke()
}

function drawComet(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.fillStyle = pal.brass
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(0, 0, 3, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = pal.brass
  ctx.globalAlpha = 0.45 * a
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.arc(0, 0, 4.8, 0, TAU) /* coma */
  ctx.stroke()
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.38 * a
  ctx.lineWidth = lw
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(-6, 0)
  ctx.lineTo(-32, 0)
  ctx.moveTo(-5, -2.6)
  ctx.lineTo(-25, -6)
  ctx.moveTo(-5, 2.6)
  ctx.lineTo(-25, 6)
  ctx.stroke()
  ctx.setLineDash([])
}

function drawAirship(ctx: Ctx, pal: Palette, a: number, lw: number, hl: number) {
  ctx.strokeStyle = pal.ink
  ctx.globalAlpha = 0.42 * a
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.ellipse(0, 0, 22, 7.5, 0, 0, TAU)
  ctx.stroke()
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.moveTo(-7, -7.1)
  ctx.lineTo(-7, 7.1)
  ctx.moveTo(5, -7.3)
  ctx.lineTo(5, 7.3)
  ctx.stroke()
  ctx.lineWidth = lw
  ctx.beginPath()
  ctx.moveTo(-20, -4.5)
  ctx.lineTo(-28, -9)
  ctx.lineTo(-28, 9)
  ctx.lineTo(-20, 4.5)
  ctx.stroke()
  ctx.strokeRect(-5, 9.5, 11, 3.8)
  ctx.lineWidth = hl
  ctx.beginPath()
  ctx.moveTo(-3, 7.5)
  ctx.lineTo(-3, 9.5)
  ctx.moveTo(4, 7.4)
  ctx.lineTo(4, 9.5)
  ctx.stroke()
  ctx.fillStyle = pal.brass
  ctx.globalAlpha = 0.6 * a
  ctx.beginPath()
  ctx.arc(-2, 11.4, 0.8, 0, TAU)
  ctx.arc(2, 11.4, 0.8, 0, TAU)
  ctx.fill()
}

function drawRelic(ctx: Ctx, r: Relic, pal: Palette, appear: number) {
  const lw = 1.1 / r.scale
  const hl = 0.7 / r.scale
  ctx.save()
  ctx.translate(r.x, r.y)
  ctx.rotate(r.rot)
  ctx.scale(r.scale, r.scale)
  switch (r.kind) {
    case 'rocket': drawRocket(ctx, pal, appear, lw, hl); break
    case 'dyson': drawDyson(ctx, pal, appear, lw, hl); break
    case 'blackhole': drawBlackHole(ctx, pal, appear, lw, hl); break
    case 'supernova': drawSupernova(ctx, pal, appear, lw, hl); break
    case 'planet': drawPlanet(ctx, pal, appear, lw, hl); break
    case 'comet': drawComet(ctx, pal, appear, lw, hl); break
    case 'airship': drawAirship(ctx, pal, appear, lw, hl); break
  }
  ctx.restore()
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
    let relics: Relic[] = []
    let summoned = relicsRequested() /* relics stay hidden until the sigil summons them */
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
      relics = summoned ? buildRelics(w, h) : []
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

      for (const r of relics) {
        let appear = 1
        if (!reduced) {
          appear = Math.min(1, Math.max(0, (t - r.born) / 700))
          if (appear <= 0) continue
        }
        drawRelic(ctx!, r, pal, appear)
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
        for (const r of relics) {
          r.x += r.vx
          r.y += r.vy
          if (r.x < -40) r.x = w + 40
          if (r.x > w + 40) r.x = -40
          if (r.y < -40) r.y = h + 40
          if (r.y > h + 40) r.y = -40
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

    /* The nav's spyglass sigil summons the full relic fleet (and dismisses it again). */
    const onSpyglass = () => {
      summoned = !summoned
      const tNow = reduced ? DRAW_IN_MS : performance.now() - start
      relics = summoned ? buildRelics(w, h, tNow) : []
      if (reduced) drawFrame(performance.now())
    }
    window.addEventListener('atelier:spyglass', onSpyglass)

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
      window.removeEventListener('atelier:spyglass', onSpyglass)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />
}
