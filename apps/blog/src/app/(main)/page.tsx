import { Lorem } from '@libs/debug';
import { getPosts } from '@libs/api/get-posts';
import classNames from 'classnames';
import Link from 'next/link';
import { IntroduceCard } from '@components/introduce-card';
import { getTags } from '@libs/api/get-tags';
import { getSeriesList } from '@libs/api/get-series';
import { SeriesBadge } from '@components/series-badge';
import { TagBadge } from '@components/tag-badge';
import { PostCard } from '@components/post-card';

/**
 * 랜딩 페이지.
 *
 * 루트 경로로 접속하는 경우 해당 페이지가 렌더링된다.
 */
export default async function LandingPage() {
  const posts = await getPosts({
    limit: 20,
  });

  const seriesList = await getSeriesList();

  return (
    <div className="blog-landing-page">
      {/* ------------------------------------------------------ */}
      {/* INTRODUCE CARD */}
      {/* ------------------------------------------------------ */}
      <IntroduceCard />

      {/* ------------------------------------------------------ */}
      {/* SERIES */}
      {/* ------------------------------------------------------ */}
      <div className="my-[65px] flex flex-wrap gap-5">
        <SeriesBadge seriesId={null} title="최신 글" />

        {seriesList.map((series) => (
          <SeriesBadge seriesId={series.frontMatter.id} title={series.title} />
        ))}
      </div>

      {/* ------------------------------------------------------ */}
      {/* DIVIDER */}
      {/* ------------------------------------------------------ */}
      <div className="bg-gray-200 h-[1px]"></div>

      {/* ------------------------------------------------------ */}
      {/* ARTICLE */}
      {/* ------------------------------------------------------ */}
      <div className="my-[65px]">
        {posts.map((post) => {
          const series = seriesList.find(
            (currentSeries) => currentSeries.frontMatter.id === post.frontMatter.series
          );

          if (!series) {
            return;
          }

          return <PostCard key={post.route} post={post} seriesItem={series} />;
        })}
      </div>
    </div>
  );
}
