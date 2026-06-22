import { findSeriesList } from '@libs/api/find-series';
import { getAllMdxFiles, MdxFileInfo } from '@libs/api/mdx-utils';

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

describe('findSeriesList', () => {
  it('isSeriesLanding 페이지만, date 오름차순으로 반환한다', async () => {
    mockGetAll.mockResolvedValue([
      f('frontend/a', { series: 'frontend', date: '2026-01-01 00:00' }), // 일반 글 → 제외
      f('ai', { isSeriesLanding: true, date: '2025-03-01 00:00' }),
      f('frontend', { isSeriesLanding: true, date: '2025-01-01 00:00' }),
    ]);

    const list = await findSeriesList();
    expect(list.map((s) => s.slug)).toEqual(['frontend', 'ai']);
  });
});
