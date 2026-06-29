import { PostModel } from './types/commons';

// 같은 시리즈일 때 더해주는 가중치. 태그 자카드(0~1)와 합산되므로,
// 태그 접점이 약해도 같은 시리즈 글이 우선 추천되도록 0.5로 둔다.
const SAME_SERIES_BOOST = 0.5;

/**
 * 현재 글과의 유사도 점수.
 * - 태그 자카드 유사도(교집합/합집합, 0~1)
 * - 같은 시리즈면 가중치 가산
 */
function similarityScore(
  current: PostModel,
  currentTagIds: Set<string>,
  candidate: PostModel,
): number {
  const candidateTagIds = candidate.tags.map((tag) => tag.id);
  // 두 글이 공유하는 태그 수(교집합).
  const shared = candidateTagIds.filter((id) => currentTagIds.has(id)).length;
  // 두 글 태그의 합집합 크기.
  const union = new Set([...currentTagIds, ...candidateTagIds]).size;
  // 합집합이 비면(둘 다 태그 없음) 자카드는 0으로 둔다.
  const jaccard = union === 0 ? 0 : shared / union;
  // 같은 시리즈면 가중치를 더한다.
  const seriesBoost = candidate.series.id === current.series.id ? SAME_SERIES_BOOST : 0;

  return jaccard + seriesBoost;
}

/**
 * 현재 글과 태그/시리즈 유사도가 높은 글을 상위 limit개 추천한다.
 * - 현재 글은 제외한다.
 * - 접점이 전혀 없는 글(점수 0)은 제외해 무관한 추천을 막는다.
 * - 동점은 최신 글을 우선한다.
 */
export function recommendPosts(current: PostModel, all: PostModel[], limit = 4): PostModel[] {
  const currentTagIds = new Set(current.tags.map((tag) => tag.id));

  return all
    .filter((post) => post.id !== current.id) // 현재 글 제외
    .map((post) => ({ post, score: similarityScore(current, currentTagIds, post) }))
    .filter((scored) => scored.score > 0) // 접점 없는 글 제외
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date)) // 점수↓, 동점은 최신↑
    .slice(0, limit)
    .map((scored) => scored.post);
}
