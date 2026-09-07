import { Constants } from './constants';

/**
 * 태그 페이지를 검색엔진 색인 대상으로 삼을지 판정한다.
 *
 * 글이 적은 태그 페이지는 고유한 내용이 포스트 제목 한 줄뿐이라 검색엔진이 색인을 거부한다.
 * 그런 페이지가 사이트맵의 대부분을 차지하면 크롤러가 한정된 크롤 예산을 태그 목록에 쓰고
 * 정작 포스트는 뒤로 밀린다. 색인 대상을 좁혀 크롤러가 포스트를 먼저 보게 한다.
 *
 * 색인에서 빠져도 페이지는 그대로 서비스되며, 방문자는 태그로 계속 탐색할 수 있다.
 *
 * 사이트맵(sitemap.ts)과 태그 상세 페이지의 robots 메타(tags/[tag]/page.tsx)가
 * 같은 기준으로 판단하도록 이 함수를 공유한다.
 */
export function shouldIndexTagPage(postCount: number): boolean {
  return postCount >= Constants.seo.tagIndexMinPostCount;
}
