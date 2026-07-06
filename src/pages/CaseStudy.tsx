import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plate, PlateHeader, Rule } from '../components/Atelier/Atelier'
import StudyFigure from '../components/StudyFigure/StudyFigure'
import { STUDIES, findStudy } from '../lib/studies'
import NotFound from './NotFound'
import './pages.css'

export default function CaseStudy() {
  const { slug } = useParams()
  const study = findStudy(slug)

  useEffect(() => {
    if (study) document.title = `${study.title} · Joe Burns`
    return () => {
      document.title = 'Joe Burns · Trust & Safety · Safeguards · Abuse Infrastructure Disruption'
    }
  }, [study])

  if (!study) return <NotFound />

  const idx = STUDIES.indexOf(study)
  const prev = STUDIES[idx - 1]
  const next = STUDIES[idx + 1]

  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text={`PLATE ${study.plate} · ${study.title.toUpperCase()}`} />

        <h1 className="at-page__title">{study.title}</h1>
        <p className="at-page__status">{study.status}</p>
        <p className="at-page__abstract">{study.abstract}</p>

        {study.metricsLabel && <p className="study-metrics-label">{study.metricsLabel}</p>}
        <div className="study-metrics">
          {study.metrics.map(m => (
            <div className="study-metric" key={m.label}>
              <span className="study-metric__value">{m.value}</span>
              <span className="study-metric__label">{m.label}</span>
            </div>
          ))}
        </div>

        {study.sections.map(section => (
          <section className="study-section" key={section.heading}>
            <div className="study-section__head">
              <span className="study-section__label">{section.label}</span>
              <h2 className="study-section__heading">{section.heading}</h2>
            </div>
            <div className="study-section__body">
              {section.paragraphs.map((p, i) => (
                <p className="body-copy" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}

        {study.figure && (
          <figure className="study-figure">
            <Plate surface>
              <StudyFigure kind={study.figure} />
            </Plate>
            <figcaption className="study-figure__caption">{study.figureCaption}</figcaption>
          </figure>
        )}

        <Rule variant="double" className="study-pager-rule" />
        <nav className="study-pager" aria-label="Plate navigation">
          {prev ? (
            <Link to={`/work/${prev.slug}`} className="study-pager__link">
              ← PLATE {prev.plate}
            </Link>
          ) : (
            <span />
          )}
          <Link to="/" className="study-pager__link study-pager__link--index">
            INDEX
          </Link>
          {next ? (
            <Link to={`/work/${next.slug}`} className="study-pager__link">
              PLATE {next.plate} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  )
}
