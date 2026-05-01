import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Expose VITE_* env vars to the client bundle.
  // VITE_API_URL must be set in the Railway environment (or a local .env file)
  // to the backend origin, e.g.:
  //   VITE_API_URL=https://truckmanagementsystem-production.up.railway.app
  envPrefix: 'VITE_',
})
