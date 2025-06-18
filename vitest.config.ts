import { defineConfig } from 'vitest/config'
import { sharedConfig } from './vite-shared.config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.ts'],
    exclude: ['**/*.bench.ts'],
    benchmark: {
      exclude: ['**/*.test.ts'],
      include: ['**/*.bench.ts'],
      reporters: ['verbose'],
    },
  },
  ...sharedConfig,
})
