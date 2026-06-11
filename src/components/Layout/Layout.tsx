import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import { Monogram } from '../Atelier/Atelier'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { SOCIAL_LINKS } from '../../lib/socialLinks'
import { useSiteFlags } from '../../lib/useSiteFlags'
import './Layout.css'

export default function Layout() {
  const { aboutEnabled } = useSiteFlags()

  return (
    <>
      <nav className="site-nav" aria-label="Primary">
        <Link to="/" className="site-nav__brand" aria-label="Home">
          <Monogram size={30} />
          <span className="site-nav__wordmark">JOE BURNS</span>
        </Link>
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
        <p className="atelier-footer__copy">© {new Date().getFullYear()} JOE BURNS · REPLICANTSECURITY.COM</p>
      </footer>

      <ScrollRestoration />
    </>
  )
}
