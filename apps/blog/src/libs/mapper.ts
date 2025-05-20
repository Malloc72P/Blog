import { Item } from 'nextra/normalize-pages';
import { PostModel, SeriesModel } from './types/commons';

const toPostModel = ({
  item,
  seriesModels,
}: {
  item: Item;
  seriesModels: SeriesModel[];
}): PostModel => {
  const series = seriesModels.find((series) => series.id === item.frontMatter.series);
  const date = item.frontMatter.date;

  if (!series) {
    console.error(item, series);
    throw new Error('Series Not Found!!!');
  }

  return {
    route: item.route,
    title: item.frontMatter.title,
    series: series,
    tags: item.frontMatter.tags.map((tag: string) => ({ id: tag })),
    date,
  };
};

const toSeriesModel = (series: Item) => {
  const date = series.frontMatter.date;

  return {
    id: series.frontMatter.id,
    title: series.title,
    date,
  };
};

const toTagModel = (tag: string) => ({
  id: tag,
});

export const Mapper = {
  toPostModel,
  toSeriesModel,
  toTagModel,
};
