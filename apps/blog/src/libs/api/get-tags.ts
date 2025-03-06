import { TagMap } from '@libs/tag-map';

/**
 * 모든 태그 정보를 가져오는 함수
 * @returns 모든 태그
 */
export async function getTags() {
  return Object.entries(TagMap).map(([tagKey]) => tagKey);
}
