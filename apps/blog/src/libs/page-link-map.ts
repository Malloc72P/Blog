export const PageLinkMap = {
  main: {
    landing: () => '/',
  },
  series: {
    landing: (seriesId: string) => `/posts/${seriesId}`,
  },
};
