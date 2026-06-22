import { findPosts } from '@libs/api/find-posts';
import { getAllMdxFiles, MdxFileInfo } from '@libs/api/mdx-utils';

// fs를 읽는 getAllMdxFiles를 mock해 실제 글과 무관하게 "필터/정렬/limit" 로직만 검증한다.
jest.mock('@libs/api/mdx-utils');
const mockGetAll = getAllMdxFiles as jest.MockedFunction<typeof getAllMdxFiles>;

function f(slug: string, fm: Partial<MdxFileInfo['frontMatter']>): MdxFileInfo {
  return {
    slug,
    route: `/posts/${slug}`,
    filePath: `/fake/${slug}`,
    frontMatter: { title: slug, date: '2026-01-01 00:00', ...fm },
  };
}

beforeEach(() => mockGetAll.mockReset());

describe('findPosts', () => {
  it('시리즈 랜딩을 제외하고 최신순으로 정렬한다', async () => {
    mockGetAll.mockResolvedValue([
      f('frontend', { isSeriesLanding: true, date: '2025-01-01 00:00' }),
      f('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      f('frontend/b', { series: 'frontend', date: '2026-03-01 00:00' }),
    ]);

    const posts = await findPosts();
    expect(posts.map((p) => p.slug)).toEqual(['frontend/b', 'frontend/a']);
  });

  it('seriesId로 해당 시리즈만 필터한다', async () => {
    mockGetAll.mockResolvedValue([
      f('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      f('ai/x', { series: 'ai', date: '2026-02-01 00:00' }),
    ]);

    const posts = await findPosts({ seriesId: 'frontend' });
    expect(posts.map((p) => p.slug)).toEqual(['frontend/a']);
  });

  it("seriesId가 'latest'면 전체(랜딩 제외)를 반환한다", async () => {
    mockGetAll.mockResolvedValue([
      f('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      f('ai/x', { series: 'ai', date: '2026-02-01 00:00' }),
    ]);

    const posts = await findPosts({ seriesId: 'latest' });
    expect(posts).toHaveLength(2);
  });

  it('limit으로 개수를 제한한다', async () => {
    mockGetAll.mockResolvedValue([
      f('a', { series: 's', date: '2026-01-01 00:00' }),
      f('b', { series: 's', date: '2026-02-01 00:00' }),
      f('c', { series: 's', date: '2026-03-01 00:00' }),
    ]);

    const posts = await findPosts({ limit: 2 });
    expect(posts).toHaveLength(2);
  });

  it("orderBy 'createAtASC'는 오래된 순으로 정렬한다", async () => {
    mockGetAll.mockResolvedValue([
      f('a', { series: 's', date: '2026-03-01 00:00' }),
      f('b', { series: 's', date: '2026-01-01 00:00' }),
    ]);

    const posts = await findPosts({ orderBy: 'createAtASC' });
    expect(posts.map((p) => p.slug)).toEqual(['b', 'a']);
  });
});
