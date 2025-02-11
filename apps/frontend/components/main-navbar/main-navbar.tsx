'use client';

import { Tabs } from '@mantine/core';
import classes from './main-navbar.module.css';
import { Icon123 } from '@tabler/icons-react';

export const MAIN_NAVBAR_HEIGHT = 48;

export interface INavbarItem {
  label: string;
  value: string;
  icon?: typeof Icon123;
  onClick?: () => void;
}

export interface MainNavbarProps {
  items: INavbarItem[];
  selected?: string;
}

export function MainNavbar({ items, selected }: MainNavbarProps) {
  return (
    <header className="main-navbar">
      <Tabs
        value={selected}
        variant="default"
        classNames={{
          root: classes.navbar,
          list: classes.tabsList,
          tab: classes.tab,
        }}
        px="md"
      >
        <Tabs.List>
          {items.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              onClick={item.onClick}
              leftSection={item.icon && <item.icon strokeWidth={1.5} />}
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </header>
  );
}
