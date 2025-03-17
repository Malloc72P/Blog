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
    landing: (tagId: string) => `/tags/${tagId}`,
  },
};
