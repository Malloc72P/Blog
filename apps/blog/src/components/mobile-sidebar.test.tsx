import { fireEvent, render, screen } from '@testing-library/react';
import { SeriesModel, TagModel } from '@libs/types/commons';
import { MobileSidebar } from './mobile-sidebar';

// MobileSidebar 내부에서 usePathname으로 활성 항목을 계산하므로 테스트 환경에서 고정한다.
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// 시리즈는 동작 검증에 1개면 충분하다.
const seriesList: SeriesModel[] = [{ id: 'frontend', title: 'Frontend', date: '2026-01-01' }];

// 태그가 많아 사이드바 높이를 넘기는 상황을 만든다.
const tags: TagModel[] = Array.from({ length: 49 }, (_, index) => ({ id: `tag-${index}` }));

// 라벨이 부여된 button을 역할/이름으로 찾아 조작한다(아이콘 클래스 의존 제거).
const openSidebar = () => fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
const closeSidebar = () => fireEvent.click(screen.getByRole('button', { name: '메뉴 닫기' }));

describe('MobileSidebar', () => {
  // 테스트 간 body 스타일이 누수되지 않도록 초기화한다.
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('사이드바를 열면 배경 스크롤을 잠그고, 닫으면 원래대로 복구한다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    // 초기(닫힘) 상태에서는 body 스크롤을 잠그지 않는다.
    expect(document.body.style.overflow).not.toBe('hidden');

    openSidebar();
    expect(document.body.style.overflow).toBe('hidden');

    closeSidebar();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('데스크톱(md) 너비로 리사이즈되면 사이드바를 닫아 배경 스크롤 잠금을 해제한다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    openSidebar();
    expect(document.body.style.overflow).toBe('hidden');

    // 뷰포트를 md(768px) 이상으로 넓히고 resize 이벤트를 발생시킨다.
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    fireEvent(window, new Event('resize'));

    // 사이드바가 닫히며 배경 스크롤 잠금이 해제된다.
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('태그가 많아도 모든 태그가 렌더되고, 스크롤 가능한 콘텐츠 영역에 담긴다', () => {
    const { container } = render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    // 모든 태그가 DOM에 존재한다(잘려서 사라지지 않는다).
    tags.forEach((tag) => {
      expect(screen.getByText(tag.id)).toBeInTheDocument();
    });

    // 콘텐츠 영역이 세로 스크롤(overflow-y-auto)을 갖고, 모든 태그가 그 안에 담겨 있다.
    // (jsdom에는 레이아웃이 없어 실제 스크롤 동작 자체는 검증 불가하며, 구조만 보장한다.)
    const scrollArea = container.querySelector('.overflow-y-auto');
    expect(scrollArea).not.toBeNull();
    // non-null assertion 대신 타입 가드로 좁힌다.
    if (!scrollArea) throw new Error('scroll area not found');
    tags.forEach((tag) => {
      expect(scrollArea).toContainElement(screen.getByText(tag.id));
    });
  });

  it('트리거에 라벨이 있고 aria-expanded가 열림 상태를 반영한다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    const trigger = screen.getByRole('button', { name: '메뉴 열기' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    openSidebar();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('Esc 키로 사이드바를 닫는다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    openSidebar();
    expect(document.body.style.overflow).toBe('hidden');

    // 패널(dialog)에서 Esc 입력 → 닫힘
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('닫힌 동안 패널이 inert이고, 열면 inert가 해제된다', () => {
    const { container } = render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    // role=dialog 패널은 닫혀 있어도 DOM에 존재하므로 querySelector로 직접 잡는다.
    const panel = container.querySelector('[role="dialog"]');
    expect(panel).not.toBeNull();
    if (!panel) throw new Error('panel not found');

    // 닫힘 → inert로 내부 포커스 요소를 탭 순서/스크린리더에서 제외
    expect(panel).toHaveAttribute('inert');

    // 열기 → inert 해제
    openSidebar();
    expect(panel).not.toHaveAttribute('inert');
  });

  it('열면 닫기 버튼으로 포커스가 이동하고, 닫으면 트리거로 복귀한다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    openSidebar();
    expect(screen.getByRole('button', { name: '메뉴 닫기' })).toHaveFocus();

    closeSidebar();
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveFocus();
  });

  it('리사이즈로 닫힐 때는 (숨겨진) 트리거로 포커스를 강제하지 않는다', () => {
    render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    openSidebar();

    // 데스크톱(md) 폭으로 리사이즈 → 닫힘
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    fireEvent(window, new Event('resize'));

    // 데스크톱에서 트리거는 md:hidden이므로 포커스를 되돌리지 않는다(포커스 유실 방지).
    expect(screen.getByRole('button', { name: '메뉴 열기' })).not.toHaveFocus();
  });
});
