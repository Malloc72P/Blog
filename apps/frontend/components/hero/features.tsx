import {
  Icon3dCubeSphere,
  IconBuildingArch,
  IconCapProjecting,
  IconCookie,
  IconDatabase,
  IconGauge,
  IconLock,
  IconMessage2,
  IconShieldHeart,
  IconUser,
  IconUserScreen,
} from '@tabler/icons-react';
import { Container, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './feature.module.css';

export const MOCKDATA = [
  {
    icon: IconBuildingArch,
    title: '모노 레포(TurboRepo)',
    description:
      '웹 서비스를 만들다 보면, 두 개 이상의 앱을 만들기도 하지요. 그러다 보면, 공통으로 사용해야 하는 모듈이 생기기 마련입니다. Inabase는 공통 모듈을 손쉽게 만들고 여러 앱에서 가져다 쓸 수 있도록 모노레포 구조를 사용합니다.',
  },
  {
    icon: IconDatabase,
    title: 'TypeORM 준비 완료',
    description:
      'TypeORM 관련 설정이 준비되어 있습니다. 저장하고 싶은 엔티티를 정의하기만 하면 됩니다. 또한, 개발에 필요한 데이터베이스를 위한 docker-compose 파일을 함께 제공합니다.',
  },
  {
    icon: IconShieldHeart,
    title: '사용자 인증 준비 완료',
    description:
      'NestJS의 Passport를 통한 간단한 사용자 인증 기능이 구현되어 있습니다. ID/PW 방식 로그인, JWT 토큰 및 리프래시 기능이 제공됩니다.',
  },
  {
    icon: IconUserScreen,
    title: 'Styled Component 준비 완료',
    description: 'Mantine v7이 설치되어 있습니다. 필요한 화면을 바로 구현해보세요.',
  },
  {
    icon: Icon3dCubeSphere,
    title: 'DTO 공통 모듈',
    description:
      '백엔드 API에 대한 파라미터와 응답 결과를 정의한 DTO가 공통모듈로 되어 있습니다. 프론트엔드 앱은 해당 모듈을 통해 API에 대한 입출력에 대해 타입체킹이 가능합니다.',
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon size={18} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>💎 Inabase의 특징</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          NextJS와 NestJS를 사용하는 Inabase는 아래와 같은 특징을 가져요.
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 'xl', md: 50 }}
        verticalSpacing={{ base: 'xl', md: 50 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
