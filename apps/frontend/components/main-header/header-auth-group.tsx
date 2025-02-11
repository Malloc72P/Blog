import { UserMenuDropdown } from '@components/user-menu';
import { useNavigator } from '@hooks/use-navigator';
import { Button, Group, Skeleton } from '@mantine/core';
import { ProfileContext } from 'app/providers/auth-session-provider';
import { useContext } from 'react';

export function PublicAuthGroup() {
  return (
    <>
      <LoginButton />
      <SignUpButton />
    </>
  );
}

export function ProtectedAuthGroup() {
  const { profile } = useContext(ProfileContext);

  return (
    <Group visibleFrom="sm" justify="end">
      <UserMenuDropdown profile={profile} />
    </Group>
  );
}

export function LoginButton() {
  const navigator = useNavigator();

  return (
    <Button variant="default" h={34} onClick={navigator.moveTo.auth.login}>
      Log in
    </Button>
  );
}

export function SignUpButton() {
  const navigator = useNavigator();

  return (
    <Button h={34} onClick={navigator.moveTo.auth.signup}>
      Sign up
    </Button>
  );
}

export function HeaderAuthGroupLoading() {
  return (
    <Group gap="md">
      <Skeleton w={76} h={34}></Skeleton>
      <Skeleton w={86} h={34}></Skeleton>
    </Group>
  );
}
