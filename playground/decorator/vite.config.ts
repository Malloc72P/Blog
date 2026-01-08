import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import type { MinifyOptions } from 'terser';
import { pageLinkGenerator } from './devops/page-link-generator';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      entryRoot: 'src',
      outDir: 'dist',
      rollupTypes: true,
      include: ['src/**/*.ts'],
    }),
    pageLinkGenerator(),
  ],
  server: {
    port: 5000,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'Expression',
      fileName: 'expression',
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'expression-style.css';
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
