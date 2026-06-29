import { test, expect } from '@playwright/test';

test.describe('메인 페이지', () => {
  test('헤더(로고/네비)와 푸터가 렌더된다', async ({ page }) => {
    // 랜딩 페이지로 진입한다.
    await page.goto('/');

    // 다크 헤더와 로고가 보여야 한다(헤더 안에는 메인 로고 + 모바일 사이드바 로고가 있어 first로 한정).
    const header = page.locator('header.blog-main-header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'Malloc72p.Tech' }).first()).toBeVisible();

    // 데스크톱 네비의 Tags 링크가 노출된다.
    await expect(page.getByRole('link', { name: 'Tags' })).toBeVisible();

    // 하단 푸터가 렌더된다.
    await expect(page.locator('footer.blog-main-footer')).toBeVisible();
  });
});
