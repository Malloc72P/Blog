import { ArticleHeader } from '@components/article';
import { ArticleContainer } from '@components/article-container';
import { Divider } from '@components/divider';
import { PostCard } from '@components/post-card';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { Constants } from '@libs/constants';
import { Mapper } from '@libs/mapper';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel, SeriesModel } from '@libs/types/commons';
import classNames from 'classnames';
import Link from 'next/link';

export interface SeriesDetailProps {
  series: SeriesModel;
}

export async function SeriesDetail({ series }: SeriesDetailProps) {
  const allPosts = await findPosts({ seriesId: series.id });
  const seriesList = await findSeriesList();
  const seriesModels = seriesList.map(Mapper.toSeriesModel);

  const posts = allPosts
    .map((item) => Mapper.toPostModel({ item, seriesModels }))
    // 시리즈 미존재로 스킵된 포스트(null)를 제거해 PostModel[]로 좁힌다.
    .filter((post): post is PostModel => post !== null);

  // latest 시리즈는 여러 시리즈가 섞인 목록이므로 카드에 시리즈 배지를 노출한다.
  const showSeriesBadge = series.id === Constants.series.latestId;

  return (
    <ArticleContainer>
      {/* 글이 적은 시리즈에서 과도한 하단 공백이 생기지 않도록 반응형으로 축소한다. */}
      <div className="pb-20 md:pb-32">
        <ArticleHeader subTitle={'Malloc72p.Tech.Series'} title={series.title} />

        {/* === 온페이지 시리즈 전환 칩 ===
            한 번의 클릭으로 다른 시리즈로 이동할 수 있도록 모든 시리즈 칩을 노출하고
            현재 시리즈는 강조한다. */}
        <nav aria-label="시리즈 전환" className="flex flex-wrap justify-center gap-2 pb-6">
          {seriesModels.map((item) => {
            // 현재 보고 있는 시리즈와 동일하면 활성 칩으로 강조한다.
            const active = item.id === series.id;

            return (
              <Link
                key={item.id}
                href={PageLinkMap.series.landing(item.id)}
                aria-current={active ? 'page' : undefined}
                className={classNames(
                  'rounded-full font-bold whitespace-nowrap',
                  'px-3 py-1.5 text-xs md:text-sm',
                  'transition-all duration-200 ease-in-out',
                  active
                    ? // 활성 시리즈: 브랜드 액센트로 현재 위치를 강조한다.
                      'bg-[var(--color-brand)] text-white'
                    : // 비활성 시리즈: 옅은 배경 + hover 강조로 클릭 가능함을 알린다.
                      'bg-gray-100 text-gray-700 hover:bg-gray-200',
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* === 글 개수 표시 ===
            현재 시리즈에 포함된 포스트 개수를 안내한다. */}
        <p className="text-center text-xs md:text-sm text-gray-600 pb-4">
          {posts.length}개의 포스트
        </p>

        <Divider />

        {/* posts가 비어 있으면 빈 상태 문구를 보여주고, 아니면 카드 목록을 렌더링한다. */}
        {posts.length === 0 ? (
          <div className="py-[65px] text-center text-gray-600">
            아직 이 시리즈에 작성된 포스트가 없습니다.
          </div>
        ) : (
          <article className="py-[65px]">
            {posts.map((post) => (
              <PostCard
                key={post.route}
                post={post}
                series={series}
                showSeriesBadge={showSeriesBadge}
              />
            ))}
          </article>
        )}
      </div>
    </ArticleContainer>
  );
}
