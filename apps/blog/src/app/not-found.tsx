import { ArticleContainer } from '@components/article-container';
import { findPosts } from '@libs/api/find-posts';
import { findSeriesList } from '@libs/api/find-series';
import { findTags } from '@libs/api/find-tags';
import { Mapper } from '@libs/mapper';
import { PageLinkMap } from '@libs/page-link-map';
import { PostModel } from '@libs/types/commons';
import Link from 'next/link';
import MainClientLayout from 'src/app/(main)/main-client-layout';

/**
 * 전역 커스텀 404 페이지.
 *
 * 헤더(검색 포함)·푸터를 그대로 쓰기 위해 (main) 레이아웃과 동일하게 데이터를 준비해
 * MainClientLayout으로 감싼다. 막다른 길에서 홈·태그·최근 글로 복귀할 동선을 제공한다.
 */
export default async function NotFound() {
  const seriesModels = (await findSeriesList()).map(Mapper.toSeriesModel);
  const tags = (await findTags()).map(Mapper.toTagModel);
  const posts = (await findPosts())
    .map((item) => Mapper.toPostModel({ item, seriesModels }))
    // 시리즈 미존재로 스킵된 포스트(null)를 제거해 PostModel[]로 좁힌다.
    .filter((post): post is PostModel => post !== null);

  // 별도 인기도 데이터가 없어 최신 글 4개를 복구 동선으로 제시한다.
  const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <MainClientLayout seriesList={seriesModels} tags={tags} posts={posts}>
      <ArticleContainer>
        <div className="flex flex-col items-center gap-6 py-[120px] text-center md:py-[160px]">
          <p className="text-6xl font-bold text-gray-800 md:text-8xl">404</p>

          <div className="flex flex-col gap-1 text-gray-600">
            <p className="text-lg font-medium">페이지를 찾을 수 없습니다.</p>
            <p className="text-sm">주소가 바뀌었거나 삭제된 글일 수 있어요. 아래에서 다시 시작해 보세요.</p>
          </div>

          {/* 복구 링크 — 검색은 헤더의 검색 버튼으로 제공된다. */}
          <div className="flex gap-5">
            <Link
              href={PageLinkMap.main.landing()}
              className="font-medium underline hover:text-gray-900"
            >
              홈으로
            </Link>
            <Link
              href={PageLinkMap.tags.index()}
              className="font-medium underline hover:text-gray-900"
            >
              전체 태그
            </Link>
          </div>

          {/* 최근 글 바로가기 */}
          {recentPosts.length > 0 && (
            <div className="mt-6 w-full max-w-[640px] text-left">
              <p className="mb-3 text-sm font-medium text-gray-500">최근 글</p>
              <ul className="flex flex-col gap-2">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={post.route}
                      className="text-sm text-gray-700 underline-offset-2 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ArticleContainer>
    </MainClientLayout>
  );
}
