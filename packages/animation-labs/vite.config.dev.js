import path from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';
import { commonOption } from './vite.config.common';

const demoPages = buildDemoPageMap(path.resolve(__dirname, 'src/demo'));

console.log('Demo Pages: ', demoPages);

export default defineConfig({
  ...commonOption,
  build: {
    rollupOptions: {
      input: buildDemoPageMap(path.resolve(__dirname, 'src/demo')),
    },
  },
});

function buildDemoPageMap(demoRoot) {
  const files = {};

  buildDemoPageRecursive(demoRoot, files);

  return files;
}

function buildDemoPageRecursive(dirPath, result) {
  const filePaths = fs.readdirSync(dirPath);

  for (const filename of filePaths) {
    const filePath = path.resolve(dirPath, filename);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      buildDemoPageRecursive(filePath, result);
    } else {
      result[filename] = filePath;
    }
  }
}
