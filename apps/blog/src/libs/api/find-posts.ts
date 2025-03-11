import { Item, normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';
import { prepareParam } from '../param-util';
import { Constants } from '@libs/constants';

export interface FindPostsProps {
  orderBy?: 'latest';
  limit?: number;
  seriesId?: string;
}

const GetPostDefaultOption: FindPostsProps = { orderBy: 'latest' };

/**
 * post 밑의 모든 포스트를 가져오는 함수
 *
 * @returns 모든 포스트 페이지
 */
export async function findPosts(param: FindPostsProps = GetPostDefaultOption) {
  const { orderBy, limit, seriesId } = prepareParam<FindPostsProps>(param, GetPostDefaultOption);
  const fullRoute = resolveSeriesQuery(seriesId);

  const pageMap = await getPageMap(fullRoute);

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
    .reduce((acc, curr) => collectPost(acc, curr), [] as Item[])
    .flat()
    .filter((post) => post.frontMatter)
    .filter((post) => !post.frontMatter.isSeriesLanding);

  if (orderBy) {
    posts.sort(sortPostByCreatedAt);
  }

  if (limit) {
    posts = posts.filter((_, i) => i < limit);
  }

  return posts;
}

function collectPost(posts: Item[], current: Item) {
  posts.push(current);

  if (current.children) {
    for (const child of current.children) {
      collectPost(posts, child);
    }
  }

  return posts;
}

const sortPostByCreatedAt = (a: Item, b: Item): number =>
  new Date(b.frontMatter?.date).getTime() - new Date(a.frontMatter?.date).getTime();

function resolveSeriesQuery(seriesId?: string) {
  if (!seriesId || seriesId === Constants.series.latestId) {
    return '/posts';
  }

  return ['/posts', seriesId].filter((v) => v).join('/');
}
