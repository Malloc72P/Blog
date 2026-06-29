import { render, screen, fireEvent } from '@testing-library/react';
import { CopyButton } from './copy-button';

describe('CopyButton', () => {
  // navigator.clipboard.writeText를 모킹해 클립보드 접근을 제어한다.
  const writeText = jest.fn();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
  });

  it('초기에는 "코드 복사" 라벨의 버튼을 렌더한다', () => {
    render(<CopyButton getContent={() => 'const a = 1;'} />);

    expect(screen.getByRole('button', { name: '코드 복사' })).toBeInTheDocument();
  });

  it('클릭하면 getContent() 결과를 클립보드에 쓰고 "코드 복사됨"으로 피드백한다', async () => {
    render(<CopyButton getContent={() => 'const a = 1;'} />);

    fireEvent.click(screen.getByRole('button', { name: '코드 복사' }));

    // 클립보드에 코드가 그대로 전달되어야 한다.
    expect(writeText).toHaveBeenCalledWith('const a = 1;');
    // 복사 성공 후 라벨이 바뀌어 스크린리더에 결과를 알린다.
    expect(await screen.findByRole('button', { name: '코드 복사됨' })).toBeInTheDocument();
  });

  it('클립보드 쓰기에 실패해도 예외를 던지지 않고 라벨이 유지된다', async () => {
    writeText.mockRejectedValue(new Error('clipboard denied'));
    render(<CopyButton getContent={() => 'const a = 1;'} />);

    fireEvent.click(screen.getByRole('button', { name: '코드 복사' }));

    // 실패는 조용히 흡수되므로 라벨이 "코드 복사" 그대로여야 한다.
    expect(await screen.findByRole('button', { name: '코드 복사' })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalled();
  });
});
