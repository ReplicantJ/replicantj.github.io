/** Base URL for a future API (no trailing slash). Empty string = same-origin / relative paths only. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
