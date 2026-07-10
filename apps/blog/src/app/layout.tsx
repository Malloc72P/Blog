import { PropsWithChildren } from 'react';
import './global.css';
import { Noto_Sans_KR } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Constants } from '@libs/constants';

// OS별 한글 렌더링 편차를 없애기 위해 활성화(#95). next/font는 빌드타임에 셀프호스트하므로
// 런타임에 fonts.googleapis.com으로 나가는 요청(preconnect 포함)이 필요 없다.
// subsets는 프리로드 대상(latin woff2)만 지정한다 — next/font의 Noto_Sans_KR에는 'korean'
// 서브셋이 없어, 한글 글리프는 unicode-range 슬라이스(다수의 woff2)로 필요한 만큼 온디맨드
// 로드된다. 따라서 첫 방문 시 한글은 폴백→스왑(FOUT)이 발생하며, 아래 display/adjustFontFallback
// 조합으로 로딩 중 표시와 스왑 시 CLS를 완화한다.
const font = Noto_Sans_KR({
  // 실사용 weight만 로드: 400(본문)·500(font-medium 강조)·700(헤딩/볼드).
  // 600은 th(post-detail.module.scss) 한 곳뿐이라 로드하지 않고 700 상향 매칭을 감수한다.
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap', // 폰트 로딩 중에도 텍스트 즉시 표시
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
  adjustFontFallback: true, // CLS 방지
});

const { siteConfig, openGraph } = Constants;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Malloc72P의 기술블로그',
    template: '%s | Malloc72P',
  },
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
  authors: [
    {
      name: 'Malloc72P',
      url: 'https://github.com/Malloc72P',
    },
  ],
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    locale: 'ko_KR',
    ...openGraph,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: openGraph.images,
  },
};

/**
 * 앱 전체에 적용되는 레이아웃.
 *
 * 폰트 설정 및 공통 메타데이터 설정은 이곳에서 한다.
 */
export default async function RootLayout({ children }: PropsWithChildren) {
  // 테마 스크립트가 하이드레이션 전에 html.class를 바꾸므로 suppressHydrationWarning으로 className 불일치 경고를 억제한다.
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 테마 깜빡임(FOUC) 방지: paint 전에 localStorage/시스템 설정으로 html.dark를 결정한다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <meta
          name="google-site-verification"
          content="mOdpcnnT3rL3phLYQpSNvzcOOGfKppuH-2mgeOs7VIc"
        />
      </head>

      {/* font.className이 셀프호스트된 Noto Sans KR과 조정된 폴백(fallback)을 body 전체에 적용한다. */}
      <body className={font.className}>
        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
