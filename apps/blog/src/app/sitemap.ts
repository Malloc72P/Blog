import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { findTagPostCounts } from '@libs/api/find-tags';
import { Constants } from '@libs/constants';
import { DateUtil } from '@libs/date-util';
import { Mapper } from '@libs/mapper';
import { shouldIndexTagPage } from '@libs/tag-index-policy';
import { PostModel, SeriesModel } from '@libs/types/commons';
import { MetadataRoute } from 'next';

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { url } = Constants.siteConfig;

  const seriesModels = (await findSeriesList()).map((item) => Mapper.toSeriesModel(item));
  const posts = await findPostModels(seriesModels);
  const tagPostCounts = await findTagPostCounts();

  return [
    createHomeEntry(url),
    ...createPostEntries(url, posts),
    ...createSeriesEntries(url, seriesModels),
    ...createIndexableTagEntries(url, tagPostCounts),
  ];
}

async function findPostModels(seriesModels: SeriesModel[]): Promise<PostModel[]> {
  return (await findPosts())
    .map((item) => Mapper.toPostModel({ item, seriesModels }))
    // 시리즈 미존재로 스킵된 포스트(null)를 제거해 PostModel[]로 좁힌다.
    .filter((post): post is PostModel => post !== null);
}

function createHomeEntry(url: string): SitemapEntry {
  return {
    url: url,
    priority: 1,
    changeFrequency: 'weekly',
    lastModified: new Date(),
  };
}

function createPostEntries(url: string, posts: PostModel[]): SitemapEntry[] {
  return posts.map((post) => ({
    // post.route는 이미 '/posts/...'로 시작하므로 join('/') 대신 직접 연결해 이중 슬래시를 방지한다
    url: `${url}${post.route}`,
    priority: 0.8,
    lastModified: DateUtil.Dayjs(post.date).toDate(),
  }));
}

function createSeriesEntries(url: string, seriesModels: SeriesModel[]): SitemapEntry[] {
  return seriesModels.map((series) => ({
    url: [url, 'posts', series.id].join('/'),
    priority: 0.5,
    changeFrequency: 'daily',
    lastModified: DateUtil.Dayjs(series.date).toDate(),
  }));
}

/**
 * 색인 대상인 태그 페이지만 사이트맵에 싣는다.
 *
 * 글이 적은 태그 페이지는 robots 메타로 noindex 처리되므로(tags/[tag]/page.tsx),
 * 사이트맵에서도 빼서 검색엔진에 보내는 신호를 일치시킨다. noindex 페이지를 사이트맵으로
 * 제출하면 크롤러가 색인하지 않을 페이지를 계속 방문해 크롤 예산만 소모한다.
 */
function createIndexableTagEntries(
  url: string,
  tagPostCounts: Map<string, number>,
): SitemapEntry[] {
  return [...tagPostCounts.entries()]
    .filter(([, postCount]) => shouldIndexTagPage(postCount))
    .map(([tag]) => ({
      url: [url, 'tags', encodeURIComponent(tag)].join('/'),
      priority: 0.3,
      changeFrequency: 'weekly' as const,
    }));
}
