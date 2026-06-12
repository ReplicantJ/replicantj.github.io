import { Link, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router-dom'
import { Monogram, OrigamiUnicorn } from '../Atelier/Atelier'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { SOCIAL_LINKS } from '../../lib/socialLinks'
import { useSiteFlags } from '../../lib/useSiteFlags'
import './Layout.css'

export default function Layout() {
  const { aboutEnabled } = useSiteFlags()
  const location = useLocation()
  const navigate = useNavigate()

  /* The monogram stays the home button; only at the top of the home page does it
     moonlight as the unicorn sigil and summon the chart relics. */
  const onSigilClick = () => {
    if (location.pathname !== '/') {
      navigate('/')
      return
    }
    if (window.scrollY > 120) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.dispatchEvent(new Event('atelier:unicorn'))
  }

  return (
    <>
      <nav className="site-nav" aria-label="Primary">
        <div className="site-nav__brand">
          <button
            type="button"
            className="site-nav__sigil"
            aria-label="Home"
            onClick={onSigilClick}
          >
            <Monogram size={30} />
            <OrigamiUnicorn size={30} />
          </button>
          <Link to="/" className="site-nav__homelink" aria-label="Home">
            <span className="site-nav__wordmark">JOE BURNS</span>
          </Link>
        </div>
        <div className="site-nav__links">
          <Link to="/#work" className="site-nav__link">
            WORK
          </Link>
          {aboutEnabled && (
            <Link to="/about" className="site-nav__link">
              ABOUT
            </Link>
          )}
          <a href="mailto:joe@joeburns.ai" className="site-nav__link">
            CONTACT
          </a>
          <ThemeToggle />
        </div>
      </nav>

      <div className="layout-outlet">
        <Outlet />
      </div>

      <footer className="atelier-footer">
        <nav className="atelier-footer__links" aria-label="Footer links">
          {SOCIAL_LINKS.map(({ label, href, icon }) => {
            const external = href.startsWith('http')
            return (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="atelier-footer__link"
                aria-label={label}
                title={label}
              >
                {icon}
                <span>{label.toUpperCase()}</span>
              </a>
            )
          })}
        </nav>
        <p className="atelier-footer__copy">© {new Date().getFullYear()} JOE BURNS · JOEBURNS.AI</p>
      </footer>

      <ScrollRestoration />
    </>
  )
}
