import { findPosts } from './find-posts';
import { getAllMdxFiles } from './mdx-utils';

export async function findTags(): Promise<string[]> {
  const allFiles = await getAllMdxFiles();
  const tags = new Set<string>();

  allFiles.forEach((file) => {
    file.frontMatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}

/**
 * 태그별로 그 태그가 달린 글이 몇 개인지 센다.
 *
 * 시리즈 랜딩을 제외한 실제 포스트만 세는 findPosts를 쓴다. 태그 상세 페이지가 보여주는
 * 목록도 같은 함수를 쓰므로, 사이트맵의 색인 판정과 화면에 보이는 글 개수가 어긋나지 않는다.
 */
export async function findTagPostCounts(): Promise<Map<string, number>> {
  const posts = await findPosts();
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.frontMatter.tags?.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return counts;
}
