import { MdxFileInfo } from './api/mdx-utils';
import { PostModel, SeriesModel } from './types/commons';

const toPostModel = ({
  item,
  seriesModels,
}: {
  item: MdxFileInfo; // Item → MdxFileInfo
  seriesModels: SeriesModel[];
}): PostModel | null => {
  const series = seriesModels.find((s) => s.id === item.frontMatter.series);

  // 시리즈가 없으면 throw로 빌드 전체를 실패시키는 대신 경고만 남기고 해당 포스트를 스킵한다.
  // 호출부는 반환된 null을 타입 가드 필터로 걸러 PostModel[]로 좁힌다.
  if (!series) {
    console.warn(`[Mapper] Series Not Found, skip post. id: ${item.frontMatter.series}`);
    return null;
  }

  return {
    id: item.slug.split('/').pop() || item.slug,
    route: item.route,
    title: item.frontMatter.title,
    series,
    tags: (item.frontMatter.tags || []).map((tag) => ({ id: tag })),
    date: item.frontMatter.date,
  };
};

/**
 * MdxFileInfo 목록을 PostModel 목록으로 변환한다.
 *
 * toPostModel이 시리즈 미존재로 반환한 null을 타입 가드 필터로 제거해 PostModel[]로 좁힌다.
 * 이 변환은 사이트맵·랜딩·태그 상세·시리즈 상세가 모두 거치는 절차라 한 곳에 모은다.
 */
const toPostModels = (items: MdxFileInfo[], seriesModels: SeriesModel[]): PostModel[] =>
  items
    .map((item) => toPostModel({ item, seriesModels }))
    .filter((post): post is PostModel => post !== null);

const toSeriesModel = (series: MdxFileInfo): SeriesModel => ({
  id: series.slug.split('/').pop() || series.slug,
  title: series.frontMatter.title,
  date: series.frontMatter.date,
});

const toTagModel = (tag: string) => ({ id: tag });

export const Mapper = { toPostModel, toPostModels, toSeriesModel, toTagModel };
