import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
  },
});

// 이 설정 파일 위치(apps/blog) 기준 두 단계 상위가 모노레포(pnpm 워크스페이스) 루트다
const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // 모노레포에서 워크스페이스 루트 자동 추론으로 인한 경고를 막기 위해 Turbopack 루트를 워크스페이스 루트로 고정한다
  turbopack: {
    root: workspaceRoot,
  },
};

export default withMDX(nextConfig);
