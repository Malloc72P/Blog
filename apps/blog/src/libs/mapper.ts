import { MdxFileInfo } from './api/mdx-utils';
import { PostModel, SeriesModel } from './types/commons';

const toPostModel = ({
  item,
  seriesModels,
}: {
  item: MdxFileInfo; // Item → MdxFileInfo
  seriesModels: SeriesModel[];
}): PostModel => {
  const series = seriesModels.find((s) => s.id === item.frontMatter.series);

  if (!series) {
    throw new Error(`Series Not Found! id: ${item.frontMatter.series}`);
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
