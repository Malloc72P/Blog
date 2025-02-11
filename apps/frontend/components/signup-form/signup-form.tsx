'use client';

import { useAuth } from '@hooks/use-auth';
import { useNavigator } from '@hooks/use-navigator';
import { notifyError, notifySuccess } from '@hooks/use-notification';
import { ApiError } from '@libs/fetcher';
import { submitHandler } from '@libs/form/createSubmitHandler';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { SignUpParam } from '@repo/dto';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import classes from './signup-form.module.css';

export function SignupForm() {
  const form = useForm<SignUpParam & { passwordConfirm: string }>();
  const navigator = useNavigator();
  const { signup } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) =>
    submitHandler({
      e,
      callback: async () => {
        setLoading(true);
        const { passwordConfirm, ...input } = form.getValues();

        if (input.password !== passwordConfirm) {
          notifyError({
            title: '회원가입 실패!',
            message: '패스워드가 일치하지 않습니다. 다시 확인해주세요.',
          });
        }

        await signup(input);

        setErrorMsg('');

        notifySuccess({
          title: '회원가입 성공!',
          message: '회원가입되었습니다. 입력하신 정보로 로그인해주세요.',
        });

        navigator.moveTo.auth.login();
      },
      onError: (error) => {
        let errorMessage = '알 수 없는 에러가 발생했습니다. 관리자에게 문의해주세요.';

        if (error instanceof ApiError) {
          errorMessage = error.message;
        }

        setErrorMsg(errorMessage);
      },
      onFinally: () => {
        setLoading(false);
      },
    });

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        회원가입
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        서비스 이용에 필요한 프로필 정보를 입력해주세요. <br />
        계정이 이미 있으신 경우,{' '}
        <Anchor size="sm" component="button" onClick={navigator.moveTo.auth.login}>
          로그인 페이지
        </Anchor>
        로 이동해주세요.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={onSubmit}>
          <TextInput label="닉네임" required {...form.register('name')} />
          <TextInput label="이메일" mt="md" required {...form.register('email')} />
          <PasswordInput label="비밀번호" required mt="md" {...form.register('password')} />
          <PasswordInput
            label="비밀번호 확인"
            required
            mt="md"
            {...form.register('passwordConfirm')}
          />

          {errorMsg && (
            <Text c="red" size="sm" className={classes.error} mt="xl">
              {errorMsg}
            </Text>
          )}

          <Button mt="xl" fullWidth type="submit" loading={loading}>
            회원가입
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
