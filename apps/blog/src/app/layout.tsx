import { PropsWithChildren } from 'react';
import './global.css';
import { Noto_Sans_KR } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Constants } from '@libs/constants';

const font = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

const { siteConfig } = Constants;

export const metadata = {
  title: 'Malloc72P의 기술블로그',
  description: 'Web Service 개발과 IT 전반에 대해 다루는 Malloc72P의 기술 블로그입니다.',
  keywords: [
    'web development',
    'tech blog',
    'frontend',
    'backend',
    'fullstack',
    'react',
    'next js',
    'nextra',
    'javascript',
    'typescript',
  ],
  creator: 'Malloc72P',
  author: [
    {
      name: 'Malloc72P',
      url: 'https://github.com/Malloc72P',
    },
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@shadcn',
  },
};

/**
 * 앱 전체에 적용되는 레이아웃.
 *
 * 폰트 설정 및 공통 메타데이터 설정은 이곳에서 한다.
 */
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko" className={`${font.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <meta
          name="google-site-verification"
          content="mOdpcnnT3rL3phLYQpSNvzcOOGfKppuH-2mgeOs7VIc"
        />
      </head>

      <body>
        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
