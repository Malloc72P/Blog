import { PageLinkMap } from '@libs/page-link-map';
import { Badge } from './badge';

export interface TagBadgeProps {
  tagId: string;
  onClick?: () => void;
}

export function TagBadge({ tagId, onClick }: TagBadgeProps) {
  // 경로 생성은 PageLinkMap에 맡긴다. sitemap과 같은 인코딩 규칙을 쓰기 위해서다.
  return (
    <Badge href={PageLinkMap.tags.landing(tagId)} onClick={onClick}>
      {tagId}
    </Badge>
  );
}
