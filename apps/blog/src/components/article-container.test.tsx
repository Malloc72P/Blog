import { render } from '@testing-library/react';
import { Constants } from '@libs/constants';
import { ArticleContainer } from './article-container';

describe('ArticleContainer', () => {
  it('skip 링크 타깃이 되도록 main에 공유 id와 tabIndex=-1을 부여한다', () => {
    const { container } = render(<ArticleContainer>본문</ArticleContainer>);

    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    if (!main) throw new Error('main not found');

    // skip 링크 href와 동일한 공유 상수를 사용해 앵커 계약이 어긋나지 않도록 한다.
    expect(main).toHaveAttribute('id', Constants.a11y.mainContentId);
    expect(main).toHaveAttribute('tabindex', '-1');
  });
});
