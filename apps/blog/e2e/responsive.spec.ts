import { test, expect } from '@playwright/test';

test.describe('모바일 반응형', () => {
  // 모바일 폭(iPhone 12 수준)으로 뷰포트를 고정한다.
  test.use({ viewport: { width: 390, height: 844 } });

  test('모바일에서 데스크톱 네비는 숨고, 햄버거로 사이드바를 열 수 있다', async ({ page }) => {
    // 랜딩 페이지로 진입한다.
    await page.goto('/');

    // 데스크톱 전용 Tags 네비 링크는 md 미만에서 숨겨져야 한다.
    await expect(page.getByRole('link', { name: 'Tags' })).toBeHidden();

    // 햄버거(메뉴) 버튼을 눌러 사이드바를 연다(#87에서 추가된 접근성 라벨 사용).
    await page.getByRole('button', { name: '메뉴 열기' }).click();

    // 닫혀 있을 땐 화면 밖(translate-x-full)에 있던 사이드바 패널(dialog)이
    // 열린 뒤에는 뷰포트 안으로 들어와야 한다(패널이 실제로 슬라이드인됐음을 검증).
    const sidebar = page.getByRole('dialog', { name: '사이트 메뉴' });
    await expect(sidebar).toBeInViewport();
  });
});
