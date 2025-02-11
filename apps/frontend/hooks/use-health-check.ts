'use client';

import { fetcher } from '@libs/fetcher';
import { ApiLinkMap } from '@libs/link-map/api-link-map';
import { HealthCheckOutput } from '@repo/dto';
import useSWR from 'swr';

export function useHealthCheck() {
  const swrObj = useSWR<HealthCheckOutput>(ApiLinkMap.health.check(), fetcher);

  return {
    health: swrObj.data,
    isHealthLoading: swrObj.isLoading,
    healthSwr: swrObj,
  };
}
