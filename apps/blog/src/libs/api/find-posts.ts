import { getAllMdxFiles, MdxFileInfo } from './mdx-utils';
import { prepareParam } from '../param-util';
import { Constants } from '@libs/constants';

export interface FindPostsProps {
  orderBy?: 'latest' | 'createAtASC';
  limit?: number;
  seriesId?: string;
}

const GetPostDefaultOption: FindPostsProps = { orderBy: 'latest' };

export async function findPosts(
  param: FindPostsProps = GetPostDefaultOption,
): Promise<MdxFileInfo[]> {
  const { orderBy, limit, seriesId } = prepareParam<FindPostsProps>(param, GetPostDefaultOption);

  let posts = await getAllMdxFiles();

  // 시리즈 랜딩 페이지 제외
  posts = posts.filter((post) => !post.frontMatter.isSeriesLanding);

  // 시리즈 필터링
  if (seriesId && seriesId !== Constants.series.latestId) {
    posts = posts.filter((post) => post.frontMatter.series === seriesId);
  }

  // 정렬
  if (orderBy === 'latest') {
    posts.sort(
      (a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime(),
    );
  } else if (orderBy === 'createAtASC') {
    posts.sort(
      (a, b) => new Date(a.frontMatter.date).getTime() - new Date(b.frontMatter.date).getTime(),
    );
  }

  // 제한
  if (limit) {
    posts = posts.slice(0, limit);
  }

  return posts;
}
