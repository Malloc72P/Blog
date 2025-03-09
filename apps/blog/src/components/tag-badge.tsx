import Link from 'next/link';
import { Badge } from './badge';

export interface TagBadgeProps {
  tagId: string;
  onClick?: () => void;
}

export function TagBadge({ tagId, onClick }: TagBadgeProps) {
  return (
    <Badge href={`/tags/${tagId}`} onClick={onClick}>
      {tagId}
    </Badge>
  );
}
