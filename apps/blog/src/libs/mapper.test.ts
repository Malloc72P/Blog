import { Mapper } from '@libs/mapper';
import { MdxFileInfo } from '@libs/api/mdx-utils';
import { SeriesModel } from '@libs/types/commons';

const seriesModels: SeriesModel[] = [
  { id: 'frontend', title: '프론트엔드', date: '2025-01-01 00:00' },
];

function item(over: Partial<MdxFileInfo['frontMatter']> = {}): MdxFileInfo {
  return {
    slug: 'frontend/closure',
    route: '/posts/frontend/closure',
    filePath: '/fake/path',
    frontMatter: { title: '클로저', date: '2026-01-02 09:00', series: 'frontend', tags: ['JavaScript'], ...over },
  };
}

describe('Mapper.toPostModel', () => {
  it('유효한 시리즈면 PostModel을 만든다(id=slug 마지막 세그먼트, tags 매핑)', () => {
    const model = Mapper.toPostModel({ item: item(), seriesModels });
    if (model === null) throw new Error('PostModel을 기대했는데 null');

    expect(model.id).toBe('closure');
    expect(model.route).toBe('/posts/frontend/closure');
    expect(model.title).toBe('클로저');
    expect(model.series.id).toBe('frontend');
    expect(model.tags).toEqual([{ id: 'JavaScript' }]);
  });

  it('시리즈를 못 찾으면 null을 반환하고 경고를 남긴다', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const model = Mapper.toPostModel({ item: item({ series: 'no-such-series' }), seriesModels });

    expect(model).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('tags가 없으면 빈 배열로 매핑', () => {
    const model = Mapper.toPostModel({ item: item({ tags: undefined }), seriesModels });
    if (model === null) throw new Error('PostModel을 기대했는데 null');
    expect(model.tags).toEqual([]);
  });
});

describe('Mapper.toSeriesModel / toTagModel', () => {
  it('toSeriesModel은 slug 마지막 세그먼트를 id로 쓴다', () => {
    const s = Mapper.toSeriesModel({
      slug: 'frontend',
      route: '/posts/frontend',
      filePath: 'x',
      frontMatter: { title: '프론트엔드', date: '2025-01-01 00:00' },
    });
    expect(s).toEqual({ id: 'frontend', title: '프론트엔드', date: '2025-01-01 00:00' });
  });

  it('toTagModel은 { id } 형태로 만든다', () => {
    expect(Mapper.toTagModel('Typescript')).toEqual({ id: 'Typescript' });
  });
});
