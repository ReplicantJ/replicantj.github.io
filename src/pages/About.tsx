import { PlateHeader } from '../components/Atelier/Atelier'
import { useSiteFlags } from '../lib/useSiteFlags'
import NotFound from './NotFound'
import './pages.css'

/**
 * Personal about page — dark-launched behind site-config.json `aboutEnabled`.
 * Content is WIP scaffolding; flip the flag when ready.
 */
export default function About() {
  const { aboutEnabled, loaded } = useSiteFlags()

  if (!loaded) return null
  if (!aboutEnabled) return <NotFound />

  return (
    <main className="at-page">
      <div className="at-page__sheet">
        <PlateHeader text="SUBJECT FILE · JOE BURNS" />
        <h1 className="at-page__title">About</h1>
        <p className="at-page__status">WORK IN PROGRESS</p>
        <p className="at-page__abstract">
          Who I am and what I like to do — portrait, interests, and the things I build for fun.
          Content lands here before the flag flips.
        </p>
      </div>
    </main>
  )
}
