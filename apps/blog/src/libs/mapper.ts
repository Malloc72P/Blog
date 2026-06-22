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

const toSeriesModel = (series: MdxFileInfo): SeriesModel => ({
  id: series.slug.split('/').pop() || series.slug,
  title: series.frontMatter.title,
  date: series.frontMatter.date,
});

const toTagModel = (tag: string) => ({ id: tag });

export const Mapper = { toPostModel, toSeriesModel, toTagModel };
