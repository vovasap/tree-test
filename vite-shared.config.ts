import { fileURLToPath } from 'node:url'

export const sharedConfig = {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}