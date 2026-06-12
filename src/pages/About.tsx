import { useEffect } from 'react'
import { Plate, PlateHeader } from '../components/Atelier/Atelier'
import { useSiteFlags } from '../lib/useSiteFlags'
import NotFound from './NotFound'
import './pages.css'

/**
 * Personal about page — dark-launched behind site-config.json `aboutEnabled`.
 * Scaffold only: portrait slot reserved for a Midjourney-generated stylized
 * portrait/animation (no photos by design). Flip the flag when content lands.
 */
export default function About() {
  const { aboutEnabled, loaded } = useSiteFlags()

  useEffect(() => {
    if (aboutEnabled) document.title = 'About — Joe Burns'
  }, [aboutEnabled])

  if (!loaded) return null
  if (!aboutEnabled) return <NotFound />

  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text="SUBJECT FILE · JOE BURNS" />
        <h1 className="at-page__title">About</h1>
        <p className="at-page__status">WORK IN PROGRESS</p>

        <div className="study-section">
          <div className="study-section__head">
            <span className="study-section__label">I</span>
            <h2 className="study-section__heading">Portrait</h2>
          </div>
          <div className="study-section__body">
            <Plate surface>
              <p className="body-copy" style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                RESERVED · STYLIZED PORTRAIT (MIDJOURNEY)
              </p>
            </Plate>
          </div>
        </div>

        <div className="study-section">
          <div className="study-section__head">
            <span className="study-section__label">II</span>
            <h2 className="study-section__heading">Off the clock</h2>
          </div>
          <div className="study-section__body">
            <p className="body-copy">
              Who I am and what I like to do — drafted here before the flag flips.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
