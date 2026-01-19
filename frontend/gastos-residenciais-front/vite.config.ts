import { defineConfig, mergeConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { ViteUserConfigExport } from 'vitest/config'

const viteConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7108',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

const vitestConfig: ViteUserConfigExport = {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}

export default mergeConfig(viteConfig, vitestConfig)
