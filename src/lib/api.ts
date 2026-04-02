import { API_BASE_URL } from '../config'

/** Join API base with a path for `fetch` when you add a backend. */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (!API_BASE_URL) return p
  return `${API_BASE_URL}${p}`
}
