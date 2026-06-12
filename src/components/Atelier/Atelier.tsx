import type { ReactNode } from 'react'
import './Atelier.css'

export function Rule({ variant = '', className = '' }: { variant?: '' | 'double' | 'soft'; className?: string }) {
  const mod = variant ? ` at-rule--${variant}` : ''
  return <hr className={`at-rule${mod} ${className}`} />
}

export function RegMark() {
  return (
    <svg className="at-regmark" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M9 0v4M9 14v4M0 9h4M14 9h4" />
    </svg>
  )
}

export function Plate({
  children,
  surface = false,
  className = '',
}: {
  children: ReactNode
  surface?: boolean
  className?: string
}) {
  return (
    <div className={`at-plate${surface ? ' at-plate--surface' : ''} ${className}`}>
      <div className="at-plate__inner">{children}</div>
    </div>
  )
}

export function PlateHeader({ text }: { text: string }) {
  return (
    <div className="at-plate-header">
      <RegMark />
      <span className="at-plate-header__text">{text}</span>
      <Rule className="at-plate-header__rule" />
      <RegMark />
    </div>
  )
}

/** Plate-stamp JB monogram — chamfered frame, inner hairline, initials in the display face. */
export function Monogram({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="at-monogram"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M14 4 H86 L96 14 V86 L86 96 H14 L4 86 V14 Z" strokeWidth="2.4" />
      <path d="M16.5 8.5 H83.5 L91.5 16.5 V83.5 L83.5 91.5 H16.5 L8.5 83.5 V16.5 Z" strokeWidth="0.8" />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontSize="40"
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

/** Origami unicorn in the monogram's frame — the nav sigil's hover face.
 *  Filled paper silhouette with creases knocked out in the ground color. */
export function OrigamiUnicorn({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="at-unicorn"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M14 4 H86 L96 14 V86 L86 96 H14 L4 86 V14 Z" strokeWidth="2.4" />
      <path d="M16.5 8.5 H83.5 L91.5 16.5 V83.5 L83.5 91.5 H16.5 L8.5 83.5 V16.5 Z" strokeWidth="0.8" />
      <path
        d="M62 11 L65.5 28.5 L71 22.5 L71.5 32 L75 51 L79 54 L89 70 L68 63 L67 89 L59 64 L50 63 L46 89 L41 63 L13 72 L41 55 L53 51 L55 39 L48 33 L57.5 27.5 Z"
        fill="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <g stroke="var(--at-ground, #fff)" strokeWidth="1.4" strokeLinecap="round">
        {/* horn bands */}
        <path d="M60.6 16 L63.4 16 M59.6 20.5 L64.3 20.5 M58.6 25 L65 25" />
        {/* paper creases: jaw, neck, body facets, shoulder */}
        <path d="M57.5 27.5 L55 39 M56 38.5 L72 49 M53 51 L50 63 M53 51 L59 64 M75 51 L68 63 M41 55 L41 63" />
      </g>
    </svg>
  )
}
