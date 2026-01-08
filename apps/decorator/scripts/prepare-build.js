import fs from 'fs';
import path from 'path';

prepareBuild();

function prepareBuild() {
  prepareVersion();
  clearDist();
}

function prepareVersion(targetPath = './publish/.npm') {
  const rootDir = process.cwd();
  const publishPkgPath = path.resolve(rootDir, targetPath, 'package.json');
  const originPkgPath = path.resolve(rootDir, 'package.json');
  const originPKG = JSON.parse(fs.readFileSync(originPkgPath, 'utf-8'));
  const publishPKG = JSON.parse(fs.readFileSync(publishPkgPath, 'utf-8'));

  const version = originPKG.version;
  publishPKG.version = version;

  fs.writeFileSync(publishPkgPath, JSON.stringify(publishPKG, null, 4), 'utf-8');
}

function clearDist() {
  const rootDir = process.cwd();
  const distpath = path.resolve(rootDir, './dist');

  if (fs.existsSync(distpath)) {
    fs.rmSync(distpath, { recursive: true, force: true });
  }
}
