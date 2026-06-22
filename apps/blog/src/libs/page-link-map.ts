export const PageLinkMap = {
  main: {
    landing: () => '/',
  },
  series: {
    landing: (seriesId: string) => `/posts/${seriesId}`,
  },
  post: {
    detail: (seriesId: string, postId: string) => `/posts/${seriesId}/${postId}`,
  },
  tags: {
    // 전체 태그 인덱스 페이지 경로.
    index: () => '/tags',
    // sitemap과 표기를 맞추기 위해 태그 ID를 인코딩해 경로를 만든다(저위험 변경).
    landing: (tagId: string) => `/tags/${encodeURIComponent(tagId)}`,
  },
};
