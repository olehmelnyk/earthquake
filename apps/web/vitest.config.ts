import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    css: true,
    snapshotFormat: {
      printBasicPrototype: false,
      escapeString: false
    }
  },
  resolve: {
    alias: {
      '@earthquake/types': resolve(__dirname, '../../packages/types/src/index.ts'),
      '@earthquake/ui': resolve(__dirname, '../../packages/ui/src/index.ts')
    }
  }
});