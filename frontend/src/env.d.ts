/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Backend API origin.
   * Set this in Railway (or a local .env file) to the deployed backend URL.
   * Example: https://truckmanagementsystem-production.up.railway.app
   */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
