import { Constants } from './constants';
import { PageLinkMap } from './page-link-map';

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

export interface FrontmatterTwitter {
  card: 'summary_large_image';
  title: string;
  description: string;
  images: string[];
}

export interface FrontmatterAlternates {
  canonical: string;
}

export interface FrontmatterOutput {
  id: string;
  title: string;
  description: string;
  openGraph: FrontmatterOpenGraph;
  twitter: FrontmatterTwitter;
  alternates: FrontmatterAlternates;
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
  // 경로 규칙을 PageLinkMap 한 곳에 두어 canonical·OG url이 실제 라우트와 어긋나지 않게 한다.
  const path = postId
    ? PageLinkMap.post.detail(seriesId, postId)
    : PageLinkMap.series.landing(seriesId);
  const ogImages = Constants.openGraph.images;

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
      url: path,
      ...Constants.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    alternates: {
      canonical: path,
    },
    series: seriesId,
  };
}
