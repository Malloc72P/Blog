import { findPosts } from './find-posts';
import { findSeriesList } from './find-series';
import { findTags } from './find-tags';
import { Mapper } from '../mapper';
import { PostModel, SeriesModel, TagModel } from '../types/commons';

export interface MainLayoutData {
  seriesModels: SeriesModel[];
  tags: TagModel[];
  // 시리즈 미존재로 스킵된 글을 제거한 PostModel 목록(정렬은 호출 측에서 필요에 맞게).
  posts: PostModel[];
}

/**
 * (main) 레이아웃과 커스텀 404 등에서 공통으로 쓰는 시리즈/태그/글 데이터를 로드한다.
 * 데이터 소스·매핑을 한 곳에 모아 중복을 없앤다.
 */
export async function loadMainLayoutData(): Promise<MainLayoutData> {
  const seriesModels = (await findSeriesList()).map(Mapper.toSeriesModel);
  const tags = (await findTags()).map(Mapper.toTagModel);
  const posts = (await findPosts())
    .map((item) => Mapper.toPostModel({ item, seriesModels }))
    // 시리즈 미존재로 스킵된 포스트(null)를 제거해 PostModel[]로 좁힌다.
    .filter((post): post is PostModel => post !== null);

  return { seriesModels, tags, posts };
}
