# dev.to 영문 요약 포스트 생성 스킬

블로그 포스트(MDX)를 읽고, dev.to에 게시할 영문 번역 글을 생성한다.
생성된 마크다운은 임시 파일(.md)을 생성하고 그 안에 작성한다.

---

## 입력

`$ARGUMENTS`로 대상 포스트의 경로를 받는다.

- 전체 경로 예시: `apps/blog/src/app/(main)/posts/frontend/closure/page.mdx`
- 축약 경로 예시: `frontend/closure` (seriesId/postId만 전달)

축약 경로를 받으면 `apps/blog/src/app/(main)/posts/{축약경로}/page.mdx`로 확장한다.

---

## 실행 절차

### 1단계: 원문 읽기

대상 MDX 파일을 읽고 아래 정보를 추출한다:

- `title` (frontmatter)
- `description` (frontmatter)
- `seriesId`, `postId` (frontmatter)
- `tags` (frontmatter)
- 본문의 핵심 내용 (개념 설명, 코드 예시)

### 2단계: 영문 번역 글 생성

아래 템플릿에 따라 dev.to용 마크다운을 생성한다.

```markdown
---
title: "{영문 제목}"
published: false
description: "{영문 설명 1~2문장}"
tags: {원문 태그를 영문으로 변환, 최대 4개, 쉼표 구분}
canonical_url: {원본 블로그 페이지 링크 ex: https://blog.malloc72p.com/posts/ai/sse-exam}
---

Note: This post is a translated version of an article originally published on my personal blog. You can read the [original Korean post here](https://blog.malloc72p.com/posts/ai/sse-exam).

{영문 번역된 내용을 여기에 작성}

👉 **[Read the full post on my blog](https://blog.malloc72p.com/posts/{seriesId}/{postId})**
```

### 3단계: 작성 규칙

- **제목**: 원문 제목을 직역하지 않고, dev.to 독자가 클릭할 만한 자연스러운 영문 제목으로 의역한다.
- **백링크**: 반드시 `https://blog.malloc72p.com/posts/{seriesId}/{postId}` 형식을 사용한다.
- **어조**: 캐주얼하되 전문적. dev.to 커뮤니티 톤에 맞춘다.
- **published**: 항상 `false`로 설정한다. 사용자가 직접 dev.to에서 검토 후 게시한다.
- **영문 번역된 내용**: 어색하지 않도록 잘 번역한다.

### 4단계: 출력

생성된 마크다운은 임시 파일(.md)을 생성하고 그 안에 작성한다.

---

## 체크리스트 (생성 후 확인)

- [ ] dev.to frontmatter(title, published, description, tags, cannonical)가 올바른가?
- [ ] 백링크 URL이 `https://blog.malloc72p.com/posts/{seriesId}/{postId}` 형식인가?
- [ ] tags가 소문자인가?
- [ ] published가 false인가?
- [ ] 자연스러운 영문인가? (직역체 아닌지 확인)

---

## 사용 방법

요청 예시:
- `/devto frontend/closure`
- `/devto frontend/monorepo`
- `/devto apps/blog/src/app/(main)/posts/frontend/closure/page.mdx`

$ARGUMENTS
