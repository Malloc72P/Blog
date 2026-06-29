import { recommendPosts } from './recommend-posts';
import { PostModel, SeriesModel } from './types/commons';

const frontend: SeriesModel = { id: 'frontend', title: 'Frontend', date: '2026-01-01' };
const ai: SeriesModel = { id: 'ai', title: 'AI', date: '2026-01-01' };

// 테스트용 PostModel 팩토리.
function post(
  id: string,
  series: SeriesModel,
  tagIds: string[],
  date = '2026-01-01 00:00',
): PostModel {
  return {
    id,
    route: `/posts/${series.id}/${id}`,
    series,
    title: id,
    tags: tagIds.map((t) => ({ id: t })),
    date,
  };
}

describe('recommendPosts', () => {
  const current = post('current', frontend, ['react', 'ts']);

  it('현재 글은 추천에서 제외한다', () => {
    const all = [current, post('a', frontend, ['react'])];
    const result = recommendPosts(current, all);

    expect(result.map((p) => p.id)).not.toContain('current');
  });

  it('태그 겹침이 많을수록 더 높은 순위로 추천한다', () => {
    const all = [
      current,
      post('twoTags', ai, ['react', 'ts']), // 태그 2개 겹침(다른 시리즈)
      post('oneTag', ai, ['react', 'css']), // 태그 1개 겹침(다른 시리즈)
    ];

    const result = recommendPosts(current, all);

    expect(result.map((p) => p.id)).toEqual(['twoTags', 'oneTag']);
  });

  it('태그 접점이 없어도 같은 시리즈면 추천한다', () => {
    const all = [current, post('sameSeries', frontend, ['vue'])]; // 태그 0겹침, 같은 시리즈

    const result = recommendPosts(current, all);

    expect(result.map((p) => p.id)).toEqual(['sameSeries']);
  });

  it('태그도 안 겹치고 시리즈도 다르면 추천에서 제외한다', () => {
    const all = [current, post('unrelated', ai, ['python'])];

    const result = recommendPosts(current, all);

    expect(result).toHaveLength(0);
  });

  it('limit 개수만큼만 추천한다', () => {
    const all = [
      current,
      post('a', frontend, ['react']),
      post('b', frontend, ['ts']),
      post('c', frontend, ['react', 'ts']),
    ];

    const result = recommendPosts(current, all, 2);

    expect(result).toHaveLength(2);
  });

  it('점수가 같으면 최신 글을 우선한다', () => {
    const all = [
      current,
      post('older', ai, ['react'], '2026-01-01 00:00'),
      post('newer', ai, ['react'], '2026-02-01 00:00'),
    ];

    const result = recommendPosts(current, all);

    // 동일 점수(태그 1겹침, 다른 시리즈)이므로 날짜가 최신인 글이 먼저 와야 한다.
    expect(result.map((p) => p.id)).toEqual(['newer', 'older']);
  });
});
