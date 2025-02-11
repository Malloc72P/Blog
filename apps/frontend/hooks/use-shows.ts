'use client';

import { fetcher } from '@libs/fetcher';
import { ApiLinkMap } from '@libs/link-map/api-link-map';
import { FindShowsOutput } from '@repo/dto';
import useSWR from 'swr';

export function useShow() {
  const swrObj = useSWR<FindShowsOutput>(ApiLinkMap.shows.list(), fetcher);

  return {
    shows: swrObj.data ? swrObj.data.shows : [],
    isShowLoading: swrObj.isLoading,
    showSwr: swrObj,
  };
}
