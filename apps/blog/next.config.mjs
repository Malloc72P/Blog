import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    // 신택스 하이라이팅을 빌드타임에 shiki로 처리해 클라이언트 하이라이터 JS를 0으로 만든다.
    // @next/mdx + Turbopack은 플러그인을 직렬화하므로 [모듈명, 옵션] 배열 형태로 전달한다.
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          // 기존 darcula 다크 테마를 대체할 적절한 다크 테마.
          theme: 'github-dark',
          // 테마의 배경색을 유지해 기존 다크 코드블록 톤을 보존한다.
          keepBackground: true,
          // 언어를 명시하지 않은 코드블록도 동일하게 grid/라인 처리되도록 기본 언어를 지정한다.
          // (이전 Prism 구현은 모든 블록에 라인넘버를 붙였으므로 그 동작을 보존한다.)
          defaultLang: 'text',
        },
      ],
    ],
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
