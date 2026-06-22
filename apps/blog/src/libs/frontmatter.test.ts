import { frontmatter } from '@libs/frontmatter';

describe('frontmatter', () => {
  it('포스트(postId 있음): id/route/canonical을 시리즈+포스트 경로로 만든다', () => {
    const fm = frontmatter({
      title: '클로저',
      description: '클로저 설명',
      seriesId: 'frontend',
      postId: 'closure',
      date: '2026-01-02 09:00',
      tags: ['Closure', 'JavaScript'],
    });

    expect(fm.id).toBe('closure');
    expect(fm.series).toBe('frontend');
    expect(fm.alternates.canonical).toBe('/posts/frontend/closure');
    expect(fm.openGraph.url).toBe('/posts/frontend/closure');
    expect(fm.tags).toEqual(['Closure', 'JavaScript']);
    expect(fm.twitter.card).toBe('summary_large_image');
    expect(fm.isSeriesLanding).toBe(false);
  });

  it('시리즈 랜딩(postId 없음): id=seriesId, 경로는 시리즈 경로', () => {
    const fm = frontmatter({
      title: '프론트엔드',
      description: '시리즈',
      seriesId: 'frontend',
      date: '2025-01-01 00:00',
      isSeriesLanding: true,
    });

    expect(fm.id).toBe('frontend');
    expect(fm.alternates.canonical).toBe('/posts/frontend');
    expect(fm.openGraph.url).toBe('/posts/frontend');
    expect(fm.isSeriesLanding).toBe(true);
  });

  it('tags 기본값은 빈 배열', () => {
    const fm = frontmatter({ title: 'T', description: 'D', seriesId: 'ai', date: '2026-01-01 00:00' });
    expect(fm.tags).toEqual([]);
  });
});
