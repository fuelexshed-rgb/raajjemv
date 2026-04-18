/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** Optional: URL to open “Write” / CMS (e.g. http://localhost:5173) */
  readonly VITE_CMS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
