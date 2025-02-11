'use client';

import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import classes from './theme-toggler.module.css';

export function ThemeToggler() {
  const { toggleColorScheme } = useMantineColorScheme();

  const onTogglerClick = () => {
    toggleColorScheme();
  };

  return (
    <ActionIcon variant="default" size="lg" onClick={onTogglerClick}>
      <IconSun className={classes.light} width="80%" height="80%" stroke={1.5} />
      <IconMoon className={classes.dark} width="80%" height="80%" stroke={1.5} />
    </ActionIcon>
  );
}
