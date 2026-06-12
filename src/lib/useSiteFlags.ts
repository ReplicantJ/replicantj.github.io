import { useEffect, useState } from 'react'
import { fetchSiteConfig, type SiteConfig } from './siteConfig'

let cached: SiteConfig | null = null
let pending: Promise<SiteConfig> | null = null

function loadOnce(): Promise<SiteConfig> {
  if (cached) return Promise.resolve(cached)
  if (!pending) {
    pending = fetchSiteConfig().then(cfg => {
      cached = cfg
      return cfg
    })
  }
  return pending
}

/** Runtime feature flags from site-config.json, fetched once per session. */
export function useSiteFlags(): { aboutEnabled: boolean; loaded: boolean } {
  const [state, setState] = useState(() => ({
    aboutEnabled: cached?.aboutEnabled ?? false,
    loaded: cached !== null,
  }))

  useEffect(() => {
    if (cached) return
    let cancelled = false
    loadOnce().then(cfg => {
      if (!cancelled) setState({ aboutEnabled: cfg.aboutEnabled === true, loaded: true })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
