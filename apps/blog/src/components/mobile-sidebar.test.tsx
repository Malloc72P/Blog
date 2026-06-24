import { fireEvent, render, screen } from '@testing-library/react';
import { SeriesModel, TagModel } from '@libs/types/commons';
import { MobileSidebar } from './mobile-sidebar';

// MobileSidebar 내부에서 usePathname으로 활성 항목을 계산하므로 테스트 환경에서 고정한다.
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// 시리즈는 동작 검증에 1개면 충분하다.
const seriesList: SeriesModel[] = [{ id: 'frontend', title: 'Frontend', date: '2026-01-01' }];

// 이슈 #101 재현: 태그가 많아 사이드바 높이를 넘기는 상황을 만든다.
const tags: TagModel[] = Array.from({ length: 49 }, (_, index) => ({ id: `tag-${index}` }));

// 비시맨틱(div) 트리거/닫기 버튼을 아이콘 클래스로 찾아 클릭한다.
function clickByIcon(container: HTMLElement, iconClass: string) {
  const button = container.querySelector(`.${iconClass}`)?.closest('div');
  if (!button) throw new Error(`button not found: ${iconClass}`);
  fireEvent.click(button);
}

describe('MobileSidebar', () => {
  // 테스트 간 body 스타일이 누수되지 않도록 초기화한다.
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('사이드바를 열면 배경 스크롤을 잠그고, 닫으면 원래대로 복구한다', () => {
    const { container } = render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    // 초기(닫힘) 상태에서는 body 스크롤을 잠그지 않는다.
    expect(document.body.style.overflow).not.toBe('hidden');

    // 사이드바 열기 → 배경 스크롤 잠금
    clickByIcon(container, 'tabler-icon-menu-2');
    expect(document.body.style.overflow).toBe('hidden');

    // 사이드바 닫기 → 배경 스크롤 복구
    clickByIcon(container, 'tabler-icon-x');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('데스크톱(md) 너비로 리사이즈되면 사이드바를 닫아 배경 스크롤 잠금을 해제한다', () => {
    const { container } = render(<MobileSidebar seriesList={seriesList} tags={tags} />);

    // 사이드바 열기 → 배경 스크롤 잠금
    clickByIcon(container, 'tabler-icon-menu-2');
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
});
