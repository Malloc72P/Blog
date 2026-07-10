import { fireEvent, render, screen } from '@testing-library/react';
import { MobileToc } from './mobile-toc';
import { TocItem } from './toc';

const toc: TocItem[] = [
  { id: 'intro', value: '소개', level: 2 },
  { id: 'detail', value: '상세', level: 3 },
];

// 시트(dialog)를 감싸는 포털 최상위 요소. 닫힘 상태는 inert 속성으로 판별한다.
function getSheetWrapper() {
  const dialog = screen.getByRole('dialog', { hidden: true });
  const wrapper = dialog.parentElement;
  if (!wrapper) {
    throw new Error('시트 래퍼를 찾을 수 없습니다');
  }
  return wrapper;
}

describe('MobileToc', () => {
  // Toc의 딥링크 효과가 URL 해시를 읽으므로 테스트 간 누수를 막기 위해 초기화한다.
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('목차가 비어 있으면 트리거 버튼을 렌더하지 않는다', () => {
    render(<MobileToc toc={[]} activeId="" onFragIdChanged={() => {}} />);

    expect(screen.queryByRole('button', { name: '목차 열기' })).not.toBeInTheDocument();
  });

  it('처음에는 시트가 닫혀(inert) 있고, 트리거 클릭 시 열린다', () => {
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />);

    const trigger = screen.getByRole('button', { name: '목차 열기' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    // 닫힌 동안에는 시트 내부가 포커스/스크린리더에서 제외되도록 inert여야 한다.
    expect(getSheetWrapper()).toHaveAttribute('inert');

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(getSheetWrapper()).not.toHaveAttribute('inert');
  });

  it('열리면 닫기 버튼으로 포커스가 이동하고, 배경이 inert로 격리된다', () => {
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: '목차 열기' }));

    expect(screen.getByRole('button', { name: '목차 닫기' })).toHaveFocus();
    // useModalA11y가 시트를 제외한 body 직계 자식(RTL 렌더 컨테이너 등)에 inert를 적용해야 한다.
    const wrapper = getSheetWrapper();
    const siblings = Array.from(document.body.children).filter((el) => el !== wrapper);
    expect(siblings.length).toBeGreaterThan(0);
    siblings.forEach((el) => expect(el).toHaveAttribute('inert'));
  });

  it('목차 항목 클릭 시 onFragIdChanged를 호출하고 시트를 닫는다', () => {
    const onFragIdChanged = jest.fn();
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={onFragIdChanged} />);

    const trigger = screen.getByRole('button', { name: '목차 열기' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('link', { name: '소개' }));

    // 스크롤 이동은 부모(scrollToHeading)에 위임하고, 시트는 닫혀야 한다.
    expect(onFragIdChanged).toHaveBeenCalledWith({ fragId: 'intro' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(getSheetWrapper()).toHaveAttribute('inert');
  });

  it('Esc 키로 닫히고 트리거로 포커스가 되돌아간다', () => {
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />);

    const trigger = screen.getByRole('button', { name: '목차 열기' });
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('배경 딤 오버레이 클릭 시 닫힌다', () => {
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />);

    const trigger = screen.getByRole('button', { name: '목차 열기' });
    fireEvent.click(trigger);

    // 딤 오버레이는 dialog 바로 앞 형제(aria-hidden)다.
    const dialog = screen.getByRole('dialog');
    const overlay = dialog.previousElementSibling;
    if (!overlay) {
      throw new Error('딤 오버레이를 찾을 수 없습니다');
    }
    fireEvent.click(overlay);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('활성 항목 정보(activeId)를 Toc에 그대로 전달한다(현재 위치 추적)', () => {
    render(<MobileToc toc={toc} activeId="detail" onFragIdChanged={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: '목차 열기' }));

    expect(screen.getByRole('link', { name: '상세' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: '소개' })).not.toHaveAttribute('aria-current');
  });
});
