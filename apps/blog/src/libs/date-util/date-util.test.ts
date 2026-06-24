import { DateUtil } from '@libs/date-util';
import { PostModel } from '@libs/types/commons';

// format은 내부에서 Asia/Seoul 타임존을 강제하므로 머신 TZ와 무관하게 결정적이다.
describe('DateUtil.format', () => {
  it('short 포맷은 YYYY-MM-DD', () => {
    expect(DateUtil.format('2026-06-22 22:10', 'short')).toBe('2026-06-22');
  });

  it('postCard 포맷은 "YYYY. MM. DD"(분 단위 없음)', () => {
    expect(DateUtil.format('2026-06-22 22:10', 'postCard')).toBe('2026. 06. 22');
  });

  it('isoOffset 포맷은 초와 타임존 오프셋(+09:00)을 포함한 ISO 8601', () => {
    expect(DateUtil.format('2026-03-23 22:42', 'isoOffset')).toBe('2026-03-23T22:42:00+09:00');
  });
});

describe('DateUtil.postSorter', () => {
  it('최신순(내림차순)으로 정렬한다', () => {
    const posts = [
      { date: '2026-01-01 00:00' },
      { date: '2026-03-01 00:00' },
      { date: '2026-02-01 00:00' },
    ] as PostModel[];

    const sorted = [...posts].sort(DateUtil.postSorter).map((p) => p.date);
    expect(sorted).toEqual(['2026-03-01 00:00', '2026-02-01 00:00', '2026-01-01 00:00']);
  });
});
