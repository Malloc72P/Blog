import { Badge } from './badge';

export interface TagBadgeProps {
  tagId: string;
  onClick?: () => void;
}

export function TagBadge({ tagId, onClick }: TagBadgeProps) {
  // sitemap과 표기를 맞추기 위해 태그 ID를 인코딩해 링크를 생성한다(저위험 변경).
  return (
    <Badge href={`/tags/${encodeURIComponent(tagId)}`} onClick={onClick}>
      {tagId}
    </Badge>
  );
}
