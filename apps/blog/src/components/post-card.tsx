import { PostModel, SeriesModel } from '@libs/types/commons';
import Link from 'next/link';
import { SeriesBadge } from './series-badge';
import { TagBadge } from './tag-badge';

export interface PostCardProps {
  post: PostModel;
  series: SeriesModel;
}

export function PostCard({ post, series }: PostCardProps) {
  return (
    <div key={post.route} className="px-3 mb-[42px]">
      {/* === POST TITLE AND LINK === */}
      <Link href={post.route}>
        <span className="text-xs md:text-lg font-bold">{post.title}</span>
      </Link>

      {/* === POST SERIES & TAG CONTAINER === */}
      <div className="mt-5 flex flex-wrap gap-3">
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
