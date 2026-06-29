import { test, expect } from '@playwright/test';

test.describe('존재하지 않는 경로', () => {
  test('없는 URL은 404 상태와 404 화면을 반환한다', async ({ page }) => {
    // 존재할 수 없는 경로로 진입한다.
    const response = await page.goto('/this-route-does-not-exist-xyz');

    // HTTP 응답 상태가 404여야 한다(가장 안정적인 계약).
    expect(response?.status()).toBe(404);

    // 화면에 404가 노출되어야 한다.
    await expect(page.locator('body')).toContainText('404');

    // 커스텀 404(#93): 헤더와 복구 동선(홈으로/전체 태그)이 포함되어야 한다.
    await expect(page.locator('header.blog-main-header')).toBeVisible();
    await expect(page.getByRole('link', { name: '홈으로' })).toBeVisible();
    await expect(page.getByRole('link', { name: '전체 태그' })).toBeVisible();
  });
});
