
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.com',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-key',
      NEXT_PUBLIC_APP_MODE: 'demo',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
