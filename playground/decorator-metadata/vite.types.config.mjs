// src/03-types/types.ts를 Vite로 번들해 tsc 결과와 비교한다.
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/vite-types',
    minify: false,
    lib: {
      entry: 'src/03-types/types.ts',
      formats: ['es'],
      fileName: 'types',
    },
  },
});
