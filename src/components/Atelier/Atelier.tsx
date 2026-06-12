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

/** Origami unicorn in the monogram's frame — the nav sigil's hover face. */
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
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* horn */}
        <path d="M33 23 L13 10" />
        {/* face top, ear, neck crest, back, tail */}
        <path d="M22 30 L33 23 L38 23 L41 15 L45 25 L56 44 L74 42 L88 26 L84 48 L76 50" />
        {/* muzzle, jaw, throat, chest */}
        <path d="M22 30 L26 36 L36 34 L48 58" />
        {/* belly */}
        <path d="M48 58 L70 54" />
        {/* forelegs */}
        <path d="M48 58 L44 72 L46 86 M53 59 L56 86" />
        {/* hind legs */}
        <path d="M76 50 L79 64 L75 86 M70 54 L71 86" />
      </g>
      {/* fold lines */}
      <path d="M33 23 L36 34 M56 44 L48 58 M74 42 L70 54" strokeWidth="0.8" />
    </svg>
  )
}
