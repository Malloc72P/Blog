import { notifyError } from '@hooks/use-notification';
import { ApiError } from '@libs/fetcher';
import { FormEvent } from 'react';

export interface CreateSubmitHandlerInput {
  e: FormEvent;
  callback: () => Promise<void>;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

export async function submitHandler({ e, callback, onError, onFinally }: CreateSubmitHandlerInput) {
  e.preventDefault();
  try {
    await callback();
  } catch (error) {
    onError ? onError(error) : handleError(error);
  } finally {
    onFinally && onFinally();
  }
}

function handleError(error: unknown) {
  if (error instanceof ApiError) {
    notifyError({
      title: 'Error!',
      message: error.message,
    });
  } else {
    notifyError({
      title: '알 수 없는 문제가 발생했습니다.',
      message: '문제가 계속되면 관리자에게 문의해주세요.',
    });
  }
}
