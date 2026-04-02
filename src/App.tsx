import { useEffect, useState, type ReactNode } from 'react'
import Grainient from './components/Backgrounds/Grainient/Grainient'
import BlurText from './components/TextAnimations/BlurText/BlurText'
import './App.css'

type SocialLink = {
  label: string
  href: string
  icon: ReactNode
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/joe-burns-81822b14b/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.com/users/_replicant',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:joe@joeburns.ai',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
  },
]

export default function App() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <div className="background">
        <Grainient
          color1="#000000"
          color2="#16001f"
          color3="#33002f"
          timeSpeed={1.2}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={3.9}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.38}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={0.7}
          gamma={1}
          saturation={1.45}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <main className="content">
        {showContent && (
          <>
            <div className="name-container">
              <BlurText
                text="Joe Burns"
                delay={80}
                animateBy="letters"
                direction="bottom"
                className="name"
              />
            </div>

            <p className="tagline">Security Research & Adversarial Intelligence</p>

            <div className="divider" />

            <nav className="socials" aria-label="Social links">
              {SOCIAL_LINKS.map(({ label, href, icon }) => {
                const external = href.startsWith('http')
                return (
                  <a
                    key={label}
                    href={href}
                    {...(external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="social-link"
                    aria-label={label}
                    title={label}
                  >
                    {icon}
                    <span className="social-label">{label}</span>
                  </a>
                )
              })}
            </nav>
          </>
        )}
      </main>
    </div>
  )
}
