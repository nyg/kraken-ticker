import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/kraken-ticker/',
  plugins: [react(), tailwindcss()],
  server: { port: 0 },
  preview: { port: 0 },
})
