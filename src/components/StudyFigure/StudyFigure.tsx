import './StudyFigure.css'

/** Deterministic PRNG so synthetic figures render identically every visit. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ----- FIG 01 · synthetic account-cluster topology ----- */

function ClusterFigure() {
  const rand = mulberry32(1924)
  const hubs = [
    { x: 150, y: 180, n: 11 },
    { x: 380, y: 110, n: 8 },
    { x: 560, y: 230, n: 13 },
  ]
  const leaves: { x: number; y: number; hx: number; hy: number }[] = []
  hubs.forEach(h => {
    for (let i = 0; i < h.n; i++) {
      const angle = rand() * Math.PI * 2
      const dist = 34 + rand() * 64
      leaves.push({
        x: h.x + Math.cos(angle) * dist,
        y: h.y + Math.sin(angle) * dist * 0.72,
        hx: h.x,
        hy: h.y,
      })
    }
  })
  return (
    <svg viewBox="0 0 720 340" className="study-fig" role="img" aria-label="Synthetic account cluster diagram">
      {/* inter-hub edges */}
      <g className="fig-edge fig-edge--hub">
        <path d={`M${hubs[0].x} ${hubs[0].y} L${hubs[1].x} ${hubs[1].y}`} />
        <path d={`M${hubs[1].x} ${hubs[1].y} L${hubs[2].x} ${hubs[2].y}`} />
      </g>
      {/* leaf edges */}
      <g className="fig-edge">
        {leaves.map((l, i) => (
          <path key={i} d={`M${l.hx} ${l.hy} L${l.x.toFixed(1)} ${l.y.toFixed(1)}`} />
        ))}
      </g>
      {/* leaves */}
      <g className="fig-node">
        {leaves.map((l, i) => (
          <circle key={i} cx={l.x.toFixed(1)} cy={l.y.toFixed(1)} r="3" />
        ))}
      </g>
      {/* hubs */}
      <g className="fig-node fig-node--hub">
        {hubs.map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r="7" />
        ))}
      </g>
      <g className="fig-label">
        <text x="150" y="294">RESELLER A</text>
        <text x="380" y="56">BROKER</text>
        <text x="560" y="312">RESELLER B</text>
      </g>
    </svg>
  )
}

/* ----- FIG 02 · enforcement pipeline blueprint ----- */

function Box({ x, y, w, h, label, dashed = false }: { x: number; y: number; w: number; h: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className={dashed ? 'fig-box fig-box--dashed' : 'fig-box'} />
      <text x={x + w / 2} y={y + h / 2 + 4} className="fig-box-label" textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function Arrow({ d }: { d: string }) {
  return <path d={d} className="fig-arrow" markerEnd="url(#fig-arrowhead)" />
}

function PipelineFigure() {
  return (
    <svg viewBox="0 0 720 340" className="study-fig" role="img" aria-label="Enforcement pipeline blueprint schematic">
      <defs>
        <marker id="fig-arrowhead" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" className="fig-arrowhead" />
        </marker>
      </defs>
      <Box x={20} y={40} w={130} h={44} label="PLATFORM APIS" />
      <Box x={20} y={150} w={130} h={44} label="SIGNAL INGEST" />
      <Box x={20} y={256} w={130} h={44} label="LOCAL DATASTORE" />
      <Box x={250} y={150} w={150} h={44} label="PATTERN ENGINE" />
      <Box x={250} y={256} w={150} h={44} label="CLASSIFIER" />
      <Box x={490} y={150} w={110} h={44} label="VERDICT" dashed />
      <Box x={580} y={40} w={120} h={44} label="AUTO ENFORCE" />
      <Box x={580} y={256} w={120} h={44} label="REVIEW QUEUE" />
      <Arrow d="M85 84 L85 146" />
      <Arrow d="M85 194 L85 252" />
      <Arrow d="M150 172 L246 172" />
      <Arrow d="M150 278 L246 278" />
      <Arrow d="M325 252 L325 198" />
      <Arrow d="M400 172 L486 172" />
      <Arrow d="M560 150 L600 88" />
      <Arrow d="M560 194 L600 252" />
      <path d="M640 256 C640 210 460 130 404 146" className="fig-arrow fig-arrow--return" markerEnd="url(#fig-arrowhead)" />
      <text x="520" y="120" className="fig-label">ANALYST IN THE LOOP</text>
    </svg>
  )
}

/* ----- FIG 03 · benchmark placeholder ----- */

function BenchmarkFigure() {
  const rows = [
    { name: 'SLICENDICE', w: 300 },
    { name: 'BWGNN', w: 360 },
    { name: 'TGN', w: 330 },
    { name: 'RULES BASELINE', w: 210 },
  ]
  return (
    <svg viewBox="0 0 720 300" className="study-fig" role="img" aria-label="Model benchmark placeholder chart">
      <defs>
        <pattern id="fig-hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="7" className="fig-hatch-line" />
        </pattern>
      </defs>
      {rows.map((r, i) => {
        const y = 36 + i * 62
        return (
          <g key={r.name}>
            <text x="20" y={y + 17} className="fig-label">{r.name}</text>
            <rect x="180" y={y} width={r.w} height="26" fill="url(#fig-hatch)" className="fig-bar" />
            <text x={188 + r.w} y={y + 17} className="fig-label fig-label--dim">PENDING</text>
          </g>
        )
      })}
      <line x1="180" y1="20" x2="180" y2="276" className="fig-axis" />
    </svg>
  )
}

export default function StudyFigure({ kind }: { kind: 'cluster' | 'pipeline' | 'benchmark' }) {
  if (kind === 'cluster') return <ClusterFigure />
  if (kind === 'pipeline') return <PipelineFigure />
  return <BenchmarkFigure />
}
