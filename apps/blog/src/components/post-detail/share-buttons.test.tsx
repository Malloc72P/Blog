import { render, screen, fireEvent } from '@testing-library/react';
import { ShareButtons } from './share-buttons';

const url = 'https://blog.malloc72p.com/posts/frontend/my-post';
const title = '내 포스트 제목';

describe('ShareButtons', () => {
  const writeText = jest.fn();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    // 기본 환경(jsdom)에는 navigator.share가 없다고 가정한다.
    Object.assign(navigator, { share: undefined });
  });

  it('링크 복사 버튼과 X 공유 링크(인텐트 URL)를 렌더한다', () => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole('button', { name: '링크 복사' })).toBeInTheDocument();

    const xLink = screen.getByRole('link', { name: 'X(트위터)에 공유' });
    expect(xLink).toHaveAttribute(
      'href',
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    );
    // 새 탭 + 안전한 rel을 보장한다.
    expect(xLink).toHaveAttribute('target', '_blank');
    expect(xLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('링크 복사 클릭 시 canonical URL을 클립보드에 쓰고 "복사됨"으로 피드백한다', async () => {
    render(<ShareButtons url={url} title={title} />);

    fireEvent.click(screen.getByRole('button', { name: '링크 복사' }));

    expect(writeText).toHaveBeenCalledWith(url);
    expect(await screen.findByRole('button', { name: '링크 복사됨' })).toBeInTheDocument();
  });

  it('navigator.share 미지원 환경에서는 네이티브 공유 버튼을 노출하지 않는다', () => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.queryByRole('button', { name: '공유하기' })).not.toBeInTheDocument();
  });

  it('navigator.share 지원 환경에서는 네이티브 공유 버튼을 노출한다', () => {
    Object.assign(navigator, { share: jest.fn().mockResolvedValue(undefined) });
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole('button', { name: '공유하기' })).toBeInTheDocument();
  });
});
