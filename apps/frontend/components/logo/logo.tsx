'use client';

import { useNavigator } from '@hooks/use-navigator';
import classes from './logo.module.css';

export function Logo() {
  const navigator = useNavigator();

  return (
    <div
      className={classes.logo}
      onClick={() => {
        navigator.moveTo.public.landing();
      }}
    >
      💎 Inabase
    </div>
  );
}
