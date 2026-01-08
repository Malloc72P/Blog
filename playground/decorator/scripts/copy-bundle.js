import fs from 'fs';
import path from 'path';

// ESM 환경에서 __dirname 대체
const rootDir = process.cwd();

const REGISTRY = process.env.REGISTRY || 'npm';

// src와 dest 지정
const srcDir = path.resolve(rootDir, './dist');
let destDir = path.resolve(rootDir, './publish/.npm/dist');

if (REGISTRY === 'github') {
  destDir = path.resolve(rootDir, './publish/.npm/dist');
}

console.log(srcDir);
fs.cpSync(srcDir, destDir, { recursive: true, force: true });

console.log(`Copied files from ${srcDir} to ${destDir}`);
