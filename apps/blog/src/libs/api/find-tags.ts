import { findPosts } from './find-posts';

/**
 * 글에 달린 태그를 중복 없이 모은다(등장 순서 유지).
 *
 * findTagPostCounts와 같은 소스를 쓰도록 그 결과의 키를 그대로 돌려준다. 두 함수가 서로 다른
 * 기준(시리즈 랜딩 포함 여부)으로 갈리면 태그 목록과 글 개수가 어긋나기 때문이다.
 */
export async function findTags(): Promise<string[]> {
  return [...(await findTagPostCounts()).keys()];
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
