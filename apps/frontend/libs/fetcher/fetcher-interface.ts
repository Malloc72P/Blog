export type FetchApiOptions<INPUT = any> = Omit<RequestInit, 'body' | 'method'> & {
  body?: INPUT | BodyInit;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  accessToken?: string;
  refreshToken?: string;
} & FetcherAdditionalOption;

export type FetcherAdditionalOption = {
  toastDisabled?: boolean;
};
