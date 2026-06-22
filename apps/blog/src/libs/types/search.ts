/**
 * 클라이언트/서버가 공유하는 검색 문서 타입.
 * 서버 전용 코드(fs 사용)와 분리하기 위해 별도 파일로 둔다.
 */
export interface SearchDoc {
  id: string; // 포스트 식별자(postId)
  title: string; // 포스트 제목
  description: string; // 포스트 요약
  series: string; // 시리즈 id
  tags: string[]; // 태그 목록
  route: string; // 포스트 경로 (예: /posts/frontend/monorepo)
  content: string; // 검색용 본문 평문 텍스트
}
