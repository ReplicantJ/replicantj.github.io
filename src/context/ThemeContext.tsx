import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchSiteConfig } from '../lib/siteConfig'

export type ThemeName = 'dark' | 'light'

const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  theme: ThemeName
  /** Resolved appearance on the page */
  effectiveTheme: ThemeName
  darkModeAllowed: boolean
  configLoaded: boolean
  setTheme: (t: ThemeName) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemTheme(): ThemeName {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  ) {
    return 'light'
  }
  return 'dark'
}

function readStoredTheme(): ThemeName {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return systemTheme()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [configLoaded, setConfigLoaded] = useState(false)
  const [darkModeAllowed, setDarkModeAllowed] = useState(true)
  const [preference, setPreference] = useState<ThemeName>(() =>
    typeof window !== 'undefined' ? readStoredTheme() : 'light'
  )

  useEffect(() => {
    let cancelled = false
    fetchSiteConfig().then(cfg => {
      if (cancelled) return
      setDarkModeAllowed(cfg.darkModeAllowed !== false)
      setConfigLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const effectiveTheme: ThemeName = useMemo(() => {
    if (!darkModeAllowed) return 'light'
    return preference
  }, [darkModeAllowed, preference])

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme
  }, [effectiveTheme])

  useEffect(() => {
    if (!darkModeAllowed) return
    try {
      localStorage.setItem(STORAGE_KEY, preference)
    } catch {
      /* ignore */
    }
  }, [preference, darkModeAllowed])

  const setTheme = useCallback(
    (t: ThemeName) => {
      if (!darkModeAllowed) return
      setPreference(t)
    },
    [darkModeAllowed]
  )

  const toggleTheme = useCallback(() => {
    if (!darkModeAllowed) return
    setPreference(p => (p === 'dark' ? 'light' : 'dark'))
  }, [darkModeAllowed])

  const value = useMemo(
    (): ThemeContextValue => ({
      theme: preference,
      effectiveTheme,
      darkModeAllowed,
      configLoaded,
      setTheme,
      toggleTheme,
    }),
    [
      preference,
      effectiveTheme,
      darkModeAllowed,
      configLoaded,
      setTheme,
      toggleTheme,
    ]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
