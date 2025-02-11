import { ApiLinkMap } from '@libs/link-map';
import { RefreshTokenResult } from '@repo/dto';
import { toApiError } from './fetcher-util';

export async function refreshToken(token?: string) {
  const response = await fetch(ApiLinkMap.auth.refresh(), {
    method: 'POST',
    credentials: token ? undefined : 'include',
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('################## REFRESH FAILED !!!');
    throw await toApiError(response);
  }

  return (await response.json()) as RefreshTokenResult;
}
