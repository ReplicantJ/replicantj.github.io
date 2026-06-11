import { useEffect, useMemo, useState } from 'react'
import Grainient from './components/Backgrounds/Grainient/Grainient'
import GraphBackdrop from './components/Backgrounds/GraphBackdrop/GraphBackdrop'
import BlurText from './components/TextAnimations/BlurText/BlurText'
import SplitFlapText from './components/TextAnimations/SplitFlapText/SplitFlapText'
import SpotlightCard from './components/Components/SpotlightCard/SpotlightCard'
import AnimatedContent from './components/Animations/AnimatedContent/AnimatedContent'
import { useTheme } from './context/ThemeContext'
import { SOCIAL_LINKS } from './lib/socialLinks'
import './App.css'

/* ===== Data ===== */


const SKILL_GROUPS = [
  {
    title: 'Safeguards & Risk Detection',
    skills: ['Abuse detection', 'Behavioral fingerprinting', 'Entity resolution', 'Graph-based account clustering', 'Risk scoring', 'Payment signal analysis'],
  },
  {
    title: 'Investigation & Threat Analysis',
    skills: ['Adversarial investigations', 'OSINT', 'Network attribution', 'Vendor signal evaluation', 'Cross-language pattern recognition', 'Workflow automation', 'DOM instrumentation'],
  },
  {
    title: 'Software Engineering',
    skills: ['Python (pandas)', 'SQL', 'SQLite', 'TypeScript', 'JavaScript', 'Node.js', 'Electron', 'React', 'Vue', 'Tailwind', 'Data pipelines', 'Claude Code', 'Cursor'],
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
    <SplitFlapText
      text={text}
      animateOn="inViewHover"
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
              Benchmarking candidate detection models — including SliceNDice, BWGNN, TGN, and others — against real abuse network data to determine the best fit for the detection pipeline.
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
    </div>
  )
}
