import { Constants } from '@libs/constants';
import { PostModel, SeriesModel } from '@libs/types/commons';

interface PostJsonLdProps {
  post: PostModel;
  series: SeriesModel;
}

export function PostJsonLd({ post, series }: PostJsonLdProps) {
  const { siteConfig } = Constants;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
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
    url: `${siteConfig.url}/${post.route}`,
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
