import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './SplitFlapText.css'

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&.·—'

const SR_ONLY_STYLE = {
  position: 'absolute' as const,
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: 0,
}

interface SplitFlapTextProps {
  text: string
  /** view: animate once when scrolled into view. hover: animate on hover. inViewHover: both. */
  animateOn?: 'view' | 'hover' | 'inViewHover'
  /** Duration of one full flap rotation in ms. */
  flipMs?: number
  /** Stagger between adjacent cells starting their run, in ms. */
  cascadeMs?: number
  minFlips?: number
  maxFlips?: number
  /** Drum character order; cells flip through it in sequence to reach their target. */
  charset?: string
  parentClassName?: string
}

/** Ordered drum path from blank to the target glyph, like a real split-flap cycling its reel. */
function buildPath(target: string, charset: string, minFlips: number, maxFlips: number): string[] {
  const idx = charset.indexOf(target)
  if (idx === -1) return [' ', target]
  const flips = minFlips + Math.floor(Math.random() * (maxFlips - minFlips + 1))
  const path = [' ']
  for (let i = flips - 1; i >= 0; i--) {
    path.push(charset[(idx - i + charset.length * Math.ceil(maxFlips / charset.length + 1)) % charset.length])
  }
  return path
}

interface CellProps {
  target: string
  generation: number
  startDelay: number
  flipMs: number
  minFlips: number
  maxFlips: number
  charset: string
  reducedMotion: boolean
}

function SplitFlapCell({
  target,
  generation,
  startDelay,
  flipMs,
  minFlips,
  maxFlips,
  charset,
  reducedMotion,
}: CellProps) {
  const pathRef = useRef<string[]>([target])
  /** -2: settled blank (pre-trigger) · -1: settled on target · >=0: in flight at this path step */
  const [step, setStep] = useState<number>(reducedMotion ? -1 : -2)

  useEffect(() => {
    if (reducedMotion) {
      setStep(-1)
      return
    }
    if (generation === 0) {
      setStep(-2)
      return
    }
    pathRef.current = buildPath(target, charset, minFlips, maxFlips)
    setStep(-2)
    const timer = setTimeout(() => setStep(0), startDelay)
    return () => clearTimeout(timer)
  }, [generation, target, charset, minFlips, maxFlips, startDelay, reducedMotion])

  const advance = useCallback(() => {
    setStep(prev => {
      if (prev < 0) return prev
      return prev + 2 < pathRef.current.length ? prev + 1 : -1
    })
  }, [])

  const path = pathRef.current
  const inFlight = step >= 0 && step + 1 < path.length
  const curr = inFlight ? path[step] : step === -2 ? ' ' : target
  const next = inFlight ? path[step + 1] : null

  if (target === ' ') {
    return (
      <span className="sf-cell sf-cell--blank">
        <span className="sf-half sf-top" />
        <span className="sf-half sf-bottom" />
      </span>
    )
  }

  return (
    <span className="sf-cell">
      <span className="sf-half sf-top">
        <span className="sf-char">{next ?? curr}</span>
      </span>
      <span className="sf-half sf-bottom">
        <span className="sf-char">{curr}</span>
      </span>
      {next !== null && (
        <span
          className="sf-flap"
          key={step}
          style={{ '--sf-flip-ms': `${flipMs}ms` } as React.CSSProperties}
          onAnimationEnd={advance}
        >
          <span className="sf-flap-face sf-flap-front">
            <span className="sf-char">{curr}</span>
          </span>
          <span className="sf-flap-face sf-flap-back">
            <span className="sf-char">{next}</span>
          </span>
        </span>
      )}
    </span>
  )
}

export default function SplitFlapText({
  text,
  animateOn = 'inViewHover',
  flipMs = 80,
  cascadeMs = 35,
  minFlips = 4,
  maxFlips = 9,
  charset = DEFAULT_CHARSET,
  parentClassName = '',
}: SplitFlapTextProps) {
  const [generation, setGeneration] = useState(0)
  const containerRef = useRef<HTMLSpanElement>(null)
  const busyUntilRef = useRef(0)

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  /* Words as nowrap cell groups; spaces become layout gaps so wrapping stays clean. */
  const words = useMemo(() => {
    let globalIndex = 0
    return text
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => ({
        word,
        cells: word.split('').map(char => ({ char, index: globalIndex++ })),
      }))
  }, [text])

  const totalCells = useMemo(() => words.reduce((n, w) => n + w.cells.length, 0), [words])

  const run = useCallback(() => {
    if (reducedMotion) return
    const now = performance.now()
    if (now < busyUntilRef.current) return
    busyUntilRef.current = now + totalCells * cascadeMs + maxFlips * (flipMs + 30) + 250
    setGeneration(gen => gen + 1)
  }, [reducedMotion, totalCells, cascadeMs, maxFlips, flipMs])

  useEffect(() => {
    if (reducedMotion || (animateOn !== 'view' && animateOn !== 'inViewHover')) return
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            run()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [animateOn, reducedMotion, run])

  const hoverProps =
    animateOn === 'hover' || animateOn === 'inViewHover' ? { onMouseEnter: run } : {}

  return (
    <span className={parentClassName} ref={containerRef} {...hoverProps}>
      <span style={SR_ONLY_STYLE}>{text}</span>
      <span className="sf-board" aria-hidden="true">
        {words.map(({ word, cells }, wordIdx) => (
          <span className="sf-word" key={`${word}-${wordIdx}`}>
            {cells.map(({ char, index }) => (
              <SplitFlapCell
                key={index}
                target={char}
                generation={generation}
                startDelay={index * cascadeMs}
                flipMs={flipMs}
                minFlips={minFlips}
                maxFlips={maxFlips}
                charset={charset}
                reducedMotion={reducedMotion}
              />
            ))}
          </span>
        ))}
      </span>
    </span>
  )
}
