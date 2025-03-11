import { Tag } from '@interfaces/tag';
import { DateUtil } from './date-util';

/**
 * 태그에 대한 메타정보를 담고 있는 객체.
 *
 * 이걸 mdx의 frontmatter에서도 사용할 수 있다면 좋겠으나, mdx에선 실제 코드 실행 없이 구문분석만 진행하나보다.
 * 내부 값을 꺼내서 사용하지를 못한다.
 */
export const TagMap: Record<string, Tag> = {
  frontend: {
    id: 'frontend',
    name: 'Frontend',
    date: DateUtil.Dayjs('2025-02-25'),
  },
};
