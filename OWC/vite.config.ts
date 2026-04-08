import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['iife'],
      fileName: () => 'components.js',
      name: 'OWC',
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
