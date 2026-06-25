import { fireEvent, render, screen } from '@testing-library/react';
import { Toc, TocItem } from './toc';

const toc: TocItem[] = [
  { id: 'intro', value: '소개', level: 2 },
  { id: 'detail', value: '상세', level: 3 },
];

describe('Toc', () => {
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

  it('항목을 클릭하면 기본 이동을 막고 onFragIdChanged로 스크롤 콜백을 호출한다', () => {
    const onFragIdChanged = jest.fn();
    render(<Toc toc={toc} activeId="" onFragIdChanged={onFragIdChanged} />);

    fireEvent.click(screen.getByRole('link', { name: '상세' }));

    expect(onFragIdChanged).toHaveBeenCalledWith({ fragId: 'detail' });
  });
});
