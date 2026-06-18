import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Constellation from '../components/Constellation/Constellation'
import SplitFlapText from '../components/TextAnimations/SplitFlapText/SplitFlapText'
import AnimatedContent from '../components/Animations/AnimatedContent/AnimatedContent'
import { Plate, Rule, Sailboat } from '../components/Atelier/Atelier'
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
    skills: ['Adversarial investigations', 'OSINT', 'Network attribution', 'Threat actor attribution', 'Vendor signal evaluation', 'Workflow automation'],
  },
  {
    title: 'Software Engineering',
    skills: ['Python (pandas)', 'SQL', 'SQLite', 'TypeScript', 'JavaScript', 'Node.js', 'Electron', 'React', 'Vue', 'Tailwind', 'Data pipelines', 'Agentic engineering', 'Claude Code', 'Cursor'],
  },
  {
    title: 'Systems & Operations',
    skills: ['Detection frameworks', 'Enforcement & disruption strategy', 'Abuse economics modeling', 'Policy-to-product translation', 'Pre-launch abuse risk assessment', 'Cross-functional communication (Engineering, Legal, Executive)'],
  },
]

const EXPERIENCE_BULLETS = [
  'Co-built safeguards and enforcement capability from nothing with a partner analyst: no formal mandate, data-constrained environment, function now embedded across product, policy, and legal.',
  'Reduced average detection time for coordinated abuse networks from none, to roughly 30 days of manual work, to under 2 hours through behavioral analysis and custom investigative tooling.',
  'Led disruption of third-party automation and reseller ecosystems responsible for hundreds of thousands of abusive accounts across three years of enforcement.',
  'Designed behavioral detection combining payment signals, usage patterns, timing correlations, and prompt behavior; resolved fragmented identities into navigable networks via graph-based clustering without dedicated graph infrastructure.',
  'Conducted adversarial investigations including OSINT attribution and proactive threat-actor research that informed enforcement and legal strategy.',
  'Built evidence packets and investigation reports supporting outside counsel on enforcement matters.',
  'Contributed to pre-launch abuse risk assessment and adversarial red-teaming for major model releases.',
]

/* ===== Local pieces ===== */

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="sec-head">
      <span className="sec-num" aria-hidden="true">
        {num}
      </span>
      <h2 className="sec-heading" aria-label={title}>
        <SplitFlapText text={title} animateOn="inViewHover" parentClassName="sec-title" />
      </h2>
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
    document.title = 'Joe Burns · Trust & Safety · Safeguards · Abuse Infrastructure Disruption'
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
            ABUSE INFRASTRUCTURE DISRUPTION · DETECTION ENGINEERING
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
            <Plate className="about-plate">
              <p className="about-headline">
                Safeguards specialist who builds detection capability,{' '}
                <br className="about-headline__break" />
                not just runs it
              </p>
              <p className="body-text about-body">
                At Midjourney I co-built the platform protection function from zero:
                behavioral detection that finds coordinated networks in hours instead
                of weeks, graph attribution across fragmented identities, and
                enforcement strategy that turns findings into action across product,
                policy, and legal.
              </p>
              <Rule className="about-rule" />
              <p className="body-text about-note">
                Enforcement at this scale is a precision discipline. A false positive is
                a real person locked out, so I build these systems to be{' '}
                <strong className="about-note__em">sure</strong> before they are fast.
              </p>
            </Plate>
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
                <p className="stat-eyebrow">AVG DETECTION TIME · COORDINATED ABUSE NETWORKS · 2023 TO 2026</p>
                <p className="stat-line stat-line--arc">
                  <span className="stat-zero">NOTHING</span>
                  <span className="stat-step">
                    <span className="stat-arrow" aria-hidden="true">
                      →
                    </span>{' '}
                    30 DAYS
                  </span>
                  <span className="stat-step stat-now">
                    <span className="stat-arrow" aria-hidden="true">
                      →
                    </span>{' '}
                    UNDER 2 HOURS
                  </span>
                </p>
                <p className="stat-foot">BEHAVIORAL ANALYSIS + CUSTOM INVESTIGATIVE TOOLING · BUILT FROM ZERO · NETWORKS NOW IDENTIFIED BEFORE THEIR FIRST BILLING CYCLE COMPLETES</p>
              </div>
            </Plate>
          </div>
        </AnimatedContent>
      </section>

      {/* 03 · Featured work */}
      <section className="home-section" id="work">
        <AnimatedContent distance={50} duration={0.7} threshold={0.15}>
          <SectionHead num="03" title="FEATURED WORK" />
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

      {/* 04 · Capabilities */}
      <section className="home-section" id="skills">
        <AnimatedContent distance={50} duration={0.7} threshold={0.15}>
          <SectionHead num="04" title="CAPABILITIES" />
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

      {/* 05 · Experience */}
      <section className="home-section" id="experience">
        <AnimatedContent distance={50} duration={0.7} threshold={0.1}>
          <SectionHead num="05" title="EXPERIENCE" />
          <div className="sec-body">
            <Plate>
              <div className="exp-head">
                <span className="exp-company">
                  Midjourney
                  <Sailboat className="exp-boat" />
                </span>
                <span className="exp-period">FEB 2023 TO PRESENT</span>
              </div>
              <p className="exp-role">Platform Protection &amp; Safeguards</p>
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
              Two projects run in parallel. An{' '}
              <Link to="/work/enforcement-app">enforcement workflow application</Link> (Plate
              02) is in active development: signal ingestion, pattern detection, and verdict
              routing with a human decision on every consequential action. A{' '}
              <Link to="/work/gnn-detection">graph-detection research program</Link> (Plate
              03) benchmarks structure-aware models against coordinated-abuse topologies,
              backed by a knowledge-graph index of{' '}
              <a href="https://github.com/safe-graph/graph-fraud-detection-papers" target="_blank" rel="noopener noreferrer">
                200+ papers
              </a>{' '}
              narrowed to a candidate shortlist.
            </p>
            <p className="body-text">
              The open question driving both: whether structure-aware detection holds as
              adversaries adapt, or whether rule-based systems degrade faster than they can
              be maintained.
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
          </div>
        </AnimatedContent>
      </section>
    </div>
  )
}
