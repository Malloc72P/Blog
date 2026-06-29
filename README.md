# Blog

- Malloc72P의 블로그입니다
- Next.js `15.5.7` 버전으로 개발했습니다.
- CSS 라이브러리는 Tailwind를 사용했습니다
- Figma를 사용하여 직접 디자인하였습니다
- Monorepo 구조입니다. 블로그 앱은 apps/blog에서 확인하실 수 있습니다.

## Tip

### 블로그 라우팅

- 모든 페이지는 main 라우트 그룹 밑에 있습니다.
- 블로그 게시글에 해당하는 post는 posts 라우트 밑에 있습니다.
  - 모든 post는 series라는 카테고리 밑에 존재합니다. 카테고리로 묶이는 식 입니다.
  - ex. blog-making-series 시리즈의 step1, step2 post.
  - series 바로 밑의 page.tsx는 시리즈의 랜딩페이지 입니다.
  - series에 대한 추가 설명을 작성하거나 커스터마이징하고 싶다면, 해당 서버 컴포넌트를 수정하면 됩니다.
  - post는 mdx로 작성합니다. series 밑에 post 이름의 폴더를 만들고, 그 안에 page.mdx를 작성하면 됩니다.

### 포스트 Frontmatter

- Post의 메타 정보는 Frontmatter를 사용해서 작성합니다.
- 예시  
    ```ts
    export const metadata = {
    title: '게시글 예시',
    series: 'example',
    tags: ['Next.js', 'Vercel'],
    date: '2025-03-06 21:20',
    };
    ```
- 블로그 개발에 따라 필요한 메타 정보는 변경될 수 있는 점에 주의해주세요.

### 게시글(Post) 페이지 랜더링

- Next.js의 mdx기능으로 페이지를 랜더링합니다.
- mdx-components에서 export하는 useMDXComponents 함수를 사용하여 mdx 페이지를 랜더링합니다.
- mdx 페이지는 mdxWrapper로 감싸져 있습니다.
- 페이지에서 포스트, 시리즈, 태그 모델 정보를 조회하려는 경우, MainLayoutContext를 통해 조회할 수 있습니다.

### Type

- 게시글, 태그, 시리즈의 타입은 각각 아래와 같습니다.
  - PostModel
  - TagModel
  - SeriesModel
- 서버 컴포넌트는 조회한 데이터를 Props로 전달할 때, 위와 같은 타입으로 변환해서 넘겨야 합니다. 
  - 하위 컴포넌트는 위의 타입에 의존하기 때문에, 서버 컴포넌트에서 조회한 데이터를 가공해서 위의 타입으로 맞춰주고 있습니다.
  - 혹시라도 Next.js API가 변경되더라도 서버 컴포넌트에서 가공하는 코드만 변경하면 해결되도록 하기 위해서 위와 같이 작업중입니다.
- 조회한 데이터를 위의 타입으로 변환하는 Mapper 객체가 있습니다.
  - apps/blog/src/libs/mapper.ts에 있습니다.

## 테스트

블로그 앱(`apps/blog`)은 단위 테스트(Jest)와 E2E 테스트(Playwright)를 갖추고 있습니다.

### 단위 테스트 (Jest)

- `next/jest`(SWC 변환) 기반이며, `src` 하위의 `*.test.ts`를 실행합니다.
- 주요 대상은 `src/libs`의 순수 로직(frontmatter, mapper, find-posts 등)입니다.

```bash
pnpm --filter blog test           # 1회 실행
pnpm --filter blog test:watch     # 변경 감지 실행
pnpm --filter blog test:coverage  # 커버리지 포함
```

### E2E 테스트 (Playwright)

- `e2e` 디렉토리의 시나리오를 Chromium에서 실행합니다.
- `playwright.config.ts`의 `webServer` 설정이 개발 서버(`pnpm dev`)를 자동으로 띄우므로, 별도 서버 실행 없이 바로 돌릴 수 있습니다.
- 최초 1회 브라우저 설치가 필요합니다: `pnpm --filter blog exec playwright install chromium`

```bash
pnpm --filter blog test:e2e       # 헤드리스 실행
pnpm --filter blog test:e2e:ui    # UI 모드(디버깅)
```

- 실패한 테스트는 스크린샷과 trace를 `apps/blog/test-results`에 남깁니다(git에는 포함되지 않습니다).
