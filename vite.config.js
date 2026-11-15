import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
   base: '/kraken-ticker/',
   plugins: [react(), tailwindcss()],
   server: { port: 0 },
   preview: { port: 0 },
})
