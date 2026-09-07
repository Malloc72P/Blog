import { DateUtil } from '@libs/date-util';
import { getAllMdxFiles, MdxFileInfo } from './mdx-utils';

export interface SeriesInfo {
  title: string;
}

export async function findSeriesList(): Promise<MdxFileInfo[]> {
  const allFiles = await getAllMdxFiles();

  return allFiles
    .filter((file) => file.frontMatter.isSeriesLanding)
    .sort((a, b) => DateUtil.compareDateAsc(a.frontMatter.date, b.frontMatter.date));
}
