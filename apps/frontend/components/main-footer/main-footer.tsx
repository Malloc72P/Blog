'use client';

import { Logo } from '@components/logo';
import { useNavigator } from '@hooks/use-navigator';
import { ActionIcon, Container, Group, Text } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import classes from './main-footer.module.css';
import { useRouter } from 'next/navigation';

const data = [
  {
    title: 'About',
    links: [{ label: "Malloc72P's Github", link: 'https://github.com/Malloc72P' }],
  },
];

export function MainFooter() {
  const navigator = useNavigator();

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'> key={index} className={classes.link} component="a" href={link.link}>
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Logo />
          <Text size="xs" c="dimmed" className={classes.description}>
            보다 더 빠른 서비스 구축을 위한 프로젝트 템플릿 Inabase.
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2025 Malloc72P All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            onClick={navigator.moveTo.external.malloc72pGithub}
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
