import { ArticleHeader } from '@components/article';
import { PostCard } from '@components/post-card';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { Mapper } from '@libs/mapper';
import { SeriesModel } from '@libs/types/commons';

export interface SeriesPostListProps {
  series: SeriesModel;
}

export async function SeriesDetail({ series }: SeriesPostListProps) {
  const allPosts = await findPosts({ seriesId: series.id });
  const seriesList = await findSeriesList();
  const seriesModels = seriesList.map(Mapper.toSeriesModel);

  const posts = allPosts.map((item) => Mapper.toPostModel({ item, seriesModels }));

  return (
    <div className="pb-[200px]">
      <ArticleHeader subTitle={'Malloc72p.Tech.Series'} title={series.title} />

      {posts.map((post) => (
        <PostCard key={post.route} post={post} series={series} />
      ))}
    </div>
  );
}
