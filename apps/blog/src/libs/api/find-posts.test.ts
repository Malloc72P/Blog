import { mdxFile } from '@libs/api/__fixtures__/mdx-file';
import { findPosts } from '@libs/api/find-posts';
import { getAllMdxFiles } from '@libs/api/mdx-utils';
import { Constants } from '@libs/constants';

// fs를 읽는 getAllMdxFiles를 mock해 실제 글과 무관하게 "필터/정렬/limit" 로직만 검증한다.
jest.mock('@libs/api/mdx-utils');
const mockGetAll = getAllMdxFiles as jest.MockedFunction<typeof getAllMdxFiles>;

beforeEach(() => mockGetAll.mockReset());

describe('findPosts', () => {
  it('시리즈 랜딩을 제외하고 최신순으로 정렬한다', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('frontend', { isSeriesLanding: true, date: '2025-01-01 00:00' }),
      mdxFile('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      mdxFile('frontend/b', { series: 'frontend', date: '2026-03-01 00:00' }),
    ]);

    const posts = await findPosts();
    expect(posts.map((p) => p.slug)).toEqual(['frontend/b', 'frontend/a']);
  });

  it('seriesId로 해당 시리즈만 필터한다', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      mdxFile('ai/x', { series: 'ai', date: '2026-02-01 00:00' }),
    ]);

    const posts = await findPosts({ seriesId: 'frontend' });
    expect(posts.map((p) => p.slug)).toEqual(['frontend/a']);
  });

  it("seriesId가 'latest'면 전체(랜딩 제외)를 반환한다", async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
      mdxFile('ai/x', { series: 'ai', date: '2026-02-01 00:00' }),
    ]);

    const posts = await findPosts({ seriesId: 'latest' });
    expect(posts).toHaveLength(2);
  });

  it('limit으로 개수를 제한한다', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('a', { series: 's', date: '2026-01-01 00:00' }),
      mdxFile('b', { series: 's', date: '2026-02-01 00:00' }),
      mdxFile('c', { series: 's', date: '2026-03-01 00:00' }),
    ]);

    const posts = await findPosts({ limit: 2 });
    expect(posts).toHaveLength(2);
  });

  describe('excludedFromLatestIds (#25)', () => {
    const original = Constants.series.excludedFromLatestIds;
    afterEach(() => {
      Constants.series.excludedFromLatestIds = original;
    });

    it("seriesId가 'latest'면 제외 목록의 시리즈 글을 뺀다", async () => {
      Constants.series.excludedFromLatestIds = ['fullstack'];
      mockGetAll.mockResolvedValue([
        mdxFile('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }),
        mdxFile('fullstack/x', { series: 'fullstack', date: '2026-02-01 00:00' }),
      ]);

      const posts = await findPosts({ seriesId: 'latest' });
      expect(posts.map((p) => p.slug)).toEqual(['frontend/a']);
    });

    it('제외 목록에 있어도 해당 시리즈를 직접 조회하면 그대로 반환한다', async () => {
      Constants.series.excludedFromLatestIds = ['fullstack'];
      mockGetAll.mockResolvedValue([
        mdxFile('fullstack/x', { series: 'fullstack', date: '2026-02-01 00:00' }),
      ]);

      const posts = await findPosts({ seriesId: 'fullstack' });
      expect(posts.map((p) => p.slug)).toEqual(['fullstack/x']);
    });

    it('seriesId 없이 호출하면(전체 글 목록) 제외 목록의 영향을 받지 않는다', async () => {
      Constants.series.excludedFromLatestIds = ['fullstack'];
      mockGetAll.mockResolvedValue([
        mdxFile('fullstack/x', { series: 'fullstack', date: '2026-02-01 00:00' }),
      ]);

      const posts = await findPosts();
      expect(posts.map((p) => p.slug)).toEqual(['fullstack/x']);
    });
  });

  it("orderBy 'createAtASC'는 오래된 순으로 정렬한다", async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('a', { series: 's', date: '2026-03-01 00:00' }),
      mdxFile('b', { series: 's', date: '2026-01-01 00:00' }),
    ]);

    const posts = await findPosts({ orderBy: 'createAtASC' });
    expect(posts.map((p) => p.slug)).toEqual(['b', 'a']);
  });
});
