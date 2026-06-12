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

/** Two-draw brass spyglass aimed at a star — the nav sigil's hover face.
 *  The instrument that reveals hidden objects on a chart is the button that summons them. */
export function Spyglass({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="at-spyglass"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path d="M14 4 H86 L96 14 V86 L86 96 H14 L4 86 V14 Z" strokeWidth="2.4" />
      <path d="M16.5 8.5 H83.5 L91.5 16.5 V83.5 L83.5 91.5 H16.5 L8.5 83.5 V16.5 Z" strokeWidth="0.8" />
      <g transform="rotate(-45 50 50)" strokeLinejoin="round" strokeLinecap="round">
        {/* tapering two-draw tube: eyepiece left, objective right */}
        <path
          d="M22 47.6 L36 46.8 L36 45.8 L52 45 L52 44.2 L76 42.6 L76 57.4 L52 55.8 L52 55 L36 54.2 L36 53.2 L22 52.4 Z"
          strokeWidth="2.2"
        />
        {/* eyepiece cap */}
        <path d="M19.6 48.4 L22 48.4 M19.6 51.6 L22 51.6 M19.6 48.4 L19.6 51.6" strokeWidth="1.6" />
        {/* draw rings + objective housing */}
        <path d="M36 45.8 L36 54.2 M52 44.2 L52 55.8 M72.5 42.8 L72.5 57.2" strokeWidth="1.2" />
        {/* dashed sight-line to a small star */}
        <path d="M79 50 L84 50" strokeWidth="1.5" strokeDasharray="3 2.5" />
        <path d="M88.5 45.5 L88.5 54.5 M84 50 L93 50" strokeWidth="1.8" />
      </g>
    </svg>
  )
}
