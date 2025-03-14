export const PageLinkMap = {
  main: {
    landing: () => '/',
  },
  series: {
    landing: (seriesId: string) => `/posts/${seriesId}`,
  },
  tags: {
    landing: (tagId: string) => `/tags/${tagId}`,
  },
};
