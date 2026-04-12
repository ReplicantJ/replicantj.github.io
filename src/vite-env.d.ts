/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_BASE_PATH: string
  /** Numeric Discord user ID (snowflake). Usernames do not work in /users/ URLs. */
  readonly VITE_DISCORD_USER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
