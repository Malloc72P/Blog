# 💎 Inabase

- 보다 더 빠른 서비스 구축을 위한 프로젝트 템플릿, Inabase.

## 설치 및 실행

1. 개발용 DB 컨테이너 생성

```
pnpm dev:db
```

2. dev 모드로 앱 실행

```
pnpm dev
```

- Next, Nest앱을 병렬로 실행합니다.
- 또한 DTO 모듈 빌드를 watch 모드로 실행합니다.

## 간단 소개

- Inabase는 기본적인 NextJS, NestJS 프레임워크 설정을 미리 해놓은 프로젝트입니다.

### Mono Repository(TurboRepo)

- TurboRepo를 통해 Mono Repository로 구성된 프로젝트입니다.
- package manager는 pnpm을 사용합니다.

### NextJS

- 15 버전을 사용하며 앱 라우터를 사용합니다.
- Styled Component를 사용하며, Mantine v7을 사용합니다.
- 전역 상태 라이브러리는 따로 사용하지 않고, React의 Context API를 사용합니다.
- 데이터 조회는 Server Component에서 수행하고, Mutation은 Server Action을 사용합니다.  
  클라이언트에서 직접 조회하는 경우 SWR을 사용합니다.

### NestJS

- TypeORM을 사용해서 DB에 접근합니다. DB는 Postgresql을 사용합니다.
- Passport를 사용해서 사용자 인증 기능을 구현합니다. 템플릿인 만큼 아주 기초적인 ID/PW 방식 인증만 구현 되어 있습니다.
- 개발용 데이터베이스는 docker를 사용합니다.

## 버전 상세정보

### Frontend

| 이름    | version |
| ------- | ------- |
| Next    | ^15.1.0 |
| React   | ^19.0.0 |
| Mantine | ^7.15.2 |
| SWR     | ^2.3.0  |

### Backend

| 이름    | version |
| ------- | ------- |
| Nest    | ^10.0.0 |
| TypeORM | 0.3.20  |

### Database

| 이름       | version |
| ---------- | ------- |
| Postgresql | 15      |

### Common

| 이름      | version |
| --------- | ------- |
| ESLint    | ^9.17.0 |
| Prettier  | ^3.2.5  |
| Turborepo | ^2.3.3  |
| pnpm      | 9.0.0   |
