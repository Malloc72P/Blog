import { fireEvent, render, screen } from '@testing-library/react';
import { Toc, TocItem } from './toc';

const toc: TocItem[] = [
  { id: 'intro', value: '소개', level: 2 },
  { id: 'detail', value: '상세', level: 3 },
];

describe('Toc', () => {
  // replaceState가 URL 해시를 바꾸므로 테스트 간 누수를 막기 위해 초기화한다.
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('각 목차 항목을 href를 가진 링크로 렌더한다(키보드/딥링크 접근)', () => {
    render(<Toc toc={toc} activeId="intro" onFragIdChanged={() => {}} />);

    expect(screen.getByRole('link', { name: '소개' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: '상세' })).toHaveAttribute('href', '#detail');
  });

  it('활성 항목에만 aria-current="location"을 부여한다', () => {
    render(<Toc toc={toc} activeId="intro" onFragIdChanged={() => {}} />);

    expect(screen.getByRole('link', { name: '소개' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: '상세' })).not.toHaveAttribute('aria-current');
  });

  it('클릭하면 기본 이동을 막고 onFragIdChanged 호출 + URL 해시를 동기화한다', () => {
    const onFragIdChanged = jest.fn();
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    render(<Toc toc={toc} activeId="" onFragIdChanged={onFragIdChanged} />);

    // fireEvent.click은 preventDefault가 호출되면 false를 반환한다(네이티브 점프 차단 검증).
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: '상세' }));
    expect(notPrevented).toBe(false);

    expect(onFragIdChanged).toHaveBeenCalledWith({ fragId: 'detail' });
    expect(replaceSpy).toHaveBeenCalledWith(null, '', '#detail');
    expect(window.location.hash).toBe('#detail');

    replaceSpy.mockRestore();
  });

  it('같은 항목을 다시 클릭해도 매번 스크롤 콜백이 호출된다(멱등성 회귀 방지)', () => {
    const onFragIdChanged = jest.fn();
    render(<Toc toc={toc} activeId="" onFragIdChanged={onFragIdChanged} />);

    const link = screen.getByRole('link', { name: '상세' });
    fireEvent.click(link);
    fireEvent.click(link);

    // state를 경유하지 않으므로 동일 항목 연속 클릭에도 두 번 모두 호출된다.
    expect(onFragIdChanged).toHaveBeenCalledTimes(2);
  });

  // 해시 딥링크 스크롤은 PostDetail로 승격되어(#85 리뷰) post-detail.test.tsx에서 검증한다.
});
