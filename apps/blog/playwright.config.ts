import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 설정.
 *
 * - 단위 테스트(jest)는 src의 *.test.ts를 담당하고, E2E는 이 설정으로 e2e 디렉토리만 다룬다.
 * - webServer로 개발 서버를 자동 기동하므로 별도 서버 실행 없이 `pnpm test:e2e`만으로 동작한다.
 */
export default defineConfig({
  // E2E 스펙은 e2e 디렉토리에만 둔다(jest의 src/*.test.ts와 분리).
  testDir: './e2e',
  // dev 모드는 라우트별 최초 진입 시 온디맨드 컴파일이 일어나므로 테스트 타임아웃을 넉넉히 둔다.
  timeout: 60_000,
  // CI에서만 실패 1회 재시도로 일시적 플레이키를 흡수한다(로컬은 즉시 실패가 디버깅에 유리).
  retries: process.env.CI ? 1 : 0,
  // 실패 원인 추적용 리포터. 로컬에서 결과를 바로 열어볼 수 있게 한다.
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    // 모든 테스트가 동일 출처를 바라보도록 기준 URL을 둔다(상대경로 goto 가능).
    baseURL: 'http://localhost:3000',
    // dev 컴파일 지연을 감안해 내비게이션 타임아웃을 여유 있게 잡는다.
    navigationTimeout: 45_000,
    // 첫 재시도부터 trace를 남겨 실패 분석이 가능하게 한다.
    trace: 'on-first-retry',
    // 실패한 테스트에 한해 스크린샷을 저장한다.
    screenshot: 'only-on-failure',
  },
  // 단일 브라우저(Chromium)로 시작한다. 필요해지면 프로젝트를 추가한다.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // 테스트 실행 전 블로그 개발 서버를 자동으로 띄운다.
  webServer: {
    // 프로젝트의 dev 스크립트를 그대로 사용한다(날짜 결정성을 위한 TZ 주입 포함).
    command: 'pnpm dev',
    // dev 서버 기본 포트가 응답하면 준비 완료로 간주한다.
    url: 'http://localhost:3000',
    // 이미 떠 있는 서버가 있으면 재사용해 로컬 반복 실행을 빠르게 한다. CI는 항상 새로 띄운다.
    reuseExistingServer: !process.env.CI,
    // 최초 컴파일/기동 시간을 감안해 서버 대기 타임아웃을 넉넉히 둔다.
    timeout: 180_000,
  },
});
