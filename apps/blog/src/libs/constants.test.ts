import { Constants } from '@libs/constants';
import { getAllMdxFiles } from '@libs/api/mdx-utils';

// 다른 api 테스트와 달리 getAllMdxFiles를 mock하지 않는다.
// 추천 ID 오타(예: 'next-grid-app-1')처럼 실제 글과의 불일치를 잡아야 하므로
// 실제 posts 디렉토리를 스캔한 결과(진짜 postId 집합)와 대조한다.
describe('Constants.recommendation', () => {
  it('모든 추천 postId가 실제 존재하는 글의 postId와 일치한다', async () => {
    // 실제 page.mdx들을 스캔해 유효한 postId 집합을 만든다(frontMatter.id = postId).
    const posts = await getAllMdxFiles();
    const existingIds = new Set(
      posts
        .map((post) => post.frontMatter.id)
        .filter((id): id is string => typeof id === 'string'),
    );

    // 실제 집합에 없는 추천 ID만 추려 오타/누락을 구체적으로 드러낸다.
    const missingIds = Constants.recommendation.postIds.filter((id) => !existingIds.has(id));

    expect(missingIds).toEqual([]);
  });
});
