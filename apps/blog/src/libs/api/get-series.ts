import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap, normalizePageMap } from 'nextra/page-map';

export interface SeriesInfo {
  title: string;
}

/**
 * 모든 시리즈 정보를 가져오는 함수
 *
 * @returns 모든 시리즈
 */
export async function getSeriesList() {
  const items = await getPageMap('/posts');
  const { directories } = normalizePages({
    list: items,
    route: '/posts',
  });

  return directories
    .map((dir) => dir.children)
    .flat()
    .filter((item) => item.frontMatter?.isSeriesLanding);
}
