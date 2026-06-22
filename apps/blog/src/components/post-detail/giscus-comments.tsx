'use client';

import Giscus from '@giscus/react';

/**
 * GitHub Discussions 기반 댓글 위젯(giscus).
 *
 * 별도 DB·백엔드 없이 GitHub Discussions에 댓글을 저장한다(비용 0, 유지보수 부담 최소).
 * 글 경로(pathname)로 글↔Discussion을 매핑하므로, 글마다 대응되는 Discussion이
 * 첫 댓글 시 자동 생성된다.
 *
 * 동작에는 저장소에 giscus GitHub App 설치가 필요하다(앱 설치는 저장소 소유자만 가능).
 */
export function GiscusComments() {
  return (
    <Giscus
      // 댓글이 저장될 저장소와 그 GraphQL 노드 ID
      repo="Malloc72P/Blog"
      repoId="R_kgDON30DhA"
      // Announcements 카테고리: 일반 사용자는 Discussion을 직접 만들 수 없고 giscus만 생성한다
      category="Announcements"
      categoryId="DIC_kwDON30DhM4C_oxb"
      // 글 경로(pathname) 기준으로 글과 Discussion을 1:1 매핑
      mapping="pathname"
      // pathname 매핑이라 제목 완전일치(strict)는 불필요
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      // 입력창을 댓글 목록 아래에 배치
      inputPosition="bottom"
      // 블로그가 라이트 테마라 라이트로 고정
      theme="light"
      lang="ko"
      // 뷰포트에 들어올 때 로드해 초기 렌더 비용을 줄인다
      loading="lazy"
    />
  );
}
