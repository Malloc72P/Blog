import { mdxFile } from '@libs/api/__fixtures__/mdx-file';
import { findTagPostCounts, findTags } from '@libs/api/find-tags';
import { getAllMdxFiles } from '@libs/api/mdx-utils';

jest.mock('@libs/api/mdx-utils');
const mockGetAll = getAllMdxFiles as jest.MockedFunction<typeof getAllMdxFiles>;

beforeEach(() => mockGetAll.mockReset());

describe('findTags', () => {
  it('모든 글의 태그를 모으고 중복을 제거한다(삽입 순서 유지)', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('a', { tags: ['Typescript', 'never'] }),
      mdxFile('b', { tags: ['Typescript', '타입시스템'] }),
      mdxFile('c', {}), // tags 없음
    ]);

    const tags = await findTags();
    expect(tags).toEqual(['Typescript', 'never', '타입시스템']);
  });

  it('태그가 하나도 없으면 빈 배열', async () => {
    mockGetAll.mockResolvedValue([mdxFile('a', {}), mdxFile('b', {})]);
    expect(await findTags()).toEqual([]);
  });
});

describe('findTagPostCounts', () => {
  it('태그별로 그 태그가 달린 글 개수를 센다', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('a', { tags: ['Typescript', 'never'] }),
      mdxFile('b', { tags: ['Typescript', '타입시스템'] }),
      mdxFile('c', { tags: ['Typescript'] }),
      mdxFile('d', {}), // tags 없음
    ]);

    const counts = await findTagPostCounts();

    expect(counts.get('Typescript')).toBe(3);
    expect(counts.get('never')).toBe(1);
    expect(counts.get('타입시스템')).toBe(1);
  });

  it('시리즈 랜딩 페이지의 태그는 세지 않는다', async () => {
    mockGetAll.mockResolvedValue([
      mdxFile('frontend', { tags: ['Typescript'], isSeriesLanding: true }),
      mdxFile('frontend/a', { tags: ['Typescript'] }),
    ]);

    const counts = await findTagPostCounts();

    // 랜딩을 제외한 실제 포스트 1개만 센다. 태그 상세 페이지가 보여주는 목록과 같은 기준이다.
    expect(counts.get('Typescript')).toBe(1);
  });

  it('태그가 하나도 없으면 빈 Map', async () => {
    mockGetAll.mockResolvedValue([mdxFile('a', {}), mdxFile('b', {})]);
    expect((await findTagPostCounts()).size).toBe(0);
  });
});
