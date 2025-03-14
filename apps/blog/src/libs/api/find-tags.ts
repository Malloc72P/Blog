import { Item, normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';

/**
 * 모든 태그 정보를 가져오는 함수
 *
 * @returns 모든 태그
 */
export async function findTags() {
  const tags = new Set<string>();

  const items = await getPageMap('/posts');
  const { directories } = normalizePages({
    list: items,
    route: '/posts',
  });

  directories.forEach((item) => collectTags(item));

  return Array.from(tags.values());

  function collectTags(item: Item) {
    if (item.frontMatter?.tags) {
      item.frontMatter?.tags.forEach((tag: string) => tags.add(tag));
    }

    if (item.children) {
      for (const child of item.children) {
        collectTags(child);
      }
    }
  }
}
