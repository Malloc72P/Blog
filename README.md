# Blog

- Malloc72P의 블로그입니다
- Nextra `4.2.7` 버전으로 개발했습니다.
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
    title: 'Nextjs로 블로그 만들기 시리즈 Part 2. 프레임워크 선정',
    series: 'blog-making-series',
    tags: ['Next.js', 'Nextra', 'Vercel'],
    date: '2025-03-06 21:20',
    };
    ```
- 블로그 개발에 따라 필요한 메타 정보는 변경될 수 있는 점에 주의해주세요.

### 게시글(Post) 페이지 랜더링

- Nextra는 프로젝트 루트(apps/blog)의 mdx-components에서 export하는 useMDXComponents 함수를 사용하여 mdx 페이지를 랜더링합니다.
- 즉, 해당 함수에서 정의한대로 게시글(Post) 페이지를 랜더링합니다. 
- 만약 게시글 페이지를 수정하고 싶다면, useMDXComponents에서 사용하는 defaultComponents를 수정하면 됩니다.
  - 더 필요한 데이터가 있다면 wrapper 함수에서 추가로 조회하고 props로 넘기면 됩니다.
  - 컴포넌트를 수정하고 싶다면 PostDetail 컴포넌트를 수정하면 됩니다.

### Type

- 게시글, 태그, 시리즈의 타입은 각각 아래와 같습니다.
  - PostModel
  - TagModel
  - SeriesModel
- 서버 컴포넌트는 조회한 데이터를 Props로 전달할 때, 위와 같은 타입으로 변환해서 넘겨야 합니다. 
  - 하위 컴포넌트는 위의 타입에 의존하기 때문에, 서버 컴포넌트에서 조회한 데이터를 가공해서 위의 타입으로 맞춰주고 있습니다.
  - 혹시라도 Nextra API가 변경되더라도 서버 컴포넌트에서 가공하는 코드만 변경하면 해결되도록 하기 위해서 위와 같이 작업중입니다.
- Nextra API를 통해 조회한 데이터를 위의 타입으로 변환하는 Mapper 객체가 있습니다.
  - apps/blog/src/libs/mapper.ts에 있습니다.
