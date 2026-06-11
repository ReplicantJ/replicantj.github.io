export type Study = {
  slug: string
  plate: string
  title: string
  status: string
  abstract: string
}

export const STUDIES: Study[] = [
  {
    slug: 'reseller-disruption',
    plate: '01',
    title: 'Reseller Ecosystem Disruption',
    status: 'CASE STUDY · IN PREPARATION',
    abstract:
      'Disruption of third-party automation and reseller ecosystems responsible for hundreds of thousands of abusive accounts — behavioral fingerprinting, payment-signal analysis, and graph-based account clustering across fragmented systems.',
  },
  {
    slug: 'enforcement-app',
    plate: '02',
    title: 'Enforcement Workflow Application',
    status: 'IN DEVELOPMENT · BLUEPRINT',
    abstract:
      'Greenfield desktop application automating an end-to-end abuse-enforcement workflow: moderation-signal ingestion, a pattern engine surfacing coordinated behavior, and verdict routing into automated enforcement with analysts in the loop on every action.',
  },
  {
    slug: 'gnn-detection',
    plate: '03',
    title: 'Graph-Based Detection Research',
    status: 'RESEARCH · IN PROGRESS',
    abstract:
      'Benchmarking graph-neural-network detection models — SliceNDice, BWGNN, TGN — against real abuse-network data to close the gap between rule-based systems and adversarial-aware approaches that scale.',
  },
]

export function findStudy(slug: string | undefined): Study | undefined {
  return STUDIES.find(s => s.slug === slug)
}
