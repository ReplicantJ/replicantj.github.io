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
  metricsLabel?: string
  metrics: StudyMetric[]
  sections: StudySection[]
  figure?: 'cluster' | 'pipeline' | 'benchmark' | 'stack'
  figureCaption?: string
}

export const STUDIES: Study[] = [
  {
    slug: 'reseller-disruption',
    plate: '01',
    title: 'Reseller Ecosystem Disruption',
    status: 'CASE STUDY',
    abstract:
      'Disruption of third-party automation and reseller ecosystems behind hundreds of thousands of abusive accounts: behavioral fingerprinting, payment-signal analysis, and graph-based account clustering across fragmented identity systems, carried through to legal enforcement.',
    metrics: [
      { value: '100,000s', label: 'ABUSIVE ACCOUNTS IN SCOPE' },
      { value: '<2 HRS', label: 'COORDINATED-NETWORK DETECTION' },
      { value: 'ATTRIBUTED', label: 'INFRASTRUCTURE TO REAL-WORLD OPERATORS' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Problem',
        paragraphs: [
          'Third-party automation and reseller operations industrialized platform abuse: coordinated account farms created and resold access at scale, hiding behind fragmented identity signals spread across billing, usage, and authentication systems. No detection capability existed. Coordinated abuse surfaced only when damage was already visible.',
        ],
      },
      {
        label: 'II',
        heading: 'Approach',
        paragraphs: [
          'Built behavioral detection in a data-constrained environment: payment signals, usage patterns, timing correlations, and prompt behavior combined into behavioral fingerprints that survive surface-level evasion.',
          'Performed graph-based account clustering and entity resolution across fragmented systems, without dedicated graph infrastructure, to resolve farms, resellers, and their customers into navigable networks. Adversarial investigation, including OSINT and proactive threat-actor research, attributed infrastructure to real operators and informed enforcement strategy.',
        ],
      },
      {
        label: 'III',
        heading: 'Outcome',
        paragraphs: [
          'Average detection time for coordinated abuse fell from none, to roughly 30 days of manual work, to under two hours through custom investigative tooling. Sustained enforcement disrupted ecosystems responsible for hundreds of thousands of abusive accounts, adversarial investigation attributed operating infrastructure to real-world entities, and evidence packets built from those investigations supported outside counsel on enforcement matters.',
        ],
      },
    ],
    figure: 'cluster',
    figureCaption: 'FIG. 01 · ACCOUNT CLUSTER TOPOLOGY · SYNTHETIC RENDERING',
  },
  {
    slug: 'abuse-investigation-platform',
    plate: '02',
    title: 'Abuse Investigation Platform',
    status: 'SHIPPED · IN PRODUCTION USE',
    abstract:
      'A solo-authored suite of analyst tools sharing one detector core across every surface: a rule engine, behavioral time-series scoring, and graph-based clustering that turn scattered signals into ranked, human-reviewed leads.',
    metrics: [
      { value: '8', label: 'INTEGRATED ANALYST MODULES' },
      { value: '12', label: 'BEHAVIORAL DETECTION KERNELS' },
      { value: '60K+', label: 'REGRESSION CHECKS ON CORE MATH' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Problem',
        paragraphs: [
          'Coordinated adversarial behavior surfaced only after damage was visible, because no shared system existed to detect it. Analysts correlated signals by hand across disconnected surfaces, and every investigation rebuilt the same pattern-matching logic from memory instead of a tested, shared system.',
        ],
      },
      {
        label: 'II',
        heading: 'Approach',
        paragraphs: [
          'Designed and built the investigative tooling layer solo, anchored on one detector core so every surface reasons from the same math: a rule engine flags known-bad configurations, sliding-window behavioral scoring surfaces coordinated timing across accounts, and graph-based similarity (cosine, Jaccard, k-core cohesion) clusters fragmented identities into ranked candidate networks.',
          'Every surface, from a lightweight analyst tool to a coordinated command-line pipeline, calls the same core rather than reimplementing its own logic, and every output lands with a human reviewer. The system proposes; it does not enforce.',
        ],
      },
      {
        label: 'III',
        heading: 'Outcome',
        paragraphs: [
          'The detector core now runs the daily investigative workflow in production, checked against more than 60,000 regression tests on its own math, and is the tooling layer behind the detection-time result on Plate 01: coordinated-network detection cut from roughly 30 days of manual correlation to under two hours.',
        ],
      },
    ],
    figure: 'stack',
    figureCaption: 'FIG. 02 · SHARED DETECTOR CORE · ONE SOURCE OF TRUTH ACROSS SURFACES',
  },
  {
    slug: 'gnn-detection',
    plate: '03',
    title: 'Graph-Based Detection Research',
    status: 'RESEARCH · IN PROGRESS',
    abstract:
      'Benchmarking graph-neural-network detection models against production-shaped abuse topologies to test whether structure-aware approaches outperform rule-based detection as adversaries adapt.',
    metrics: [
      { value: '200+ → 3', label: 'PAPERS NARROWED TO CANDIDATES' },
      { value: 'UNDER TEST', label: 'SLICENDICE · BWGNN · TGN' },
      { value: 'PROD-SHAPED', label: 'SYNTHETIC TOPOLOGIES' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Question',
        paragraphs: [
          'Rule-based detection degrades as adversaries adapt; every rule teaches the next evasion. Can graph-neural-network approaches, which read structure instead of surface features, hold up against real-world coordinated-abuse topologies at platform scale?',
        ],
      },
      {
        label: 'II',
        heading: 'Method',
        paragraphs: [
          'SliceNDice, BWGNN, and TGN are benchmarked against production-shaped synthetic topologies modeled on coordinated-abuse structures observed in the field. A research base of 200+ papers on graph-based fraud detection, indexed in a local knowledge-graph system, was narrowed to this candidate shortlist by match against real abuse graph shapes.',
        ],
      },
      {
        label: 'III',
        heading: 'Status',
        paragraphs: [
          'Benchmarking in progress. Results land on this plate as they harden; the figure below is a placeholder for the comparison.',
        ],
      },
    ],
    figure: 'benchmark',
    figureCaption: 'FIG. 03 · MODEL COMPARISON · PLACEHOLDER, RESULTS PENDING',
  },
  {
    slug: 'enforcement-app',
    plate: '04',
    title: 'Enforcement Workflow Application',
    status: 'IN DEVELOPMENT · BLUEPRINT',
    abstract:
      'A next-generation desktop application extending the shared detector core (Plate 02) end to end: moderation-signal ingestion, a pattern engine surfacing coordinated behavior, and verdict routing into automated enforcement with a human decision on every consequential action.',
    metricsLabel: 'SPECIFICATIONS',
    metrics: [
      { value: 'E2E', label: 'SIGNAL → VERDICT → ACTION' },
      { value: 'LOCAL', label: 'ANALYST-OWNED DATASTORE' },
      { value: 'HITL', label: 'EVERY CONSEQUENTIAL ACTION' },
    ],
    sections: [
      {
        label: 'I',
        heading: 'Intent',
        paragraphs: [
          'Enforcement teams burn analyst hours on repetitive triage: pulling signals from platform surfaces, recognizing the same coordinated patterns, and routing the same verdicts. The application extends the detector core already running in production (Plate 02) into that workflow, removing the repetition while keeping a human decision on every consequential action.',
        ],
      },
      {
        label: 'II',
        heading: 'Architecture',
        paragraphs: [
          'Moderation signals ingest from platform APIs into a local datastore. A pattern engine and classifier surface coordinated behavior and propose verdicts. Verdicts route to automated enforcement only where confidence is absolute and the action is reversible; everything else lands in a human review queue. The analyst owns every consequential decision.',
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
    figureCaption: 'FIG. 04 · ENFORCEMENT PIPELINE · BLUEPRINT SCHEMATIC',
  },
]

export function findStudy(slug: string | undefined): Study | undefined {
  return STUDIES.find(s => s.slug === slug)
}
