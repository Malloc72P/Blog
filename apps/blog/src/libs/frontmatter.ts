import { Constants } from './constants';

export type PostType = 'article' | 'series-landing';

export interface FrontmatterInput {
  seriesId: string;
  postId?: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  isSeriesLanding?: boolean;
}

export interface FrontmatterOpenGraph {
  title: string;
  description: string;
  type: PostType;
  url: string;
  siteName: string;
  images: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
}

export interface FrontmatterOutput {
  id: string;
  title: string;
  description: string;
  openGraph: FrontmatterOpenGraph;
  series: string;
  tags: string[];
  date: string;
  isSeriesLanding?: boolean;
}

/**
 * 블로그 포스트 및 시리즈 랜딩의 frontmatter 정보를 생성합니다.
 *
 * postId가 없는 경우 시리즈 랜딩 페이지로 간주됩니다.
 * postId는 시리즈 내 개별 포스트의 식별자입니다. 파일시스템 경로를 route 경로로 사용하는 nextjs 특성상, 포스트 파일 이름과 동일하게 설정해야 합니다.
 */
export function frontmatter({
  title,
  description,
  seriesId,
  postId,
  date,
  isSeriesLanding = false,
  tags = [],
}: FrontmatterInput): FrontmatterOutput {
  return {
    id: postId ?? seriesId,
    title,
    description,
    tags,
    date,
    isSeriesLanding,
    openGraph: {
      title,
      description,
      type: 'article',
      url: postId ? `/posts/${seriesId}/${postId}` : `/posts/${seriesId}`,
      ...Constants.openGraph,
    },
    series: seriesId,
  };
}
