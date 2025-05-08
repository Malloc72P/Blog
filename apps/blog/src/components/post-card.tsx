import { PostModel, SeriesModel } from '@libs/types/commons';
import Link from 'next/link';
import { SeriesBadge } from './series-badge';
import { TagBadge } from './tag-badge';
import { DateUtil } from '@libs/date-util';

export interface PostCardProps {
  post: PostModel;
  series: SeriesModel;
}

/**
 * 랜딩페이지의 포스트 목록보기에서 사용하는 포스트 카드 컴포넌트
 */
export function PostCard({ post, series }: PostCardProps) {
  return (
    <div key={post.route} className="px-3 mb-[42px]">
      {/* === POST TITLE AND LINK === */}
      <Link href={post.route}>
        <span className="text-xs md:text-lg font-bold">{post.title}</span>
      </Link>

      <div className="text-gray-400 text-xs mb:text-[16px] mt-1 sm:mt-2">
        {DateUtil.format(post.date, 'postCard')}
      </div>

      {/* === POST SERIES & TAG CONTAINER === */}
      <div className="mt-3 flex flex-wrap gap-3">
        {/* === POST SERIES === */}
        <SeriesBadge seriesId={series.id} title={series.title} />

        {/* === POST TAGS === */}
        {post.tags.map((tag) => (
          <TagBadge key={tag.id} tagId={tag.id} />
        ))}
      </div>
    </div>
  );
}
