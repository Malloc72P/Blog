'use client';

import { FormCard } from '@components/form-card';
import { notifySuccess } from '@hooks/use-notification';
import { useProfile } from '@hooks/use-profile';
import { ProfileResult, UpdateProfileInput, UpdateProfileOutput } from '@repo/dto';
import { ProfileContext } from 'app/providers/auth-session-provider';
import { useContext } from 'react';

export interface AccountNameFormProps {
  profile: ProfileResult;
}

export function AccountNameForm({ profile }: AccountNameFormProps) {
  const { updateProfile } = useProfile();
  const { setProfile } = useContext(ProfileContext);

  const onSubmit = async (values: UpdateProfileInput) => {
    const updateResult = await updateProfile({
      id: profile.id,
      name: values.name,
    });

    setProfile(updateResult.profile);

    notifySuccess({
      title: '저장 완료.',
      message: 'Display Name이 수정되었습니다.',
    });
  };

  return (
    <FormCard
      title="Display Name"
      description="다른 사용자에게 보여질 이름을 적어주세요."
      onSubmit={onSubmit}
      defaultValues={{ name: profile.name }}
      inputs={[{ name: 'name' }]}
    />
  );
}
