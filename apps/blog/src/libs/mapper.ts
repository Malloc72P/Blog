import { Item } from 'nextra/normalize-pages';
import { SeriesModel } from './types/commons';
import { DateUtil } from './date-util';

const toPostModel = ({ item, seriesModels }: { item: Item; seriesModels: SeriesModel[] }) => {
  const series = seriesModels.find((series) => series.id === item.frontMatter.series);

  if (!series) {
    console.error(item, series);
    throw new Error('Series Not Found!!!');
  }

  return {
    route: item.route,
    title: item.frontMatter.title,
    series: series,
    tags: item.frontMatter.tags.map((tag: string) => ({ id: tag })),
    date: DateUtil.Dayjs(item.frontMatter.date).toDate(),
  };
};

const toSeriesModel = (series: Item) => ({
  id: series.frontMatter.id,
  title: series.title,
});

const toTagModel = (tag: string) => ({
  id: tag,
});

export const Mapper = {
  toPostModel,
  toSeriesModel,
  toTagModel,
};
