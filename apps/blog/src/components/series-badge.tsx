import { Badge } from './badge';

export interface SeriesBadgeProps {
  seriesId: string | null;
  title: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
}

export function SeriesBadge({ seriesId, title, onClick, color = 'primary' }: SeriesBadgeProps) {
  return (
    <Badge href={seriesId ? `/posts/${seriesId}` : '#'} onClick={onClick} color={color}>
      {title}
    </Badge>
  );
}
