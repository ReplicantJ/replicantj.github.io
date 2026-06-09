import { useEffect, useMemo, useState, type ReactNode } from 'react'
import Grainient from './components/Backgrounds/Grainient/Grainient'
import GraphBackdrop from './components/Backgrounds/GraphBackdrop/GraphBackdrop'
import BlurText from './components/TextAnimations/BlurText/BlurText'
import DecryptedText from './components/TextAnimations/DecryptedText/DecryptedText'
import SpotlightCard from './components/Components/SpotlightCard/SpotlightCard'
import AnimatedContent from './components/Animations/AnimatedContent/AnimatedContent'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import { useTheme } from './context/ThemeContext'
import './App.css'

/* ===== Data ===== */

const discordSnowflake =
  import.meta.env.VITE_DISCORD_USER_ID?.trim() || '190942242070855680'

/** Mobile: https profile (custom protocol is flaky). Desktop: discord:// targets the installed client so it focuses one instance instead of spawning via a new browser tab + https handoff. */
function discordProfileHrefForClient(snowflake: string): string {
  if (!/^\d{17,20}$/.test(snowflake)) return 'https://discord.com/app'
  const httpsProfile = `https://discord.com/users/${snowflake}`
  if (typeof navigator === 'undefined') return httpsProfile
  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return httpsProfile
  }
  return `discord://-/users/${snowflake}`
}

const discordProfileHref = discordProfileHrefForClient(discordSnowflake)

type SocialLink = {
  label: string
  href: string
  icon: ReactNode
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/-joe-burns/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: discordProfileHref,
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
  {
    label: 'GitHub',
    href: 'https://github.com/ReplicantJ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Midjourney',
    href: 'https://www.midjourney.com/@replicant',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden>
        <path d="M22.119 17.07c-.16.008-2.39.15-4.632.298-.714.048-1.559.1-1.88.12-.318.02-.902.058-1.299.085-.393.028-.995.065-1.333.086-.338.02-1.193.075-1.896.12-.704.047-2.003.13-2.888.187-.882.059-2.075.134-2.65.17-.574.039-1.541.1-2.153.138-1.651.1-1.634.096-1.71.328-.044.134-.016.205.42 1.026l.223.413-.567.39c-.92.632-1.251.817-1.466.817-.048 0-.127.044-.185.1-.14.14-.137.31.007.454.099.099.113.102.325.085.297-.024.673-.205 1.292-.63 1.042-.717 1.302-.864 1.524-.864.164 0 .342.11.886.544.735.584 1.01.752 1.456.889.369.116.728.13 1.077.04.406-.098.69-.256 1.288-.7.687-.516.83-.585 1.207-.585.369 0 .53.076 1.008.462.544.44.69.547.954.68.31.157.573.219.925.219.527-.003.971-.215 1.624-.766.608-.513.878-.632 1.343-.601.346.023.547.12.992.482.905.734 1.258.909 1.863.909.55 0 .96-.185 1.675-.76.276-.218.601-.45.724-.512.205-.102.246-.113.564-.113.318 0 .36.007.568.11.13.065.39.253.601.434.209.178.455.38.544.45.383.295 1.005.49 1.24.39a.364.364 0 0 0 .21-.334c0-.15-.2-.315-.377-.315-.287 0-.496-.116-1.06-.598-.717-.615-1.028-.776-1.592-.824-.554-.051-1.04.154-1.792.756-.72.577-1.05.714-1.51.632-.189-.034-.599-.195-.568-.222.007-.007.202-.106.438-.226.854-.427 2.177-1.176 2.734-1.548.728-.486 2.188-1.583 2.273-1.71.069-.095.062-.293-.01-.386-.068-.092-.208-.133-.417-.12zm-.957.75c0 .03-.937.7-1.354.974-.786.512-2.546 1.466-3.13 1.698l-.192.079-.236-.181c-.63-.486-1.316-.62-1.962-.386-.315.112-.585.287-1.108.714-.225.185-.51.383-.632.44-.198.093-.257.107-.53.107-.455 0-.632-.092-1.45-.76-.716-.583-1.308-.737-1.967-.515-.277.096-.527.25-1.094.677-.263.198-.578.407-.7.46-.206.097-.254.104-.6.104-.361 0-.385-.003-.638-.127-.335-.157-.49-.263-1.002-.68-.742-.595-1.05-.745-1.45-.697l-.194.024-.191-.356c-.103-.195-.178-.362-.168-.372.02-.024.824-.082 2.704-.202l2.94-.188c1.025-.065 2.454-.157 3.178-.205.724-.045 1.685-.11 2.136-.137.451-.03 1.535-.1 2.41-.154l4.632-.304c.588-.041.598-.041.598-.014zM9.842 4.484c-.117.061-.165.147-.165.294 0 .154.038.198.35.41.88.605 2.1 1.736 2.736 2.54 1.432 1.801 2.943 4.874 3.822 7.776.095.308.198.592.23.626.101.116.2.13.491.075a6.03 6.03 0 0 1 .605-.072c.403-.024.728.055 1.453.342.612.246.76.246.858.007.058-.14.044-.202-.226-.892-.817-2.106-1.897-4.123-2.984-5.572a17.102 17.102 0 0 0-.67-.837c-.01-.01-.103-.11-.202-.223-1.962-2.16-3.9-3.736-5.3-4.307-.233-.092-.722-.222-.838-.222a.438.438 0 0 0-.16.055Zm3.595 2.728c.51.44 1.972 1.907 2.406 2.413 1.077 1.254 2.136 2.987 2.984 4.888.24.537.49 1.145.49 1.193 0 .017-.165-.024-.367-.092-.355-.12-.39-.123-.865-.123a7.457 7.457 0 0 0-.646.013l-.15.014-.178-.56c-.73-2.315-1.856-4.728-3.083-6.615a18.65 18.65 0 0 0-.43-.632c-.21-.274-.756-.93-.842-1.005-.037-.038-.072-.079-.072-.096 0-.038.188.113.752.602zM3.422 2.1c-.154.157-.137.256.113.72 1.1 2.017 1.835 4.13 2.058 5.917.06.492.068 1.637.017 2.25-.202 2.354-1.015 4.5-2.195 5.807-.188.205-.222.31-.164.458.11.263.31.267.718.017 1.125-.697 2.714-1.278 4.17-1.528.417-.072.568-.08 1.573-.082 1.158 0 1.336.017 2.323.19.848.15 1.856.432 2.601.719.253.096.5.18.547.192.127.024.287-.07.34-.195.057-.14-.015-.61-.213-1.381-.63-2.478-2.065-5.182-3.938-7.418C9.522 5.562 7.045 3.62 4.42 2.322c-.707-.35-.84-.38-.998-.222Zm1.484 1.223a22.656 22.656 0 0 1 3.302 2.25c2.87 2.357 5.1 5.553 6.21 8.899.167.51.386 1.389.345 1.406a2.17 2.17 0 0 1-.328-.093 15.943 15.943 0 0 0-3.22-.731c-.864-.106-2.19-.106-2.942 0a12.04 12.04 0 0 0-3.056.844c-.205.09-.397.168-.424.18-.034.015-.028-.016.024-.098.112-.188.465-.91.598-1.23.684-1.658 1.039-4.003.875-5.774-.15-1.63-.8-3.76-1.692-5.544a4.26 4.26 0 0 1-.15-.318c0-.034.05-.01.458.21z" />
      </svg>
    ),
  },
  {
    label: 'Contact for resume',
    href: 'mailto:joe@joeburns.ai?subject=Resume%20request',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="14" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
      </svg>
    ),
  },
]

const SKILL_GROUPS = [
  {
    title: 'Safeguards & Risk Detection',
    skills: ['Abuse detection', 'Behavioral fingerprinting', 'Entity resolution', 'Graph-based account clustering', 'Risk scoring', 'Payment signal analysis'],
  },
  {
    title: 'Investigation & Threat Analysis',
    skills: ['Adversarial investigations', 'OSINT', 'Network attribution', 'Vendor signal evaluation', 'Cross-language pattern recognition'],
  },
  {
    title: 'Data & Tooling',
    skills: ['SQL', 'Python (pandas)', 'JavaScript', 'Vue', 'React', 'Tailwind', 'Browser automation', 'DOM instrumentation', 'Claude Code', 'Cursor'],
  },
  {
    title: 'Systems & Operations',
    skills: ['Detection frameworks', 'Enforcement strategy', 'Policy-to-product translation', 'Pre-launch abuse risk assessment'],
  },
]

const EXPERIENCE_BULLETS = [
  'Built safeguards and enforcement capability from zero with a small team in a data-constrained environment with no formal mandate',
  'Reduced avg detection time for coordinated misuse from none → ~30 days (manual) → under 2 hours through behavioral analysis and custom investigative dashboard and tooling',
  'Led disruption of third-party automation and reseller ecosystems responsible for hundreds of thousands of abusive accounts',
  'Developed behavioral detection using payment signals, usage patterns, timing correlations, and prompt behavior',
  'Performed graph-based account clustering and entity resolution across fragmented systems without dedicated graph infrastructure',
  'Conducted adversarial investigations including OSINT and proactive threat actor research',
  'Prepared legal briefs supporting enforcement action resulting in arbitration wins',
  'Contributed to abuse risk assessment for every platform launch since v4, including adversarial red-teaming prior to release',
]

/* ===== Helpers ===== */

function SectionTitle({ text }: { text: string }) {
  return (
    <DecryptedText
      text={text}
      animateOn="inViewHover"
      speed={55}
      sequential
      revealDirection="start"
      className="section-title-char"
      encryptedClassName="section-title-char-encrypted"
      parentClassName="section-title"
    />
  )
}

/* ===== App ===== */

export default function App() {
  const [showContent, setShowContent] = useState(false)
  const { effectiveTheme } = useTheme()

  const grainientThemeProps = useMemo(
    () =>
      effectiveTheme === 'light'
        ? {
            color1: '#f4ede0',
            color2: '#d5e8df',
            color3: '#aed6c5',
            grainAmount: 0.06,
            contrast: 0.52,
            saturation: 1.08,
          }
        : {
            color1: '#000000',
            color2: '#16001f',
            color3: '#33002f',
            grainAmount: 0.1,
            contrast: 0.7,
            saturation: 1.45,
          },
    [effectiveTheme]
  )

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <ThemeToggle />

      {/* Background */}
      <div className="background">
        <Grainient
          {...grainientThemeProps}
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
          grainScale={2}
          grainAnimated={false}
          gamma={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
        <GraphBackdrop theme={effectiveTheme} />
      </div>

      {/* Hero */}
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

            <p className="tagline">Trust &amp; Safety · Platform Safeguards · Abuse Infrastructure Disruption · Investigative Tooling</p>

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

            {/* Scroll hint */}
            <div className="scroll-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </>
        )}
      </main>

      {/* Sections */}
      <div className="sections-container">

        {/* About */}
        <section className="section" id="about">
          <AnimatedContent distance={60} duration={0.7} threshold={0.2}>
            <SectionTitle text="ABOUT" />
            <p className="about-text">
              Safeguards specialist focused on detecting, investigating, and mitigating
              coordinated misuse across large-scale AI systems. Experienced linking
              accounts across disparate systems, identifying adversarial behavior patterns,
              and converting emerging threats into mitigation strategies across product,
              policy, and enforcement.
            </p>
          </AnimatedContent>
        </section>

        <div className="section-divider" />

        {/* Skills */}
        <section className="section" id="skills">
          <AnimatedContent distance={60} duration={0.7} threshold={0.15}>
            <SectionTitle text="CORE COMPETENCIES" />
            <div className="skills-grid">
              {SKILL_GROUPS.map(group => (
                <SpotlightCard key={group.title}>
                  <h3 className="skill-group-title">{group.title}</h3>
                  <div className="skill-tags">
                    {group.skills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </AnimatedContent>
        </section>

        <div className="section-divider" />

        {/* Currently working on */}
        <section className="section" id="current-work">
          <AnimatedContent distance={60} duration={0.7} threshold={0.15}>
            <SectionTitle text="CURRENTLY WORKING ON" />
            <p className="about-text">
              Architecting a greenfield desktop application that automates an end-to-end abuse-enforcement workflow: ingesting moderation signals from platform APIs into a local datastore, surfacing coordinated behavior through a pattern engine and classifier, and routing verdicts into automated enforcement and human review queues. Designed to eliminate repetitive triage while keeping analysts in the loop on every action.
            </p>
            <p className="about-text">
              Building a graph-based detection system using real abuse network data from coordinated misuse operations. Applying recent research in graph neural networks and anomaly detection to identify behavioral patterns across fragmented account clusters.
            </p>
            <p className="about-text">
              Leveraging curated research repositories and{' '}
              <a
                href="https://github.com/jeffpierce/memory-palace"
                target="_blank"
                rel="noopener noreferrer"
              >
                local knowledge graph systems
              </a>{' '}
              to rapidly reference{' '}
              <a
                href="https://github.com/safe-graph/graph-fraud-detection-papers"
                target="_blank"
                rel="noopener noreferrer"
              >
                200+ papers
              </a>{' '}
              on GNN-based fraud detection during development.
            </p>
            <p className="about-text">
              Studying ML techniques for abuse detection to close the gap between traditional rule-based systems and adversarial-aware approaches that scale with platform growth.
            </p>
          </AnimatedContent>
        </section>

        <div className="section-divider" />

        {/* Experience */}
        <section className="section" id="experience">
          <AnimatedContent distance={60} duration={0.7} threshold={0.1}>
            <SectionTitle text="EXPERIENCE" />
            <SpotlightCard>
              <div className="exp-header">
                <span className="exp-company">Midjourney</span>
                <span className="exp-period">Feb 2023 &ndash; Present</span>
              </div>
              <p className="exp-role">Platform Protection & Safeguards &mdash; Built from Zero</p>
              <ul className="exp-bullets">
                {EXPERIENCE_BULLETS.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </SpotlightCard>
          </AnimatedContent>
        </section>

        <div className="section-divider" />

        {/* Education */}
        <section className="section" id="education">
          <AnimatedContent distance={60} duration={0.7} threshold={0.2}>
            <SectionTitle text="EDUCATION" />

            <div className="edu-entry">
              <p className="edu-school">Georgia State University, Robinson College of Business</p>
              <p className="edu-degree">B.B.A., Finance &middot; Additional coursework in Computer Science, SQL, and databases</p>
            </div>

            <div className="edu-entry">
              <p className="edu-school">University of Central Florida</p>
              <p className="edu-degree">A.A., Marketing & Business Management</p>
            </div>
          </AnimatedContent>
        </section>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="section-divider" style={{ marginBottom: '2rem' }} />
        <nav className="footer-links" aria-label="Footer links">
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
        <p className="footer-copy">&copy; {new Date().getFullYear()} Joe Burns</p>
      </footer>
    </div>
  )
}
