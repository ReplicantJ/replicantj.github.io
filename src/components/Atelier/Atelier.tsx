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
      <g transform="rotate(-45 50 50)">
        {/* deco telescope: solid stepped draws, eyepiece left, objective right */}
        <path
          d="M18 47.6 H22 V52.4 H18 Z
             M22 47 L38 46.4 L38 53.6 L22 53 Z
             M41 45.4 L57 44.8 L57 55.2 L41 54.6 Z
             M60 43.8 L78 43 L78 57 L60 56.2 Z"
          fill="currentColor"
          stroke="none"
        />
        {/* deco accent ring inset at each draw's wide end */}
        <path
          d="M35.8 46.5 L35.8 53.5 M54.8 44.9 L54.8 55.1 M75.6 43.1 L75.6 56.9"
          stroke="var(--at-ground, #fff)"
          strokeWidth="1.1"
        />
        {/* dashed sight-line */}
        <path d="M81 50 L89 50" strokeWidth="1.6" strokeDasharray="3.2 3" strokeLinecap="round" />
      </g>
    </svg>
  )
}
