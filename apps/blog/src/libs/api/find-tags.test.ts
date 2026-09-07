import { findTagPostCounts, findTags } from '@libs/api/find-tags';
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

describe('findTags', () => {
  it('모든 글의 태그를 모으고 중복을 제거한다(삽입 순서 유지)', async () => {
    mockGetAll.mockResolvedValue([
      f('a', { tags: ['Typescript', 'never'] }),
      f('b', { tags: ['Typescript', '타입시스템'] }),
      f('c', {}), // tags 없음
    ]);

    const tags = await findTags();
    expect(tags).toEqual(['Typescript', 'never', '타입시스템']);
  });

  it('태그가 하나도 없으면 빈 배열', async () => {
    mockGetAll.mockResolvedValue([f('a', {}), f('b', {})]);
    expect(await findTags()).toEqual([]);
  });
});

describe('findTagPostCounts', () => {
  it('태그별로 그 태그가 달린 글 개수를 센다', async () => {
    mockGetAll.mockResolvedValue([
      f('a', { tags: ['Typescript', 'never'] }),
      f('b', { tags: ['Typescript', '타입시스템'] }),
      f('c', { tags: ['Typescript'] }),
      f('d', {}), // tags 없음
    ]);

    const counts = await findTagPostCounts();

    expect(counts.get('Typescript')).toBe(3);
    expect(counts.get('never')).toBe(1);
    expect(counts.get('타입시스템')).toBe(1);
  });

  it('시리즈 랜딩 페이지의 태그는 세지 않는다', async () => {
    mockGetAll.mockResolvedValue([
      f('frontend', { tags: ['Typescript'], isSeriesLanding: true }),
      f('frontend/a', { tags: ['Typescript'] }),
    ]);

    const counts = await findTagPostCounts();

    // 랜딩을 제외한 실제 포스트 1개만 센다. 태그 상세 페이지가 보여주는 목록과 같은 기준이다.
    expect(counts.get('Typescript')).toBe(1);
  });

  it('태그가 하나도 없으면 빈 Map', async () => {
    mockGetAll.mockResolvedValue([f('a', {}), f('b', {})]);
    expect((await findTagPostCounts()).size).toBe(0);
  });
});
