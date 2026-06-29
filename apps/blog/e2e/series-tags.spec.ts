import { test, expect } from '@playwright/test';

test.describe('시리즈 / 태그 탐색', () => {
  test('시리즈 페이지에 해당 시리즈 포스트 목록이 보인다', async ({ page }) => {
    // frontend 시리즈 랜딩으로 진입한다.
    await page.goto('/posts/frontend');

    // 공통 헤더가 렌더되어야 한다.
    await expect(page.locator('header.blog-main-header')).toBeVisible();

    // 해당 시리즈의 포스트 상세로 가는 링크가 하나 이상 노출된다.
    await expect(page.locator('a[href^="/posts/frontend/"]').first()).toBeVisible();
  });

  test('태그 인덱스에서 태그를 클릭하면 태그 상세로 이동한다', async ({ page }) => {
    // 전체 태그 인덱스로 진입한다.
    await page.goto('/tags');

    // 페이지 제목(h1)이 Tags여야 한다.
    await expect(page.locator('h1')).toContainText('Tags');

    // 첫 번째 태그 배지를 클릭한다(헤더/사이드바의 태그 링크와 섞이지 않도록 본문 article로 한정).
    const firstTag = page.locator('article a[href^="/tags/"]').first();
    await expect(firstTag).toBeVisible();
    await firstTag.click();

    // 태그 상세 경로(/tags/{tag})로 진입했는지 확인한다.
    await expect(page).toHaveURL(/\/tags\/.+/);
  });
});
