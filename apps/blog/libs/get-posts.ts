import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';

/**
 * post 밑의 모든 포스트를 가져오는 함수
 *
 * @returns 모든 포스트 페이지
 */
export async function getPosts() {
  const pageMap = await getPageMap('/posts');

  /**
   * normalizePages는 각 페이지의 구조와 메타데이터를 기반으로 계층적이고 일관된 네비게이션 데이터를 생성하는 유틸리티이다.
   * getPageMap에서 라우트 경로를 적어주면 반환 타입이 PageMapItem인데, 이 경우 타입이 Folder | MdxFile | MetaJsonFile이다.
   * 이러한 페이지 맵을 정규화하여, 폴더 목록, 경로, 메타데이터 등을 제공한다.
   * mdx 페이지는 directories에 섞여있으니,
   */
  const { directories } = normalizePages({
    list: pageMap,
    route: '/posts',
  });

  return directories
    .filter((post) => post.name !== 'index')
    .sort(
      (a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
    );
}

/**
 * 모든 태그 정보를 가져오는 함수
 * @returns 모든 태그
 */
export async function getTags() {
  const posts = await getPosts();
  const tags = posts.flatMap((post) => post.frontMatter.tags).filter((v) => v);
  return tags;
}
