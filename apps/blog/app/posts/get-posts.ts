import { normalizePages } from 'nextra/normalize-pages';
import { getPageMap } from 'nextra/page-map';

/**
 * post 밑의 모든 포스트를 가져오는 함수
 *
 * @returns 모든 포스트 페이지
 */
export async function getPosts() {
  const { directories } = normalizePages({
    list: await getPageMap('/posts'),
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
  const tags = posts.flatMap((post) => post.frontMatter.tags);
  return tags;
}
