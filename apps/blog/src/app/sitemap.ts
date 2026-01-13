import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { Constants } from '@libs/constants';
import { DateUtil } from '@libs/date-util';
import { Mapper } from '@libs/mapper';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seriesModels = (await findSeriesList()).map((item) => Mapper.toSeriesModel(item));
  const posts = (await findPosts()).map((item) => Mapper.toPostModel({ item, seriesModels }));

  const { url } = Constants.siteConfig;

  const sitemaps: MetadataRoute.Sitemap = [
    {
      url: url,
      priority: 1,
      changeFrequency: 'weekly',
      lastModified: new Date(),
    },
  ];

  for (const post of posts) {
    sitemaps.push({
      url: [url, post.route].join('/'),
      priority: 0.7,
      changeFrequency: 'weekly',
      lastModified: DateUtil.Dayjs(post.date).toDate(),
    });
  }

  for (const series of seriesModels) {
    sitemaps.push({
      url: [url, 'posts', series.id].join('/'),
      priority: 0.8,
      changeFrequency: 'weekly',
      lastModified: DateUtil.Dayjs(series.date).toDate(),
    });
  }

  return sitemaps;
}
