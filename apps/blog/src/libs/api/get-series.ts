import { Item, normalizePages } from 'nextra/normalize-pages';
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
  const series: Item[] = [];

  const items = await getPageMap('/posts');
  const { directories } = normalizePages({
    list: items,
    route: '/posts',
  });

  directories.forEach((item) => collectSeries(item));

  return series.sort(seriesSorter);

  function collectSeries(item: Item) {
    if (item.frontMatter?.isSeriesLanding) {
      series.push(item);
    }

    if (!item.children) {
      return;
    }

    for (const child of item.children) {
      collectSeries(child);
    }
  }
}

const seriesSorter = (a: Item, b: Item) =>
  new Date(a.frontMatter?.date).getTime() - new Date(b.frontMatter?.date).getTime();
