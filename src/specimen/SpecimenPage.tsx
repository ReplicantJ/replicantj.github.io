import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import SplitFlapText from '../components/TextAnimations/SplitFlapText/SplitFlapText'
import './specimen.css'

/* ===== Sample content (real site copy, operational voice) ===== */

const SAMPLE_BODY =
  'Safeguards specialist focused on detecting, investigating, and mitigating coordinated misuse across large-scale AI systems — linking accounts across disparate systems and converting emerging threats into mitigation strategies.'

const PAIRINGS = [
  {
    key: 'A',
    title: 'INSCRIPTION',
    display: "'Marcellus', serif",
    body: "'Jost', sans-serif",
    fonts: 'MARCELLUS · JOST',
  },
  {
    key: 'B',
    title: 'SALON',
    display: "'Italiana', serif",
    body: "'Hanken Grotesk', sans-serif",
    fonts: 'ITALIANA · HANKEN GROTESK',
  },
  {
    key: 'C',
    title: 'MARQUEE',
    display: "'Melodrama', serif",
    body: "'General Sans', sans-serif",
    fonts: 'MELODRAMA · GENERAL SANS',
  },
  {
    key: 'D',
    title: 'MODERNIST',
    display: "'Clash Display', sans-serif",
    body: "'Switzer', sans-serif",
    fonts: 'CLASH DISPLAY · SWITZER',
  },
]

const LIGHT_SWATCHES = [
  { name: 'Ground', hex: '#f4f0e6' },
  { name: 'Surface', hex: '#ece6d7' },
  { name: 'Ink', hex: '#211d15' },
  { name: 'Ink 2', hex: '#4d4738' },
  { name: 'Brass', hex: '#96762f' },
  { name: 'Brass bright', hex: '#b8933f' },
  { name: 'Jade', hex: '#20695a' },
  { name: 'Jade bright', hex: '#2e8a73' },
]

const DARK_SWATCHES = [
  { name: 'Ground', hex: '#050806' },
  { name: 'Surface', hex: '#0a110c' },
  { name: 'Ink', hex: '#ece5d3' },
  { name: 'Ink 2', hex: '#c6bda5' },
  { name: 'Brass', hex: '#c2a14e' },
  { name: 'Brass bright', hex: '#dcbf72' },
  { name: 'Jade', hex: '#3fa384' },
  { name: 'Jade bright', hex: '#5cc4a3' },
]

/* ===== Ornament bits ===== */

function RegMark() {
  return (
    <svg className="reg-mark" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="9" cy="9" r="5.5" />
      <path d="M9 0v4M9 14v4M0 9h4M14 9h4" />
    </svg>
  )
}

function Plate({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`plate ${className}`}>
      <div className="plate-inner">{children}</div>
    </div>
  )
}

/* ===== Monogram concepts ===== */

function MonogramRoundel() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="46" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="41.5" strokeWidth="0.7" />
      <path d="M28 30 H44" strokeWidth="2.6" />
      <path d="M44 30 V70" strokeWidth="2.6" />
      <path d="M44 70 A13 13 0 0 1 18 70" strokeWidth="2.6" />
      <path d="M44 30 h10 a10.5 10.5 0 0 1 0 21 h-10" strokeWidth="2.2" />
      <path d="M44 51 h12 a10.5 10.5 0 0 1 0 21 h-12" strokeWidth="2.2" />
    </svg>
  )
}

function MonogramStamp() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <path d="M14 4 H86 L96 14 V86 L86 96 H14 L4 86 V14 Z" strokeWidth="1.6" />
      <path d="M16.5 8.5 H83.5 L91.5 16.5 V83.5 L83.5 91.5 H16.5 L8.5 83.5 V16.5 Z" strokeWidth="0.6" />
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontSize="36"
        letterSpacing="3"
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: 'var(--at-font-display)' }}
      >
        JB
      </text>
    </svg>
  )
}

function MonogramKeystone() {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <path d="M20 90 V46 A30 30 0 0 1 80 46 V90 Z" strokeWidth="1.6" />
      <path d="M50 86 L27 51" strokeWidth="0.55" />
      <path d="M50 86 L36 33" strokeWidth="0.55" />
      <path d="M50 86 L50 22" strokeWidth="0.55" />
      <path d="M50 86 L64 33" strokeWidth="0.55" />
      <path d="M50 86 L73 51" strokeWidth="0.55" />
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontSize="26"
        letterSpacing="2"
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: 'var(--at-font-display)' }}
      >
        JB
      </text>
    </svg>
  )
}

/* ===== Sections ===== */

function SpecHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="spec-head">
      <span className="spec-num">{num}</span>
      <span className="spec-title">{title}</span>
    </div>
  )
}

export default function SpecimenPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="sheet">
      <header className="masthead">
        <div>
          <p className="masthead-eyebrow">SPECIMEN SHEET 01 · JOEBURNS.AI</p>
          <h1>ATELIER</h1>
        </div>
        <button
          className="theme-btn"
          onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        >
          {theme === 'light' ? 'EVENING STUDY' : 'DAYLIGHT STUDY'}
        </button>
      </header>
      <hr className="rule rule--double masthead-rule" />

      {/* 01 · Palette */}
      <section className="spec-section">
        <SpecHead num="01" title="PALETTE" />
        <div className="palette-grid">
          <div>
            <p className="palette-col-label">DAYLIGHT STUDY</p>
            <div className="swatch-row">
              {LIGHT_SWATCHES.map(s => (
                <div className="swatch" key={`l-${s.name}`}>
                  <div className="swatch-chip" style={{ background: s.hex }} />
                  <div className="swatch-meta">
                    <span className="swatch-name">{s.name}</span>
                    <span className="swatch-hex">{s.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="palette-col-label">EVENING STUDY</p>
            <div className="swatch-row">
              {DARK_SWATCHES.map(s => (
                <div className="swatch" key={`d-${s.name}`}>
                  <div className="swatch-chip" style={{ background: s.hex }} />
                  <div className="swatch-meta">
                    <span className="swatch-name">{s.name}</span>
                    <span className="swatch-hex">{s.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Type pairings */}
      <section className="spec-section">
        <SpecHead num="02" title="TYPE PAIRINGS" />
        <p className="spec-note">
          Display carries the name and headings. Body carries prose. JetBrains Mono survives
          only on data — dates, tags, figures. Hover any name to feel the hierarchy.
        </p>
        <div className="pairing-grid">
          {PAIRINGS.map(p => (
            <Plate key={p.key}>
              <div
                style={{ '--pair-display': p.display, '--pair-body': p.body } as CSSProperties}
              >
                <p className="pair-eyebrow">
                  <span>
                    PAIRING {p.key} · {p.title}
                  </span>
                  <span className="pair-fonts">{p.fonts}</span>
                </p>
                <p className="pair-name">Joe Burns</p>
                <p className="pair-caps">ABUSE INFRASTRUCTURE DISRUPTION</p>
                <p className="pair-body">{SAMPLE_BODY}</p>
                <p className="pair-data">FEB 2023 — PRESENT · GRAPH CLUSTERING · UNDER 2 HRS</p>
                <p className="pair-numerals">0 1 2 3 4 5 6 7 8 9 — №</p>
              </div>
            </Plate>
          ))}
        </div>
      </section>

      {/* 03 · Stat callout */}
      <section className="spec-section">
        <SpecHead num="03" title="STAT CALLOUT" />
        <Plate>
          <div className="stat-callout">
            <p className="stat-eyebrow">AVG DETECTION TIME · COORDINATED MISUSE</p>
            <p className="stat-line">
              <span>30 DAYS</span>
              <span className="arrow">→</span>
              <span className="hot">UNDER 2 HRS</span>
            </p>
            <p className="stat-foot">BEHAVIORAL ANALYSIS + CUSTOM INVESTIGATIVE TOOLING</p>
          </div>
        </Plate>
      </section>

      {/* 04 · Monogram concepts */}
      <section className="spec-section">
        <SpecHead num="04" title="MONOGRAM CONCEPTS" />
        <div className="mono-grid">
          <Plate className="mono-card">
            <p className="mono-label">A · ROUNDEL</p>
            <div className="mono-pair">
              <div className="mono-chip mono-chip--ink">
                <MonogramRoundel />
              </div>
              <div className="mono-chip mono-chip--brass">
                <MonogramRoundel />
              </div>
            </div>
            <p className="mono-desc">
              Shared-stem JB ligature drawn from circle geometry inside a double ring. Bauhaus
              construction, deco weight.
            </p>
          </Plate>
          <Plate className="mono-card">
            <p className="mono-label">B · PLATE STAMP</p>
            <div className="mono-pair">
              <div className="mono-chip mono-chip--ink">
                <MonogramStamp />
              </div>
              <div className="mono-chip mono-chip--brass">
                <MonogramStamp />
              </div>
            </div>
            <p className="mono-desc">
              Chamfered frame with inner hairline, typeset initials — the chop that stamps every
              plate on the site.
            </p>
          </Plate>
          <Plate className="mono-card">
            <p className="mono-label">C · KEYSTONE</p>
            <div className="mono-pair">
              <div className="mono-chip mono-chip--ink">
                <MonogramKeystone />
              </div>
              <div className="mono-chip mono-chip--brass">
                <MonogramKeystone />
              </div>
            </div>
            <p className="mono-desc">
              Arch with radiating hairlines — the one deco-literal option, shown for range.
            </p>
          </Plate>
        </div>
      </section>

      {/* 05 · Ornament */}
      <section className="spec-section">
        <SpecHead num="05" title="ORNAMENT" />
        <div className="ornament-stack">
          <div>
            <p className="orn-label">HAIRLINE / DOUBLE RULE / SOFT RULE</p>
            <hr className="rule" />
            <div style={{ height: '1rem' }} />
            <hr className="rule rule--double" />
            <div style={{ height: '1rem' }} />
            <hr className="rule rule--soft" />
          </div>
          <div>
            <p className="orn-label">PLATE HEADER · REGISTRATION MARKS</p>
            <div className="plate-header-demo">
              <RegMark />
              <span className="plate-header-text">PLATE 02 · ENFORCEMENT APP</span>
              <hr className="rule plate-header-rule" />
              <RegMark />
            </div>
          </div>
          <div>
            <p className="orn-label">SECTION NUMERAL · OUTLINED</p>
            <p className="big-numeral">02</p>
          </div>
        </div>
      </section>

      {/* 06 · Split-flap retheme */}
      <section className="spec-section">
        <SpecHead num="06" title="SPLIT-FLAP" />
        <p className="spec-note">
          Two tile treatments. Dark tiles read as a true Solari board on both grounds; surface
          tiles are the quieter option. Hover to replay.
        </p>
        <div className="board-row">
          <div className="board-demo board--dark">
            <SplitFlapText text="FEATURED WORK" animateOn="inViewHover" />
          </div>
          <div className="board-demo board--surface">
            <SplitFlapText text="REPLICANT" animateOn="inViewHover" />
          </div>
        </div>
      </section>

      <footer className="sheet-foot">ATELIER SPECIMEN 01 · DEV ONLY · NOT BUILT TO PROD</footer>
    </div>
  )
}
