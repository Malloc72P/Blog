export interface SeriesInfo {
  title: string;
}

import { getAllMdxFiles, MdxFileInfo } from './mdx-utils';

export async function findSeriesList(): Promise<MdxFileInfo[]> {
  const allFiles = await getAllMdxFiles();

  return allFiles
    .filter((file) => file.frontMatter.isSeriesLanding)
    .sort(
      (a, b) => new Date(a.frontMatter.date).getTime() - new Date(b.frontMatter.date).getTime(),
    );
}
