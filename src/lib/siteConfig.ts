import { apiUrl } from './api'

export type SiteConfig = {
  darkModeAllowed: boolean
  /** Dark-launch flag for the personal /about page. Defaults to false (hidden). */
  aboutEnabled: boolean
}

const DEFAULT_CONFIG: SiteConfig = {
  darkModeAllowed: true,
  aboutEnabled: false,
}

function normalizeConfig(raw: unknown): SiteConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_CONFIG
  const o = raw as Record<string, unknown>
  return {
    darkModeAllowed: o.darkModeAllowed !== false,
    aboutEnabled: o.aboutEnabled === true,
  }
}

function staticSiteConfigPath(): string {
  const base = import.meta.env.BASE_URL
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}site-config.json`
}

/** Remote site-config when `VITE_API_BASE_URL` is set; falls back to same-origin static JSON. */
export async function fetchSiteConfig(): Promise<SiteConfig> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
  if (apiBase) {
    try {
      const res = await fetch(apiUrl('/site-config'))
      if (res.ok) {
        const json: unknown = await res.json()
        return normalizeConfig(json)
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const res = await fetch(staticSiteConfigPath())
    if (res.ok) {
      const json: unknown = await res.json()
      return normalizeConfig(json)
    }
  } catch {
    /* fall through */
  }

  return DEFAULT_CONFIG
}
