import { fetcher } from '@libs/fetcher';
import { ApiLinkMap } from '@libs/link-map';
import { FindShowsInput, FindShowsOutput } from '@repo/dto';
import { FetchApiAuthOption } from '../api';

export async function findShows(
  params: FindShowsInput,
  authOption: FetchApiAuthOption
): Promise<FindShowsOutput> {
  try {
    const response = await fetcher<FindShowsOutput>(ApiLinkMap.shows.list(), {
      ...authOption,
    });

    return response;
  } catch (error) {
    console.log('fetch error! >>> ', (error as any).info);

    return { shows: [] };
  }
}
