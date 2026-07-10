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

// jsdom은 scrollIntoView를 구현하지 않으므로 목으로 대체한다(열림 시 활성 항목 노출 effect가 호출).
const scrollIntoViewMock = jest.fn();

beforeAll(() => {
  Element.prototype.scrollIntoView = scrollIntoViewMock;
});

describe('MobileToc', () => {
  // 링크 클릭이 URL 해시를 바꾸므로 테스트 간 누수를 막기 위해 초기화한다.
  afterEach(() => {
    window.history.replaceState(null, '', '/');
    scrollIntoViewMock.mockClear();
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

  it('포커스가 시트 밖(body)으로 빠져도 Esc로 닫힌다(WAI-ARIA dialog 패턴)', () => {
    render(<MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />);

    const trigger = screen.getByRole('button', { name: '목차 열기' });
    fireEvent.click(trigger);
    // 시트의 비인터랙티브 영역(헤더 제목·패딩) 클릭으로 포커스가 body로 떨어진 상황을 재현한다.
    // 이때 keydown 타깃은 body라 시트 래퍼까지 버블링되지 않으므로 document 리스너가 받아야 한다.
    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
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

  it('열리면 활성 항목을 시트 스크롤 영역 안으로 노출한다(scrollIntoView)', () => {
    render(<MobileToc toc={toc} activeId="detail" onFragIdChanged={() => {}} />);

    // 닫혀 있는 동안에는 스크롤을 시도하지 않아야 한다.
    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '목차 열기' }));

    // 이미 보이는 항목은 움직이지 않도록 block: 'nearest'로 호출해야 한다.
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'nearest' });
    // 스크롤 대상은 활성(aria-current="location") 항목이어야 한다.
    expect(scrollIntoViewMock.mock.contexts[0]).toBe(screen.getByRole('link', { name: '상세' }));
  });

  it('다른 모달이 열렸다 닫혀도 닫힌 시트의 inert가 유지된다(inert 참조 카운트 스냅샷 회귀 방지)', () => {
    // 같은 페이지에 useModalA11y 기반 오버레이가 둘 있는 상황(예: ToC 시트 + 사이드바)을
    // MobileToc 두 개로 재현한다. 둘 다 body 직계 자식 포털이라 서로를 배경으로 마킹한다.
    render(
      <>
        <MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />
        <MobileToc toc={toc} activeId="" onFragIdChanged={() => {}} />
      </>,
    );

    const wrappers = screen
      .getAllByRole('dialog', { hidden: true })
      .map((dialog) => dialog.parentElement);
    expect(wrappers).toHaveLength(2);

    const [firstTrigger] = screen.getAllByRole('button', { name: '목차 열기' });
    if (!firstTrigger) {
      throw new Error('트리거 버튼을 찾을 수 없습니다');
    }

    // 첫 번째 시트를 열면 useModalA11y가 (닫혀 있어 이미 inert인) 두 번째 래퍼도 배경으로 마킹한다.
    fireEvent.click(firstTrigger);
    // 첫 번째 시트를 닫으면 배경 마킹이 해제되는데, 원래(React가 inert={!open}으로 관리하는)
    // 두 번째 래퍼의 inert까지 지워지면 화면 밖 시트가 포커스/스크린리더에 노출된다.
    fireEvent.keyDown(document.body, { key: 'Escape' });

    wrappers.forEach((wrapper) => expect(wrapper).toHaveAttribute('inert'));
  });
});
