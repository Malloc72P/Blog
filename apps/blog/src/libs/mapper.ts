import { Item } from 'nextra/normalize-pages';
import { SeriesModel } from './types/commons';

const toPostModel = ({ item, seriesModels }: { item: Item; seriesModels: SeriesModel[] }) => {
  const series = seriesModels.find((series) => series.id === item.frontMatter.series);

  if (!series) {
    throw new Error('Series Not Found!!!');
  }

  return {
    route: item.route,
    title: item.frontMatter.title,
    series: series,
    tags: item.frontMatter.tags.map((tag: string) => ({ id: tag })),
    date: new Date(item.frontMatter.date),
  };
};

const toSeriesModel = (series: Item) => ({
  id: series.frontMatter.id,
  title: series.title,
});

export const Mapper = {
  toPostModel,
  toSeriesModel,
};
