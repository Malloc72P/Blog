import { test, expect } from '@playwright/test';

test.describe('다크모드', () => {
  // 기본(시스템) 테마를 light로 고정해 토글 동작을 결정적으로 검증한다.
  test.use({ colorScheme: 'light' });

  test('테마 토글로 다크모드를 켜고 끌 수 있고, 새로고침 후에도 유지된다', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /모드로 전환/ });

    // 초기에는 라이트(html.dark 없음).
    await expect(html).not.toHaveClass(/dark/);

    // 토글 → 다크 적용.
    await toggle.click();
    await expect(html).toHaveClass(/dark/);

    // 새로고침해도 localStorage로 다크가 유지되어야 한다(FOUC 방지 스크립트).
    await page.reload();
    await expect(html).toHaveClass(/dark/);

    // 다시 토글 → 라이트로 복귀.
    await page.getByRole('button', { name: /모드로 전환/ }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
