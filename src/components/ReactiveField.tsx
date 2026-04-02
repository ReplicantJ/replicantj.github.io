import { useEffect, useRef } from 'react'

/**
 * Pointer-reactive grid: CSS variables drive a radial highlight and parallax tilt.
 * Respects prefers-reduced-motion.
 */
export function ReactiveField() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      root.classList.add('reactive-field--static')
      return
    }

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2)
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2)
      root.style.setProperty('--px', `${x}%`)
      root.style.setProperty('--py', `${y}%`)
      root.style.setProperty('--tilt-x', `${(-dy * 4).toFixed(2)}deg`)
      root.style.setProperty('--tilt-y', `${(dx * 4).toFixed(2)}deg`)
    }

    const onLeave = () => {
      root.style.setProperty('--tilt-x', '0deg')
      root.style.setProperty('--tilt-y', '0deg')
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      className="reactive-field"
      aria-label="Interactive visual field"
    >
      <div className="reactive-field__plate">
        <span className="reactive-field__glyph" aria-hidden="true">
          ∴
        </span>
        <p className="reactive-field__caption">Move the pointer across this panel</p>
      </div>
    </section>
  )
}
