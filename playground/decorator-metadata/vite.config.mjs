// src/02-reflect/with-reflect.ts를 Vite로 번들해 design:type이 남는지 확인한다.
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/vite',
    minify: false,
    lib: {
      entry: 'src/02-reflect/with-reflect.ts',
      formats: ['es'],
      fileName: 'with-reflect',
    },
    rollupOptions: { external: [] },
  },
});
