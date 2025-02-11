import { useAuth } from '@hooks/use-auth';
import { useNavigator } from '@hooks/use-navigator';
import { notifySuccess } from '@hooks/use-notification';
import {
  IconSettings,
  IconSwitchHorizontal,
  IconLogout,
  IconTrash,
  IconHome,
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';

export interface UserMenuModel {
  type: 'button' | 'label' | 'divider';
  label: string;
  icon?: typeof IconSettings;
  color?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function useUserMenuModel() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigator = useNavigator();
  const { logout } = useAuth();

  const onChangeAccountClick = () => {
    navigator.moveTo.auth.login();
  };

  const onLogoutClick = async () => {
    try {
      setIsLoading(true);
      await logout();
      notifySuccess({ title: '로그아웃 성공', message: '로그아웃 되었습니다.' });
      navigator.moveTo.public.landing();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(true);
    }
  };

  const onAccountSettingClick = () => {
    navigator.moveTo.protected.account();
  };

  const onHomeClick = () => {
    navigator.moveTo.protected.main();
  };

  const menuItems = useMemo<UserMenuModel[]>(
    () => [
      { type: 'label', label: 'My Page' },
      {
        type: 'button',
        label: 'Home',
        icon: IconHome,
        onClick: onHomeClick,
      },
      { type: 'label', label: 'Settings' },
      {
        type: 'button',
        label: 'Account settings',
        icon: IconSettings,
        onClick: onAccountSettingClick,
      },
      {
        type: 'button',
        label: 'Change account',
        icon: IconSwitchHorizontal,
        onClick: onChangeAccountClick,
      },
      {
        type: 'button',
        label: 'Logout',
        icon: IconLogout,
        onClick: onLogoutClick,
      },
      { type: 'divider', label: 'divider' },
      {
        type: 'button',
        color: 'red',
        label: 'Delete account',
        icon: IconTrash,
        onClick: () => {},
      },
    ],
    [isLoading]
  );

  return {
    menuItems,
    isLoading,
  };
}
