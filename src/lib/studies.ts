export type StudySection = {
  label: string
  heading: string
  paragraphs: string[]
}

export type StudyMetric = {
  value: string
  label: string
}

export type Study = {
  slug: string
  plate: string
  title: string
  status: string
  abstract: string
  metrics: StudyMetric[]
  sections: StudySection[]
  figure?: 'cluster' | 'pipeline' | 'benchmark'
  figureCaption?: string
}

export const STUDIES: Study[] = [
  {
    slug: 'reseller-disruption',
    plate: '01',
    title: 'Reseller Ecosystem Disruption',
    status: 'CASE STUDY',
    abstract:
      'Disruption of third-party automation and reseller ecosystems responsible for hundreds of thousands of abusive accounts — behavioral fingerprinting, payment-signal analysis, and graph-based account clustering across fragmented systems.',
    metrics: [
      { value: '100,000s', label: 'ABUSIVE ACCOUNTS IN SCOPE' },
      { value: '<2 HRS', label: 'DETECTION, FROM ~30 DAYS' },
      { value: 'WON', label: 'ARBITRATION OUTCOMES' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Problem',
        paragraphs: [
          'Third-party automation and reseller operations industrialized platform abuse: coordinated account farms created and resold access at scale, hiding behind fragmented identity signals spread across billing, usage, and authentication systems. No detection capability existed — coordinated misuse surfaced only when damage was already visible.',
        ],
      },
      {
        label: 'II',
        heading: 'Approach',
        paragraphs: [
          'Built behavioral detection from zero in a data-constrained environment: payment signals, usage patterns, timing correlations, and prompt behavior combined into behavioral fingerprints that survive surface-level evasion.',
          'Performed graph-based account clustering and entity resolution across fragmented systems — without dedicated graph infrastructure — to resolve farms, resellers, and their customers into navigable networks. Adversarial investigation, including OSINT and proactive threat-actor research, attributed infrastructure and informed enforcement strategy.',
        ],
      },
      {
        label: 'III',
        heading: 'Outcome',
        paragraphs: [
          'Average detection time for coordinated misuse fell from none, to ~30 days of manual work, to under two hours through a custom investigative dashboard and tooling. Enforcement disrupted ecosystems responsible for hundreds of thousands of abusive accounts, and legal briefs prepared from investigation artifacts supported enforcement action resulting in arbitration wins.',
        ],
      },
    ],
    figure: 'cluster',
    figureCaption: 'FIG. 01 · ACCOUNT CLUSTER TOPOLOGY — SYNTHETIC RENDERING, REAL-SHAPED DATA PENDING',
  },
  {
    slug: 'enforcement-app',
    plate: '02',
    title: 'Enforcement Workflow Application',
    status: 'IN DEVELOPMENT · BLUEPRINT',
    abstract:
      'Greenfield desktop application automating an end-to-end abuse-enforcement workflow: moderation-signal ingestion, a pattern engine surfacing coordinated behavior, and verdict routing into automated enforcement with analysts in the loop on every action.',
    metrics: [
      { value: 'E2E', label: 'SIGNAL → VERDICT → ACTION' },
      { value: 'LOCAL', label: 'DATASTORE, ANALYST-OWNED' },
      { value: 'HITL', label: 'HUMAN IN THE LOOP, ALWAYS' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Intent',
        paragraphs: [
          'Enforcement teams burn analyst hours on repetitive triage: pulling signals from platform surfaces, recognizing the same coordinated patterns, and routing the same verdicts. The application removes the repetition while keeping a human decision on every consequential action.',
        ],
      },
      {
        label: 'II',
        heading: 'Architecture',
        paragraphs: [
          'Moderation signals ingest from platform APIs into a local datastore. A pattern engine and classifier surface coordinated behavior and propose verdicts. Verdicts route into automated enforcement for clear-cut cases and human review queues for everything else — the analyst stays in the loop on every action.',
        ],
      },
      {
        label: 'III',
        heading: 'Status',
        paragraphs: [
          'In active development. This plate is drawn as a blueprint deliberately: architecture is settled, implementation is underway, and screenshots will replace schematics as surfaces land.',
        ],
      },
    ],
    figure: 'pipeline',
    figureCaption: 'FIG. 02 · ENFORCEMENT PIPELINE — BLUEPRINT SCHEMATIC',
  },
  {
    slug: 'gnn-detection',
    plate: '03',
    title: 'Graph-Based Detection Research',
    status: 'RESEARCH · IN PROGRESS',
    abstract:
      'Benchmarking graph-neural-network detection models — SliceNDice, BWGNN, TGN — against real abuse-network data to close the gap between rule-based systems and adversarial-aware approaches that scale.',
    metrics: [
      { value: '200+', label: 'PAPERS IN RESEARCH BASE' },
      { value: '3+', label: 'CANDIDATE MODELS UNDER TEST' },
      { value: 'REAL', label: 'ABUSE-NETWORK DATA' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Question',
        paragraphs: [
          'Rule-based detection degrades as adversaries adapt; every rule teaches the next evasion. Can graph-neural-network approaches — which read structure instead of surface features — hold up against real coordinated-abuse topologies at platform scale?',
        ],
      },
      {
        label: 'II',
        heading: 'Method',
        paragraphs: [
          'Candidate models — SliceNDice, BWGNN, TGN, among others — are benchmarked against real abuse-network data drawn from coordinated misuse operations. A curated research base of 200+ papers on GNN-based fraud detection, indexed in a local knowledge-graph system, backs model selection and experiment design.',
        ],
      },
      {
        label: 'III',
        heading: 'Status',
        paragraphs: [
          'Benchmarking in progress. Results land on this plate as they harden — the figure below is a placeholder for the comparison that decides the detection pipeline.',
        ],
      },
    ],
    figure: 'benchmark',
    figureCaption: 'FIG. 03 · MODEL COMPARISON — PLACEHOLDER, RESULTS PENDING',
  },
]

export function findStudy(slug: string | undefined): Study | undefined {
  return STUDIES.find(s => s.slug === slug)
}
