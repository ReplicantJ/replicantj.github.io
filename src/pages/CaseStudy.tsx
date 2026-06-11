import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PlateHeader } from '../components/Atelier/Atelier'
import { findStudy } from '../lib/studies'
import NotFound from './NotFound'
import './pages.css'

export default function CaseStudy() {
  const { slug } = useParams()
  const study = findStudy(slug)

  useEffect(() => {
    if (study) document.title = `${study.title} — Joe Burns`
    return () => {
      document.title = 'Joe Burns — Trust & Safety · Safeguards · Abuse Infrastructure Disruption'
    }
  }, [study])

  if (!study) return <NotFound />

  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text={`PLATE ${study.plate} · ${study.title.toUpperCase()}`} />
        <h1 className="at-page__title">{study.title}</h1>
        <p className="at-page__status">{study.status}</p>
        <p className="at-page__abstract">{study.abstract}</p>
        <Link to="/" className="at-page__back">
          ← INDEX
        </Link>
      </div>
    </main>
  )
}
