import { test, expect } from '@playwright/test';

test.describe('포스트 목록 → 상세', () => {
  test('첫 포스트 카드를 클릭하면 상세로 이동하고 제목(h1)과 작성일이 보인다', async ({ page }) => {
    // 랜딩 페이지로 진입한다.
    await page.goto('/');

    // 시리즈 필터 배지도 href가 /posts/{series}(2-세그먼트)이고 클릭 시 네비를 막으므로,
    // 실제 포스트 상세 링크(/posts/{series}/{postId}, 3-세그먼트)만 골라낸다.
    const postLinks = page.locator('.blog-landing-page a[href^="/posts/"]');
    const linkCount = await postLinks.count();
    let firstPostLink: ReturnType<typeof postLinks.nth> | null = null;
    for (let i = 0; i < linkCount; i++) {
      const href = await postLinks.nth(i).getAttribute('href');
      if (href && /^\/posts\/[^/]+\/[^/]+/.test(href)) {
        firstPostLink = postLinks.nth(i);
        break;
      }
    }
    // 포스트 상세 링크가 반드시 존재해야 한다(없으면 타입을 좁히며 실패 처리).
    expect(firstPostLink, '랜딩 목록에 포스트 상세 링크가 있어야 한다').not.toBeNull();
    if (!firstPostLink) return;

    await expect(firstPostLink).toBeVisible();

    // 상세에서 동일성을 검증하기 위해 제목 텍스트를 먼저 확보한다.
    const title = (await firstPostLink.innerText()).trim();
    expect(title.length).toBeGreaterThan(0);

    // 카드를 클릭해 상세로 이동한다.
    await firstPostLink.click();

    // 상세 경로(/posts/{series}/{postId})로 진입했는지 확인한다.
    await expect(page).toHaveURL(/\/posts\/[^/]+\/[^/]+/);

    // 상세 헤더의 h1에 목록에서 본 제목이 포함되어야 한다.
    await expect(page.locator('h1')).toContainText(title);

    // 상세 헤더(post-detail-header)에 작성일(연도 4자리)이 노출되어야 한다.
    await expect(page.locator('header.post-detail-header')).toContainText(/\d{4}/);
  });
});
