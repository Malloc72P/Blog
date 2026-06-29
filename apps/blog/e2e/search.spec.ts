import { test, expect } from '@playwright/test';

test.describe('검색', () => {
  test('헤더 검색으로 글을 찾아 상세로 이동한다', async ({ page }) => {
    await page.goto('/');

    // 검색 인덱스는 모달을 열 때(open) 처음 fetch되므로, 클릭 전에 응답 대기를 걸어둔다.
    // (인덱스 로드 전에 입력하면 결과가 갱신되지 않으므로 로드 완료를 보장해야 한다.)
    const indexLoaded = page.waitForResponse((res) => res.url().includes('/search-index.json'));

    // 헤더의 검색 버튼으로 모달을 연다.
    await page.getByRole('button', { name: '포스트 검색 열기' }).click();

    const dialog = page.getByRole('dialog', { name: '포스트 검색' });
    await expect(dialog).toBeVisible();

    // 인덱스 로드가 끝난 뒤 질의한다(다수 글 제목에 등장하는 'TypeScript').
    await indexLoaded;
    await dialog.getByRole('combobox').fill('TypeScript');

    // 결과 목록(listbox)에 항목(option)이 하나 이상 나타난다.
    const firstResult = dialog.getByRole('option').first();
    await expect(firstResult).toBeVisible();

    // 첫 결과를 클릭하면 모달이 닫히고 해당 포스트 상세로 이동한다.
    await firstResult.getByRole('link').click();
    await expect(page).toHaveURL(/\/posts\/[^/]+\/[^/]+/);
    await expect(dialog).toBeHidden();
  });
});
