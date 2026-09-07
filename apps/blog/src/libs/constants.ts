export const Constants = {
  series: {
    latestId: 'latest',
    // '최신글' 통합 피드(랜딩 페이지 기본 보기 + /posts/latest)에서 제외할 시리즈 ID.
    // 개별 시리즈 페이지(/posts/{id})와 태그·사이트맵 등 전체 글 목록에는 영향을 주지 않는다.
    excludedFromLatestIds: [] as string[],
  },
  a11y: {
    // skip 링크(본문 바로가기)와 <main> 타깃을 잇는 앵커 id. 두 파일이 같은 값을 공유하도록 단일화한다.
    mainContentId: 'main-content',
  },
  seo: {
    // 태그 페이지를 검색엔진 색인 대상으로 삼을 최소 글 개수.
    // 글 1개짜리 태그 페이지는 고유한 내용이 포스트 제목 한 줄뿐이라 검색엔진이 색인하지 않으면서
    // 크롤 예산만 소모한다. 판정 로직은 tag-index-policy.ts의 shouldIndexTagPage가 담당한다.
    tagIndexMinPostCount: 2,
  },
  siteConfig: {
    name: 'Malloc72p.TechBlog',
    title: 'Malloc72P의 기술블로그',
    url: 'https://blog.malloc72p.com',
    description:
      '웹 개발에 대해 다루는 Malloc72P의 기술 블로그 입니다. 현업에서 개발하면서 배운 내용을 공유하는 공간입니다.',
    links: {
      github: 'https://github.com/Malloc72P',
    },
  },
  openGraph: {
    siteName: 'Malloc72P의 기술 블로그',
    images: [
      {
        url: '/og.jpg',
        width: 640,
        height: 426,
        alt: 'Malloc72P Tech Blog',
      },
    ],
  },
};
