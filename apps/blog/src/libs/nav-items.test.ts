import { toSeriesNavItems, toTagNavItems } from '@libs/nav-items';
import { SeriesModel, TagModel } from '@libs/types/commons';

describe('toSeriesNavItems', () => {
  it('시리즈를 id·라벨·링크를 가진 항목으로 바꾼다', () => {
    const seriesList: SeriesModel[] = [
      { id: 'frontend', title: '프론트엔드', date: '2026-01-01 00:00' },
      { id: 'backend', title: '백엔드', date: '2026-01-02 00:00' },
    ];

    expect(toSeriesNavItems(seriesList)).toEqual([
      { id: 'frontend', label: '프론트엔드', href: '/posts/frontend' },
      { id: 'backend', label: '백엔드', href: '/posts/backend' },
    ]);
  });

  it('빈 목록이면 빈 배열', () => {
    expect(toSeriesNavItems([])).toEqual([]);
  });
});

describe('toTagNavItems', () => {
  it('태그 id를 라벨로 쓰고 링크는 인코딩한다', () => {
    const tags: TagModel[] = [{ id: 'Typescript' }, { id: '타입시스템' }];

    expect(toTagNavItems(tags)).toEqual([
      { id: 'Typescript', label: 'Typescript', href: '/tags/Typescript' },
      { id: '타입시스템', label: '타입시스템', href: `/tags/${encodeURIComponent('타입시스템')}` },
    ]);
  });
});
