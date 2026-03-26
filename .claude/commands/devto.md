# dev.to 영문 요약 포스트 생성 스킬

블로그 포스트(MDX)를 읽고, dev.to에 게시할 영문 요약 글을 생성한다.
생성된 마크다운은 클립보드에 복사한다.

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

### 2단계: 영문 요약 글 생성

아래 템플릿에 따라 dev.to용 마크다운을 생성한다.

```markdown
---
title: "{영문 제목}"
published: false
description: "{영문 설명 1~2문장}"
tags: {원문 태그를 영문으로 변환, 최대 4개, 쉼표 구분}
---

## TL;DR

{원문의 핵심 내용을 3~5개 불릿으로 요약}

## Key Concepts

{원문의 주요 개념을 간결하게 영문으로 설명. 2~3개 소제목(###) 사용 가능}

## Code Examples

{원문에서 가장 핵심적인 코드 예시 1~2개를 선별하여 포함.
코드 블록 앞뒤에 간단한 영문 설명을 붙인다.
코드 자체는 원문 그대로 유지하되, 주석만 영문으로 번역한다.}

---

*This is a summary of my original post written in Korean.*
*For the full article with detailed explanations and more examples, check out the original:*

👉 **[Read the full post on my blog](https://blog.malloc72p.com/posts/{seriesId}/{postId})**
```

### 3단계: 작성 규칙

- **제목**: 원문 제목을 직역하지 않고, dev.to 독자가 클릭할 만한 자연스러운 영문 제목으로 의역한다.
- **설명**: SEO를 고려하여 핵심 키워드를 포함한 1~2문장으로 작성한다.
- **태그**: dev.to 태그 규칙에 맞게 소문자, 공백 없이 작성한다. 최대 4개.
- **TL;DR**: 원문을 읽지 않아도 핵심을 파악할 수 있도록 3~5개 불릿으로 요약한다.
- **Key Concepts**: 원문의 "무엇(개념)" 부분을 중심으로 간결하게 정리한다. 깊은 설명은 생략하고 핵심만.
- **Code Examples**: 원문에서 가장 대표적인 코드 1~2개만 선별한다. 코드가 너무 길면 핵심 부분만 발췌한다.
- **백링크**: 반드시 `https://blog.malloc72p.com/posts/{seriesId}/{postId}` 형식을 사용한다.
- **어조**: 캐주얼하되 전문적. dev.to 커뮤니티 톤에 맞춘다.
- **분량**: 전체 글이 읽는 데 2~3분을 넘지 않도록 간결하게 유지한다.
- **published**: 항상 `false`로 설정한다. 사용자가 직접 dev.to에서 검토 후 게시한다.

### 4단계: 출력

생성된 마크다운 전문을 사용자에게 보여준다.
pbcopy 명령어로 클립보드에 복사한다.

---

## 체크리스트 (생성 후 확인)

- [ ] dev.to frontmatter(title, published, description, tags)가 올바른가?
- [ ] TL;DR이 원문 핵심을 정확히 요약하는가?
- [ ] 코드 예시가 원문에서 가장 대표적인 것인가?
- [ ] 코드 내 주석이 영문으로 번역되었는가?
- [ ] 백링크 URL이 `https://blog.malloc72p.com/posts/{seriesId}/{postId}` 형식인가?
- [ ] tags가 4개 이하이고 소문자인가?
- [ ] published가 false인가?
- [ ] 자연스러운 영문인가? (직역체 아닌지 확인)

---

## 사용 방법

요청 예시:
- `/devto frontend/closure`
- `/devto frontend/monorepo`
- `/devto apps/blog/src/app/(main)/posts/frontend/closure/page.mdx`

$ARGUMENTS
