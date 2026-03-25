import { Constants } from '@libs/constants';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const { url } = Constants.siteConfig;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
