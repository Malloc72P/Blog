import { Badge } from './badge';

export interface SeriesBadgeProps {
  seriesId: string | null;
  title: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
}

export function SeriesBadge({ seriesId, title, onClick, color = 'secondary' }: SeriesBadgeProps) {
  return (
    <Badge href={seriesId ? `/posts/${seriesId}` : '#'} onClick={onClick} color={color}>
      {title}
    </Badge>
  );
}
