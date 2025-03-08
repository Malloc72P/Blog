import Link from 'next/link';
import { Item } from 'nextra/normalize-pages';
import { SeriesBadge } from './series-badge';
import { TagBadge } from './tag-badge';

export interface PostCardProps {
  post: Item;
  seriesItem: Item;
}

export function PostCard({ post, seriesItem }: PostCardProps) {
  return (
    <div key={post.route} className="py-5 px-3 border rounded-md shadow-sm mb-5">
      {/* === POST TITLE AND LINK === */}
      <Link href={post.route}>
        <p className="text-lg">{post.title}</p>
      </Link>

      {/* === POST SERIES & TAG CONTAINER === */}
      <div className="mt-5 flex flex-wrap gap-3">
        {/* === POST SERIES === */}
        <SeriesBadge seriesId={seriesItem.frontMatter.id} title={seriesItem.title} />

        {/* === POST TAGS === */}
        {post.frontMatter.tags.map((tag: string) => (
          <TagBadge key={tag} tagId={tag} />
        ))}
      </div>
    </div>
  );
}
