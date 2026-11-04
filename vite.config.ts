import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: https://<user>.github.io/<repo>/
  base: '/AlghoritmTrainer_V2/',
})
