import { Constants } from '@libs/constants';
import { DateUtil } from '@libs/date-util';
import { PostModel, SeriesModel } from '@libs/types/commons';

interface PostJsonLdProps {
  post: PostModel;
  series: SeriesModel;
}

export function PostJsonLd({ post, series }: PostJsonLdProps) {
  const { siteConfig } = Constants;

  // post.date("YYYY-MM-DD HH:mm")를 Schema.org가 기대하는 완전한 ISO 8601(타임존 오프셋 포함)로 변환한다.
  // format은 내부에서 Asia/Seoul 타임존을 강제하므로 빌드 머신 TZ와 무관하게 결정적이다.
  const isoDate = DateUtil.format(post.date, 'isoOffset');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: isoDate,
    // 현재 frontmatter에 수정일 필드가 없어 발행일과 동일 값을 사용한다(실제 수정일 분리는 후속 과제).
    dateModified: isoDate,
    author: {
      '@type': 'Person',
      name: 'Malloc72P',
      url: siteConfig.links.github,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    // post.route는 이미 '/posts/...'로 시작하므로 슬래시 없이 직접 연결해 이중 슬래시를 방지한다.
    url: `${siteConfig.url}${post.route}`,
    isPartOf: {
      '@type': 'Blog',
      name: siteConfig.title,
      url: siteConfig.url,
    },
    articleSection: series.title,
    keywords: post.tags.map((tag) => tag.id),
    inLanguage: 'ko',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
