# Blog 프로젝트 가이드

## 프로젝트 구조

- `apps/blog` — 메인 블로그 앱 (Next.js, MDX)
- `packages/` — 공유 패키지 (eslint-config, typescript-config)
- 패키지 매니저: pnpm, 모노레포 빌드: Turbo

## 코딩 규칙

- 코드는 TypeScript 환경에 맞춘다.
- `any` 타입 사용을 지양한다. 테스트 코드에서는 예외적으로 허용하되 불필요한 사용은 피한다.
- non-null assertion(`!`)은 절대 사용하지 않는다. 타입 가드나 타입 좁히기로 해당 상황을 만들지 않는다.
- `object possibly undefined` 오류가 발생하지 않도록 타입 가드 코드를 작성한다.
- 새로운 라이브러리 도입 시 최신 버전을 기준으로 한다.

## 블로그 포스트 작성 가이드

### Frontmatter 설정

모든 포스트는 MDX 파일 상단에 `frontmatter`를 정의해야 한다. `@libs/frontmatter`의 유틸리티 함수를 사용한다.

```tsx
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  title: '포스트 제목',
  description: '포스트에 대한 짧은 요약 (1~2문장)',
  seriesId: '카테고리명 (예: frontend, ai)',
  postId: '포스트-식별자 (파일명과 동일해야 함)',
  tags: ['태그1', '태그2'],
  date: 'YYYY-MM-DD HH:mm',
});
```

주의사항:
- `postId`는 파일 시스템 경로로 사용되므로 **파일 이름과 정확히 일치**해야 한다.
- `date`는 `YYYY-MM-DD HH:mm` 형식을 준수해야 한다.

### 헤딩 구조

- `#` (H1)은 포스트 내에서 한 번만 사용하며 큰 섹션의 시작으로 활용한다. (제목은 metadata의 title 값을 시스템이 사용)
- `##` (H2), `###` (H3)로 논리적인 구조를 잡는다.

### 코드 블록

- 언어 명시를 원칙으로 한다. (예: ` ```typescript `, ` ```json `)
- 필요한 경우 파일 경로를 주석으로 포함한다.

### 이미지 및 미디어

- 이미지는 public 폴더에 위치시키고, 절대 경로로 참조한다. (예: `/image-name.png`)
- `alt` 텍스트를 반드시 작성한다.

### 작문 가이드

- **1인칭 경험 중심 서술**: `나는...`, `저의 경우...` 등 작성자의 실제 경험이 드러나는 관점을 사용한다.
- **메커니즘 중심 설명**: 개념 정의에 그치지 않고, 코드 예시나 설정 값을 통해 실제 작동 방식을 상세히 다룬다.
- **친숙한 비유 사용**: 독자가 이미 아는 개념을 비유로 사용하여 진입 장벽을 낮춘다.
- **과도한 수식어 지양**: "최고의", "압도적인", "혁명적인" 같은 표현을 피하고 담백한 사실 위주로 기술한다.

## 새 포스트 생성 워크플로우

포스트 생성 요청을 받으면 아래 순서로 진행한다.

### 1단계: 파일 생성

경로 형식: `apps/blog/src/app/(main)/posts/[seriesId]/[postId]/page.mdx`

```
apps/blog/src/app/(main)/posts/frontend/my-new-post/page.mdx
```

### 2단계: 기본 템플릿 작성

```tsx
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  title: '제목을 입력하세요',
  description: '설명을 입력하세요',
  seriesId: 'frontend', // 또는 ai 등
  postId: 'my-new-post', // 폴더명과 동일
  tags: [],
  date: '2026-03-23 09:00', // 현재 날짜 기반
});

# 제목

내용을 작성하세요.
```

### 3단계: 내용 작성 후 검토 체크리스트

- [ ] `@libs/frontmatter`가 올바르게 임포트되었는가?
- [ ] `postId`가 폴더명/파일명과 일치하는가?
- [ ] 한국어 문장이 자연스럽고 기술 용어가 정확한가?
- [ ] 모든 코드 예제가 최신 프로젝트 구조를 반영하는가?
- [ ] 빌드 오류 없음: `pnpm run build`
