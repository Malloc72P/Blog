import { FetchApiOptions } from './fetcher-interface';
import { resolveFetchOption, responseToJson, toApiError } from './fetcher-util';
import { ApiExceptionPayload, ExceptionCode } from '@repo/exceptions';
import { refreshToken } from './refresh-token';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: ExceptionCode,
    public message: string
  ) {
    super(message);
  }
}

export const fetcher = async <INPUT = any, OUTPUT = any>(
  url: string,
  options?: FetchApiOptions<INPUT>
) => {
  const resolvedOption = resolveFetchOption(options);
  const response = await fetch(url, resolvedOption);

  if (response.ok) {
    return (await responseToJson(response)) as OUTPUT;
  }

  const apiError: ApiError = await toApiError(response);

  /**
   * 액세스 토큰 만료상황인 경우 토큰 리프래시하고 재요청.
   */
  if (apiError.code === 'AccessTokenExpired') {
    const { accessToken } = await refreshToken(options?.refreshToken);

    if (resolvedOption.headers) {
      Reflect.set(resolvedOption.headers, 'Authorization', `bearer ${accessToken}`);
    }

    const refetchResponse = await fetch(url, resolvedOption);

    if (!refetchResponse.ok) {
      throw await toApiError(refetchResponse);
    }

    return responseToJson(refetchResponse) as OUTPUT;
  }

  throw apiError;
};
