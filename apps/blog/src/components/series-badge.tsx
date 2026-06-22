import { Badge } from './badge';

export interface SeriesBadgeProps {
  seriesId: string | null;
  title: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
  // 현재 선택된 필터 여부. Badge로 전달되어 aria-current 표기에 사용된다.
  active?: boolean;
}

export function SeriesBadge({
  seriesId,
  title,
  onClick,
  color = 'secondary',
  active,
}: SeriesBadgeProps) {
  return (
    <Badge href={seriesId ? `/posts/${seriesId}` : '#'} onClick={onClick} color={color} active={active}>
      {title}
    </Badge>
  );
}
