# 노션 기반 블로그 포스트 일괄 생성 스킬 (blog-from-notion)

노션에서 블로그로 올릴 만한 주제 N개를 선정하고, 각 주제를 **실제로 돌아가는 예제 + 스크린샷/이미지**가 포함된 **양질의 포스트**로 만들어, **포스트마다 별도 브랜치·워크트리에서 작업하고 PR까지** 올리는 작업을 자동화한다.

이 스킬의 절대 원칙은 세 가지다.

1. **진짜로 돌아가는 예제**: 포스트의 모든 코드는 `playground/` 아래 예제 프로젝트로 실제 실행해 검증한다. 시각 요소는 헤드리스 브라우저로 실제 렌더링해 스크린샷을 찍는다. 출력·수치·이미지는 절대 날조하지 않는다.
2. **AI가 아닌 글쓴이가 쓴 것처럼**: 기존 포스트의 문체를 기준점으로, 1인칭 경험 서술·담백한 존댓말을 유지하고 AI 티(상투적 도입/마무리, 공허한 수식어, 기계적 불릿, 번역체)를 제거한다.
3. **서브에이전트로 최대한 병렬 실행**: 독립적인 일은 무조건 서브에이전트/Workflow로 동시에 띄운다(토큰 비용은 제약이 아니다). 포스트 빌드는 포스트당 1개씩 병렬 백그라운드로, 리뷰는 포스트별 여러 렌즈를 병렬로 fan-out 한다. 한 에이전트가 순차로 처리하면 될 일도 쪼개서 동시에 굴린다. (단, 같은 자원을 만지는 빌드/예제 검증만 충돌 방지를 위해 순차로.)

---

## 입력

`$ARGUMENTS`로 다음을 받는다.

- **포스트 개수 N** (예: `4`). 숫자가 없으면 기본 **3**.
- (선택) 주제 힌트나 시리즈 지정 (예: `4 frontend`, `3 typescript 제네릭 위주`).

`$ARGUMENTS`

예: `/blog-from-notion 4`, `/blog-from-notion 3 frontend`

---

## 진행 절차

각 단계는 verify 체크포인트를 통과해야 다음으로 넘어간다. **서브 에이전트와 Workflow를 적극 활용해 병렬로 처리한다.**

### 0단계: 조사 (병렬)

다음을 병렬로 수집한다.

- **오늘 날짜와 이번 주 계산**: `date`로 오늘을 확인하고, 이번 주(월~일) 안에서 **N개의 서로 다른 날짜**를 고른다. 각 작성 시각은 **20:00~23:59 사이**에서 서로 겹치지 않게, 그리고 **기존 포스트의 `date`와도 충돌하지 않게** 정한다. 형식은 `YYYY-MM-DD HH:mm`.
- **기존 포스트 목록**: `apps/blog/src/app/(main)/posts/*/*/page.mdx`의 title/tags/date를 추출한다. **중복 주제 금지**: 새 주제가 기존 포스트(인접 주제 포함)와 겹치지 않는지 반드시 대조한다.
- **노션 주제 탐색**: 노션 MCP(`notion-search`/`notion-fetch`)로 개발 관련 주제를 찾는다. 특히 일지/아이디어 페이지의 "블로그 아이디어" 목록을 확인한다. 좋은 후보의 조건:
  - 기존 포스트와 겹치지 않는다.
  - **노션에 본인 노트가 충실히 있어** 본인 문체로 정확히 쓸 수 있다(날조 위험이 낮다).
  - 기존 시리즈(`frontend`/`ai`/`fullstack`)와 결이 맞는다.
- **문체 가이드 추출**: Explore 에이전트로 기존 포스트 여러 편(예: `frontend/closure`, `frontend/hoisting`, `frontend/async-in-js`, 이미지 사례 `ai/git-worktree`·`ai/sse-exam`)을 정독해 어조·구조·이미지 삽입 문법·`@libs/frontmatter` API를 정리한다.

### 1단계: 주제 확정 (사용자 확인)

후보 주제를 추려 **AskUserQuestion(multiSelect)**으로 N개를 확정받는다. 각 후보에 "노션 노트 보유 여부 / 기존 포스트와 중복 아님"을 함께 표기한다. 중복 우려가 있으면 명시하고 대안을 제시한다.

### 2단계: 셋업

- **frontmatter API / 이미지 문법 확인**: `@libs/frontmatter`의 `frontmatter({ title, description, seriesId, postId, tags, date })`. 이미지는 마크다운 `![자연스러운 한글 alt](/파일명.png)`로 삽입하고 파일은 해당 워크트리의 `apps/blog/public/`에 둔다.
- **공유 스크린샷 도구 준비**(아래 "재사용 자산" 참고): Playwright 헤드리스 크로미움을 한 번만 설치하고, `shoot.mjs`(HTML→PNG)와 `term-shot.mjs`(터미널 출력→PNG, 한글 폰트 폴백 포함)를 둔다. **반드시 스모크 테스트로 한글/이모지 렌더링을 확인**한 뒤 사용한다.
- **공유 스펙 문서**(STYLE_AND_SPEC) 작성: 빌더들이 따를 작가 페르소나, Anti-AI 체크리스트, 글 구조, frontmatter, 이미지 문법, 스크린샷 도구 사용법, playground 관례, 빌드 검증, 커밋 규칙, 보고 형식.
- **포스트별 워크트리+브랜치 생성**: `git worktree add -b malloc72p/post-<slug> <repo>/.claude/worktrees/post-<slug> main`

### 3단계: 포스트 빌드 (포스트당 서브에이전트, 병렬/백그라운드)

각 빌더는 자기 워크트리 안에서만 작업하며(절대경로 사용, git은 `git -C <워크트리>`), 다음을 수행한다.

1. **예제 프로젝트 생성**: `playground/<예제이름>/` (워크스페이스 밖 독립 프로젝트). `package.json`·소스(`src/`)·`README.md`·`.gitignore`(node_modules/dist/coverage 제외).
2. **실제 실행/검증**: `node`/`jest`/브라우저 등으로 돌려 동작을 확인한다. 시각 요소는 헤드리스 크로미움으로 렌더링해 스크린샷을 찍는다. **실제 출력/측정값만** 본문과 이미지에 사용한다(날조 금지).
3. **이미지 생성**: 다이어그램·차트·터미널 출력·렌더 결과를 PNG로 만들어 `apps/blog/public/`에 저장. 만든 PNG는 Read로 직접 열어 글자 잘림/깨짐을 시각 확인하고 필요하면 재생성한다.
4. **MDX 작성**: 공유 스펙 + 노션 노트 + 검증된 출력/이미지로 본인 문체의 포스트를 쓴다. frontmatter의 `postId`는 폴더명과 정확히 일치, `date`는 0단계에서 배정한 값.
5. **빌드 검증**: 워크트리 루트에서 `pnpm install` 후 `pnpm --filter blog build`로 MDX 컴파일을 통과시킨다. 빌드가 건드린 산출물(`apps/blog/next-env.d.ts`)은 되돌린다.
6. **로컬 커밋**: 포스트 + 예제 + 이미지를 커밋한다(메시지 `Post: ...`). **push/PR은 하지 않는다**(검수 후 오케스트레이터가 수행).
7. **보고**: 파일 경로, 예제 실행 결과 요약, 이미지 목록, build 결과, PR 본문용 1~2문단 요약.

### 4단계: 검증/리뷰 (Workflow, 다단계)

오케스트레이터가 빌더 산출물을 직접 검수(본문 Read + 이미지 Read)한 뒤, **Workflow로 다각도 리뷰**를 돌린다.

- **라운드 A — 품질 렌즈(포스트별 3개 병렬)**
  1. **예제 실행 검증**: 예제를 실제로 다시 돌려 본문의 출력/수치/동작과 대조.
  2. **기술 정확성**: WebSearch/WebFetch로 공식 문서와 대조(공식·Big-O·API·버전 최신성·단정 오류).
  3. **문체·맞춤법·논리·이미지**: 기존 글과 대비해 AI 티/맞춤법/논리 비약/이미지 참조 점검.
- **라운드 B — 페르소나 리뷰(포스트별 3개 병렬)**: **주니어 개발자 / 시니어 개발자 / 기획자(PM)** 관점에서 "어색하거나 잘못됐다고 느낄 요소"를 찾는다.
  - 주니어: 설명 없이 등장하는 전제/용어, 따라 치면 막히는 곳, 단계 점프.
  - 시니어: 틀렸거나 과도하게 단순화한 단정, 빠진 뉘앙스/엣지케이스, 더 정확한 표현.
  - 기획자: 제목·도입의 가치 약속, 흐름/구성, 어색하거나 장황한 문장. (단, 코드를 빼라/쉽게 만들라는 과한 요구는 배제.)
- **보완(fixer)**: 가치 있는 지적만 **surgical하게** 반영한다. 글쓴이 문체와 기술 깊이를 해치지 않으며, **근거가 약하거나 현학적이거나 글을 나쁘게 만들 지적은 근거와 함께 skip**한다. (리뷰어 주장도 틀릴 수 있으니 직접 검증 후 반영/기각을 판단한다.) 수정 후 다시 `pnpm --filter blog build`로 검증하고 `Refine: ...` 커밋을 남긴다.

### 5단계: PR 생성

- 각 브랜치를 push하고 `gh pr create --base main --head <branch>`로 PR을 만든다.
- PR 본문(한국어): `## 개요` / `## 변경 사항`(포스트 경로·작성일, 예제 경로, 이미지) / `## 검증`(실행/측정/빌드 통과). 본문 끝에 `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- 커밋 메시지 끝에는 `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- 마지막에 PR 링크 목록과, 페르소나/품질 리뷰에서 반영·기각한 핵심 내역을 보고한다.

### 6단계: (선택) 후속

- 남은 워크트리/브랜치 정리를 **제안**한다(`git worktree remove`, 브랜치 삭제). 워크트리가 점유 중인 브랜치는 자동 삭제하지 않는다.
- **PR 병합·PR 코멘트·이슈 생성 등 외부 제출은 이 스킬 범위 밖**이다. 사용자가 명시적으로 요청할 때만 수행한다.

---

## 재사용 자산

### 공유 스크린샷 헬퍼 (`shoot.mjs`)

```js
// node shoot.mjs <input(html경로|url)> <output.png> [width] [height] [selector]
import { chromium } from 'playwright';
const [, , input, output, wStr, hStr, selector] = process.argv;
const width = parseInt(wStr || '1200', 10);
const height = parseInt(hStr || '800', 10);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
const url = /^https?:\/\//.test(input) ? input : 'file://' + input;
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
if (selector) await page.locator(selector).screenshot({ path: output });
else await page.screenshot({ path: output });
await browser.close();
```

설치: 임시 도구 폴더에서 `npm i playwright` 후 `npx playwright install chromium`(크로미움은 공용 캐시라 한 번만 받으면 된다).

### 터미널 출력 → PNG (`term-shot.mjs`)

콘솔/테스트 출력을 "터미널 창" 이미지로 만든다. **모노스페이스 폰트에 한글 글리프가 없으면 `?`(두부)로 깨지므로**, `font-family`에 CJK 폰트 폴백(`'Apple SD Gothic Neo'`, `'Noto Sans CJK KR'`)을 반드시 포함한다. 입력 텍스트는 ANSI 색코드를 제거하고 `&`/`<`/`>`를 escape한 뒤 `<pre>`에 넣어 `shoot.mjs`로 캡처한다. **실제 실행 출력만** 사용한다.

### 이미지 종류 가이드

- 개념 다이어그램(예: 체인/메모리 레이아웃): HTML/SVG로 그려 캡처.
- 데이터 차트(예: 벤치마크): **실측값**으로 막대그래프 HTML을 만들어 캡처.
- 터미널 결과(예: 테스트 통과/커버리지): `term-shot.mjs`로 실제 출력 캡처.
- 시각 결과물(예: 지도 렌더): 실제 브라우저 렌더 화면 캡처(필요 시 hover 등 상태별 2장).

---

## 가드레일 (반드시 지킬 것)

- **작성일**: 이번 주 / 20시 이후 / 서로·기존과 겹치지 않게.
- **포스트당 별도 브랜치+워크트리**, 1개 워크트리에 1포스트+예제+이미지.
- **실측/실행 결과만** 사용. 수치·출력·이미지 날조 금지.
- **본인 문체 유지**, Anti-AI 규칙 준수. 보완은 surgical하게, 과한 재작성 금지.
- **서브에이전트를 최대한 병렬로 활용**: 빌드는 포스트당 1개씩 병렬 백그라운드, 리뷰는 포스트별 다중 렌즈를 Workflow로 fan-out. 토큰을 아끼려 순차로 처리하지 말 것. 단, 같은 자원을 건드리는 빌드/예제 검증만 충돌 방지를 위해 순차로.
- **외부 제출 금지**(머지·코멘트·이슈): 사용자가 명시 요청할 때만. PR **생성**까지가 기본 범위.
- `non-null assertion(!)`·불필요한 `any` 금지 등 프로젝트 코딩 규칙(`CLAUDE.md`) 준수.

---

## 완료 체크리스트

- [ ] N개 주제를 노션에서 선정하고 사용자에게 확정받았는가(중복 없음 확인)?
- [ ] 각 포스트에 **실제로 돌아가는 예제**가 `playground/`에 있고 검증했는가?
- [ ] 스크린샷/이미지가 실제 결과 기반이고 깨짐 없이 본문에 삽입됐는가?
- [ ] 작성일이 이번 주·20시 이후·중복 없음인가?
- [ ] 포스트마다 별도 브랜치·워크트리에서 작업했는가?
- [ ] 빌드·리뷰를 서브에이전트/Workflow로 **최대한 병렬** 실행했는가(순차로 늘어뜨리지 않았는가)?
- [ ] 품질 리뷰 + 주니어/시니어/기획자 페르소나 리뷰를 거쳐 보완했는가?
- [ ] `pnpm --filter blog build`가 각 포스트에서 통과하는가?
- [ ] PR이 생성되고(머지 아님) 링크와 리뷰 내역을 보고했는가?
