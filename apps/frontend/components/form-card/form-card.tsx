'use client';

import { submitHandler } from '@libs/form/createSubmitHandler';
import { Button, Card, Group, Text, TextInput } from '@mantine/core';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import classes from './form-card.module.css';
import { FormModel } from './form-model';
import { ApiError } from '@libs/fetcher';
import { IconCircleX, IconExclamationCircle, IconTrafficCone } from '@tabler/icons-react';
import { Spacer } from '@components/spacer';

export interface FormCardProps extends FormModel {}

export function FormCard({ title, description, onSubmit, defaultValues, inputs }: FormCardProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    defaultValues,
  });
  const [errMessage, setErrMessage] = useState('');

  const _onSubmit = (e: FormEvent) =>
    submitHandler({
      e,
      callback: async () => {
        setLoading(true);
        const values = form.getValues();
        await onSubmit(values);
        setErrMessage('');
      },
      onError: (error) => {
        console.error(error);
        let message = '알 수 없는 에러가 발생헀습니다. 다시 시도하거나 관리자에게 문의해주세요.';

        if (error instanceof ApiError) {
          message = error.message;
        }

        setErrMessage(message);
      },
      onFinally: () => {
        setLoading(false);
      },
    });

  return (
    <form onSubmit={_onSubmit}>
      <Card withBorder shadow="md">
        <Card.Section p={24} withBorder>
          {/* ------ Card Header ------ */}
          <Text size="xl" fw="bold">
            {title}
          </Text>
          <Text py="sm">{description}</Text>

          {/* ------ Card Body ------ */}
          {inputs.map((inputModel) => (
            <TextInput key={inputModel.name} maw={300} {...form.register(inputModel.name)} />
          ))}
        </Card.Section>

        {/* ------ Card Footer ------ */}
        <Card.Section px="lg" py="sm" className={classes.footer}>
          <Group>
            {errMessage && (
              <Text className={classes.errorMsg}>
                <IconExclamationCircle />
                {errMessage}
              </Text>
            )}
            <Spacer />
            <Button type="submit" variant="default" loading={loading}>
              저장
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </form>
  );
}
