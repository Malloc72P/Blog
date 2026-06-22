import { findTags } from '@libs/api/find-tags';
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
