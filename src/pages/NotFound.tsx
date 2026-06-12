import { Link } from 'react-router-dom'
import { PlateHeader } from '../components/Atelier/Atelier'
import './pages.css'

export default function NotFound() {
  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text="PLATE 404 · NOT IN THE PORTFOLIO" />
        <p className="at-page__numeral" style={{ marginTop: '2.4rem' }}>
          404
        </p>
        <p className="at-page__abstract">This plate does not exist in the drawer.</p>
        <Link to="/" className="at-page__back">
          ← INDEX
        </Link>
      </div>
    </main>
  )
}
