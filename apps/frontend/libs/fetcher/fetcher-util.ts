import { ApiExceptionPayload, ExceptionCode } from '@repo/exceptions';
import { FetchApiOptions } from './fetcher-interface';
import { ApiError } from './fetcher';

export function resolveFetchOption(options: FetchApiOptions | undefined): RequestInit {
  const { body, headers, method, accessToken, refreshToken, ...rest } = options || {};

  const isFormData = body instanceof FormData;
  const processedHeaders = { ...headers };
  const processedBody =
    body && typeof body === 'object' && !isFormData ? JSON.stringify(body) : body;

  if (!isFormData && body) {
    Reflect.set(processedHeaders, 'Content-Type', 'application/json; charset=utf-8');
  }

  if (accessToken) {
    Reflect.set(processedHeaders, 'Authorization', `bearer ${accessToken}`);
  }

  if (refreshToken) {
    Reflect.set(processedHeaders, 'Authorization', `bearer ${refreshToken}`);
  }

  return {
    ...rest,
    method: method ? method : 'GET',
    headers: processedHeaders,
    body: processedBody,
    credentials: 'include',
  };
}

export async function responseToJson(response: Response) {
  return await response.clone().json();
}

export async function toApiError(response: Response) {
  let apiError: ApiError | null = null;
  const defaultMessage = '알 수 없는 에러가 발생했습니다.';
  const defaultStatus = 500;
  const defaultCode: ExceptionCode = 'Unknown';

  try {
    const {
      status = defaultStatus,
      code = defaultCode,
      message = defaultMessage,
    }: ApiExceptionPayload = await responseToJson(response);

    apiError = new ApiError(status, code, message);
  } catch (error) {
    apiError = new ApiError(defaultStatus, defaultCode, defaultMessage);
  }

  return apiError;
}
