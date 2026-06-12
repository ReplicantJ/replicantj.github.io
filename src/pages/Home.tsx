import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Constellation from '../components/Constellation/Constellation'
import SplitFlapText from '../components/TextAnimations/SplitFlapText/SplitFlapText'
import AnimatedContent from '../components/Animations/AnimatedContent/AnimatedContent'
import { Plate } from '../components/Atelier/Atelier'
import { SOCIAL_LINKS } from '../lib/socialLinks'
import { STUDIES } from '../lib/studies'
import './Home.css'

/* ===== Content ===== */

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

/* ===== Local pieces ===== */

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="sec-head">
      <span className="sec-num" aria-hidden="true">
        {num}
      </span>
      <SplitFlapText text={title} animateOn="inViewHover" parentClassName="sec-title" />
    </div>
  )
}

function HeroName({ text }: { text: string }) {
  return (
    <h1 className="hero-name" aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="hero-name__ch"
          style={{ animationDelay: `${0.15 + i * 0.055}s` }}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </h1>
  )
}

/* ===== Page ===== */

export default function Home() {
  useEffect(() => {
    document.title = 'Joe Burns — Trust & Safety · Safeguards · Abuse Infrastructure Disruption'
  }, [])

  return (
    <div className="home">
      {/* Hero */}
      <header className="home-hero">
        <Constellation />
        <div className="hero-content">
          <p className="hero-eyebrow">TRUST &amp; SAFETY · PLATFORM SAFEGUARDS</p>
          <HeroName text="Joe Burns" />
          <p className="hero-tagline">
            ABUSE INFRASTRUCTURE DISRUPTION · INVESTIGATIVE TOOLING
          </p>
          <hr className="hero-rule" />
          <nav className="hero-socials" aria-label="Social links">
            {SOCIAL_LINKS.map(({ label, href, icon }) => {
              const external = href.startsWith('http')
              return (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="hero-social"
                  aria-label={label}
                  title={label}
                >
                  {icon}
                  <span>{label.toUpperCase()}</span>
                </a>
              )
            })}
          </nav>
        </div>
        <div className="hero-scroll" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* 01 · About */}
      <section className="home-section" id="about">
        <AnimatedContent distance={50} duration={0.7} threshold={0.2}>
          <SectionHead num="01" title="ABOUT" />
          <div className="sec-body">
            <p className="lede">
              Safeguards specialist focused on detecting, investigating, and mitigating
              coordinated misuse across large-scale AI systems. Experienced linking accounts
              across disparate systems, identifying adversarial behavior patterns, and
              converting emerging threats into mitigation strategies across product, policy,
              and enforcement.
            </p>
          </div>
        </AnimatedContent>
      </section>

      {/* 02 · The stat */}
      <section className="home-section" id="detection-time">
        <AnimatedContent distance={50} duration={0.7} threshold={0.2}>
          <SectionHead num="02" title="DETECTION TIME" />
          <div className="sec-body">
            <Plate surface>
              <div className="stat">
                <p className="stat-eyebrow">AVG DETECTION TIME · COORDINATED MISUSE</p>
                <p className="stat-line">
                  <span className="stat-was">30 DAYS</span>
                  <span className="stat-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="stat-now">UNDER 2 HRS</span>
                </p>
                <p className="stat-foot">BEHAVIORAL ANALYSIS + CUSTOM INVESTIGATIVE TOOLING · BUILT FROM ZERO</p>
              </div>
            </Plate>
          </div>
        </AnimatedContent>
      </section>

      {/* 03 · Capabilities */}
      <section className="home-section" id="skills">
        <AnimatedContent distance={50} duration={0.7} threshold={0.15}>
          <SectionHead num="03" title="CAPABILITIES" />
          <div className="sec-body">
            <div className="cap-grid">
              {SKILL_GROUPS.map(group => (
                <Plate key={group.title}>
                  <h3 className="cap-title">{group.title}</h3>
                  <div className="cap-tags">
                    {group.skills.map(skill => (
                      <span key={skill} className="cap-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Plate>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* 04 · Featured work */}
      <section className="home-section" id="work">
        <AnimatedContent distance={50} duration={0.7} threshold={0.15}>
          <SectionHead num="04" title="FEATURED WORK" />
          <div className="sec-body">
            <div className="study-list">
              {STUDIES.map(study => (
                <Link to={`/work/${study.slug}`} className="study-card" key={study.slug}>
                  <span className="study-plate" aria-hidden="true">
                    {study.plate}
                  </span>
                  <span className="study-main">
                    <span className="study-title">{study.title}</span>
                    <span className="study-abstract">{study.abstract}</span>
                    <span className="study-status">{study.status}</span>
                  </span>
                  <span className="study-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* 05 · Experience */}
      <section className="home-section" id="experience">
        <AnimatedContent distance={50} duration={0.7} threshold={0.1}>
          <SectionHead num="05" title="EXPERIENCE" />
          <div className="sec-body">
            <Plate>
              <div className="exp-head">
                <span className="exp-company">Midjourney</span>
                <span className="exp-period">FEB 2023 — PRESENT</span>
              </div>
              <p className="exp-role">Platform Protection &amp; Safeguards — Built from Zero</p>
              <ul className="exp-bullets">
                {EXPERIENCE_BULLETS.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </Plate>
          </div>
        </AnimatedContent>
      </section>

      {/* 06 · Now */}
      <section className="home-section" id="now">
        <AnimatedContent distance={50} duration={0.7} threshold={0.2}>
          <SectionHead num="06" title="NOW" />
          <div className="sec-body">
            <p className="body-text">
              Building the enforcement application and detection research above — see plates
              02 and 03. Leveraging curated research repositories and{' '}
              <a href="https://github.com/jeffpierce/memory-palace" target="_blank" rel="noopener noreferrer">
                local knowledge graph systems
              </a>{' '}
              to rapidly reference{' '}
              <a href="https://github.com/safe-graph/graph-fraud-detection-papers" target="_blank" rel="noopener noreferrer">
                200+ papers
              </a>{' '}
              on GNN-based fraud detection during development.
            </p>
            <p className="body-text">
              Studying ML techniques for abuse detection to close the gap between traditional
              rule-based systems and adversarial-aware approaches that scale with platform
              growth.
            </p>
          </div>
        </AnimatedContent>
      </section>

      {/* 07 · Education */}
      <section className="home-section" id="education">
        <AnimatedContent distance={50} duration={0.7} threshold={0.2}>
          <SectionHead num="07" title="EDUCATION" />
          <div className="sec-body">
            <div className="edu-entry">
              <p className="edu-school">Georgia State University, Robinson College of Business</p>
              <p className="edu-degree">B.B.A., Finance · Additional coursework in Computer Science, SQL, and databases</p>
            </div>
            <div className="edu-entry">
              <p className="edu-school">University of Central Florida</p>
              <p className="edu-degree">A.A., Marketing &amp; Business Management</p>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  )
}
