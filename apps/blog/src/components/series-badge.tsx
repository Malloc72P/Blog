import Link from 'next/link';

export interface SeriesBadgeProps {
  seriesId: string | null;
  title: string;
  onClick?: () => void;
}

export function SeriesBadge({ seriesId, title, onClick }: SeriesBadgeProps) {
  return (
    <span className="border px-3 py-1 rounded-md" onClick={onClick}>
      <Link href={seriesId ? `/posts/${seriesId}` : '#'}>{title}</Link>
    </span>
  );
}
