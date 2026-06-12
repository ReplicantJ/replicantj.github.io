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

/* One wavelength-exact sine, sampled at λ/8 and smoothed Catmull-Rom; shared by the
   visible wave stroke and the waterline mask. Regenerate via .local/gen-boat-svg.cjs. */
const SAILBOAT_WAVE =
  'M60.0,380.2C61.8,381.9 67.2,387.5 70.8,390.3C74.3,393.1 77.9,396.0 81.5,397.0C85.1,398.0 88.7,397.7 92.3,396.3C95.8,395.0 99.4,391.7 103.0,388.8C106.6,385.8 110.2,381.5 113.8,378.7C117.3,375.9 120.9,373.0 124.5,372.0C128.1,371.0 131.7,371.3 135.3,372.7C138.8,374.0 142.4,377.3 146.0,380.2C149.6,383.2 153.2,387.5 156.8,390.3C160.3,393.1 163.9,396.0 167.5,397.0C171.1,398.0 174.7,397.7 178.3,396.3C181.8,395.0 185.4,391.7 189.0,388.8C192.6,385.8 196.2,381.5 199.8,378.7C203.3,375.9 206.9,373.0 210.5,372.0C214.1,371.0 217.7,371.3 221.3,372.7C224.8,374.0 228.4,377.3 232.0,380.2C235.6,383.2 239.2,387.5 242.8,390.3C246.3,393.1 249.9,396.0 253.5,397.0C257.1,398.0 260.7,397.7 264.3,396.3C267.8,395.0 271.4,391.7 275.0,388.8C278.6,385.8 282.2,381.5 285.8,378.7C289.3,375.9 292.9,373.0 296.5,372.0C300.1,371.0 303.7,371.3 307.3,372.7C310.8,374.0 314.4,377.3 318.0,380.2C321.6,383.2 325.2,387.5 328.8,390.3C332.3,393.1 335.9,396.0 339.5,397.0C343.1,398.0 346.7,397.7 350.3,396.3C353.8,395.0 357.4,391.7 361.0,388.8C364.6,385.8 368.2,381.5 371.8,378.7C375.3,375.9 378.9,373.0 382.5,372.0C386.1,371.0 389.7,371.3 393.3,372.7C396.8,374.0 400.4,377.3 404.0,380.2C407.6,383.2 411.2,387.5 414.8,390.3C418.3,393.1 421.9,396.0 425.5,397.0C429.1,398.0 432.7,397.7 436.3,396.3C439.8,395.0 443.4,391.7 447.0,388.8C450.6,385.8 454.2,381.5 457.8,378.7C461.3,375.9 464.9,373.0 468.5,372.0C472.1,371.0 475.7,371.3 479.3,372.7C482.8,374.0 486.4,377.3 490.0,380.2C493.6,383.2 497.2,387.5 500.8,390.3C504.3,393.1 507.9,396.0 511.5,397.0C515.1,398.0 518.7,397.7 522.3,396.3C525.8,395.0 531.2,390.0 533.0,388.8'

/** Animated dhow riding a running wave — traced from the original site gif (public/sailboat.svg
 *  is the standalone copy). SMIL-animated: the boat rocks and bobs on a 3s cycle while the wave
 *  slides one wavelength per 1.5s. A waterline mask, moving with the wave, trims the hull's bow
 *  line exactly at the water so the loop is seamless from every angle. */
export function Sailboat({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="74 86 360 324"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <mask id="at-sailboat-waterline" maskUnits="userSpaceOnUse" x="-30" y="0" width="572" height="512">
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; -86 0"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <path d={`${SAILBOAT_WAVE}V0H60Z`} fill="#fff" stroke="none" />
          </g>
        </mask>
      </defs>
      <g mask="url(#at-sailboat-waterline)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -7.5; 0 0"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            dur="3s"
            repeatCount="indefinite"
          />
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 256 355; -2.5 256 355; 0 256 355"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
              dur="3s"
              repeatCount="indefinite"
            />
            {/* main sail, jib, hull (bow line extends underwater; the mask trims it) */}
            <path d="M136,108 C164,168 182,263 135,325 C182,313 260,302 299,319 C297,263 229,158 136,108 Z" />
            <path d="M227,143 C285,177 352,252 369,318 C355,314 341,314 327,317 C322,275 272,183 227,143 Z" />
            <path d="M118,375 C112,368 108,361 107,353 L407,335 L290,405" />
          </g>
        </g>
      </g>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; -86 0"
          dur="1.5s"
          repeatCount="indefinite"
        />
        {/* dash window holds the visible wave span fixed while the path slides */}
        <path d={SAILBOAT_WAVE} strokeDasharray="406.96 618.16" strokeDashoffset="-31.08">
          <animate attributeName="stroke-dashoffset" values="-31.08;-134.38" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
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
