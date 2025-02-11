export type ExceptionCode = 'Unknown' | 'EmailAlreadyInUse' | 'LoginFailed' | 'AccessTokenExpired';

export interface ApiExceptionPayload {
  code: ExceptionCode;
  status: number;
  message: string;
}
