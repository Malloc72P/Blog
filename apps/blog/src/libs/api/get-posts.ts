import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';
import { TagMap } from '../tag-map';
import { prepareParam } from '../param-util';

export interface GetPostsProps {
  orderBy?: 'latest';
  limit?: number;
}

const GetPostDefaultOption: GetPostsProps = { orderBy: 'latest' };

/**
 * post 밑의 모든 포스트를 가져오는 함수
 *
 * @returns 모든 포스트 페이지
 */
export async function getPosts(param: GetPostsProps = GetPostDefaultOption) {
  const { orderBy, limit } = prepareParam<GetPostsProps>(param, GetPostDefaultOption);

  const pageMap = await getPageMap('/posts');

  /**
   * normalizePages는 각 페이지의 구조와 메타데이터를 기반으로 계층적이고 일관된 네비게이션 데이터를 생성하는 유틸리티이다.
   * getPageMap에서 라우트 경로를 적어주면 반환 타입이 PageMapItem인데, 이 경우 타입이 Folder | MdxFile | MetaJsonFile이다.
   * 이러한 페이지 맵을 정규화하여, 폴더 목록, 경로, 메타데이터 등을 제공한다.
   * mdx 페이지는 directories에서 찾을 수 있다.
   */
  const { directories } = normalizePages({
    list: pageMap,
    route: '/posts',
  });

  let posts = directories
    .filter((post) => post.name !== 'index')
    .map((dir) => dir.children)
    .flat()
    .filter((post) => !post.frontMatter.isSeriesLanding);

  if (orderBy) {
    posts.sort(
      (a, b) => new Date(b.frontMatter?.date).getTime() - new Date(a.frontMatter?.date).getTime()
    );
  }

  if (limit) {
    posts = posts.filter((_, i) => i < limit);
  }

  return posts;
}
