import Link from 'next/link';

export interface TagBadgeProps {
  tagId: string;
}

export function TagBadge({ tagId }: TagBadgeProps) {
  return (
    <span className="border px-3 py-1 rounded-md" key={tagId}>
      <Link href={`/tags/${tagId}`}>{tagId}</Link>
    </span>
  );
}
