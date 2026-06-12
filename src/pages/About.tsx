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
    if (aboutEnabled) document.title = 'About · Joe Burns'
  }, [aboutEnabled])

  if (!loaded) return null
  if (!aboutEnabled) return <NotFound />

  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text="SUBJECT FILE · JOE BURNS" />
        <h1 className="at-page__title">About</h1>
        <p className="at-page__status">WORK IN PROGRESS</p>
        <p className="at-page__abstract">
          Investigator and builder. I work where adversarial behavior meets platform
          infrastructure: finding coordinated networks, attributing the operators behind
          them, and building the systems that find the next one faster. Before any of
          that I made pictures and put on shows, which turn out to be the same job: read
          the pattern, stay calm, get it right the first time.
        </p>

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
              Most of what I do off the clock is still making things. Film gets developed
              at home, by hand, the slow way. Bread comes out of a machine I have
              over-tuned past the point of reason. A vegetable garden runs on more sensor
              telemetry than it strictly requires. The home lab hosts local language
              models, automation pipelines, and at least one experiment with no
              justification beyond curiosity.
            </p>
            <p className="body-copy">
              The pattern underneath all of it: I take systems apart to learn how they
              fail. The darkroom taught me patience and process. Live production taught
              me to read an arena crowd in real time and never panic on the radio. Both
              turned out to be training for this work; I just didn&apos;t know it yet.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
