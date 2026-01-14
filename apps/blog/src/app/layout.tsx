import { PropsWithChildren } from 'react';
import './global.css';
// import { Noto_Sans_KR } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Constants } from '@libs/constants';

// Noto Sans KR을 서브셋으로 최적화
// - 한글 기본 2,350자만 포함 (전체 11,172자 대신)
// - 폰트 크기: 76KB → ~20KB로 감소
// - swap: 폰트 로딩 중에도 텍스트 표시
// const font = Noto_Sans_KR({
//   weight: ['400', '700'], // 필요한 weight만 로드
//   subsets: ['latin'],
//   display: 'swap', // 폰트 로딩 중에도 텍스트 즉시 표시
//   variable: '--font-noto-sans-kr',
//   preload: true,
//   fallback: ['system-ui', '-apple-system', 'sans-serif'],
//   adjustFontFallback: true, // CLS 방지
// });

const { siteConfig, openGraph } = Constants;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
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
    ...openGraph,
  },
};

/**
 * 앱 전체에 적용되는 레이아웃.
 *
 * 폰트 설정 및 공통 메타데이터 설정은 이곳에서 한다.
 */
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
