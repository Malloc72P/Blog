---
description: 새로운 블로그 포스트 생성 워크플로우
---

새로운 블로그 포스트를 생성하고 기본 구조를 설정하는 워크플로우입니다.

### 1단계: 정보 입력 및 폴더 생성
// turbo
1. 포스트를 작성할 하위 폴더와 파일명을 결정하고 생성합니다.
   - 경로 형식: `apps/blog/src/app/(main)/posts/[seriesId]/[postId]/page.mdx`
   - 예: `mkdir -p apps/blog/src/app/(main)/posts/frontend/my-new-post`

### 2단계: 기본 템플릿 작성
2. 아래 템플릿을 사용하여 `page.mdx` 파일을 생성합니다.
   - 이때 반드시 `.agent/rules/post-writing-guide.md`를 참고하여 `frontmatter`를 채웁니다.

```tsx
import { frontmatter } from '@libs/frontmatter';

export const metadata = frontmatter({
  title: '제목을 입력하세요',
  description: '설명을 입력하세요',
  seriesId: 'frontend', // 또는 ai 등
  postId: 'my-new-post', // 폴더명과 동일
  tags: [],
  date: '2026-02-11 08:30', // 현재 시간 기반
});

# 제목

내용을 작성하세요.
```

### 3단계: 내용 작성 및 검토
3. 내용을 작성한 후 다음 명령어로 린트나 빌드 오류가 없는지 확인합니다.
// turbo
4. 프로젝트 루트에서 빌드 테스트: `pnpm run build`
5. `.agent/rules/post-writing-guide.md`의 검토 체크리스트를 수행합니다.
