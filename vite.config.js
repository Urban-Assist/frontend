import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  server: {
    proxy: {
      '/auth-api': {
        target: import.meta.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  plugins: [react(), tailwindcss()],
})
