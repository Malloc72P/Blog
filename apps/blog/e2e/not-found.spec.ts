import { test, expect } from '@playwright/test';

test.describe('존재하지 않는 경로', () => {
  test('없는 URL은 404 상태와 404 화면을 반환한다', async ({ page }) => {
    // 존재할 수 없는 경로로 진입한다.
    const response = await page.goto('/this-route-does-not-exist-xyz');

    // HTTP 응답 상태가 404여야 한다(가장 안정적인 계약).
    expect(response?.status()).toBe(404);

    // 화면에 404가 노출되는지 확인한다. Next 내부 문구 전체에 의존하지 않도록 "404"만 검증한다.
    // (커스텀 404는 별도 이슈 #93)
    await expect(page.locator('body')).toContainText('404');
  });
});
