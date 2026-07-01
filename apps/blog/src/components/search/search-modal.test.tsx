import { render, screen } from '@testing-library/react';
import { SearchModal } from './search-modal';
import { useSearch } from './search-context';

// SearchModal이 결과 클릭 시 router.push로 이동하므로 테스트 환경에서 모킹한다.
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// SearchModal은 SearchProvider의 실제 fetch/Fuse 로직과 무관하게 isOpen 등의 상태만 소비하므로
// useSearch를 목(mock)해 상태 전이(닫힘→열림→닫힘)를 직접 제어한다.
jest.mock('./search-context', () => ({
  useSearch: jest.fn(),
}));

const mockUseSearch = useSearch as jest.MockedFunction<typeof useSearch>;

function mockSearchState(overrides: Partial<ReturnType<typeof useSearch>> = {}) {
  mockUseSearch.mockReturnValue({
    isOpen: false,
    open: jest.fn(),
    close: jest.fn(),
    status: 'ready',
    search: jest.fn(() => []),
    ...overrides,
  });
}

describe('SearchModal', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('닫혀 있으면 아무것도 렌더하지 않는다', () => {
    mockSearchState({ isOpen: false });
    render(<SearchModal />);

    expect(screen.queryByRole('dialog', { name: '포스트 검색' })).not.toBeInTheDocument();
  });

  it('열리면 document.body에 다이얼로그가 렌더된다(#106: portal)', () => {
    mockSearchState({ isOpen: true });
    render(<SearchModal />);

    const dialog = screen.getByRole('dialog', { name: '포스트 검색' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('열리면 배경(다른 body 자식)에 inert를 적용하고, 닫히면 해제한다(#106)', () => {
    mockSearchState({ isOpen: true });
    // RTL의 render container는 document.body의 직계 자식으로 붙는다 —
    // 포털로 렌더되는 다이얼로그와는 별개의 "배경" 역할을 한다.
    const { container, rerender } = render(<SearchModal />);

    expect(container).toHaveAttribute('inert');

    mockSearchState({ isOpen: false });
    rerender(<SearchModal />);

    expect(container).not.toHaveAttribute('inert');
  });

  it('열린 동안 배경(body) 스크롤을 잠그고, 닫히면 복구한다', () => {
    mockSearchState({ isOpen: false });
    const { rerender } = render(<SearchModal />);
    expect(document.body.style.overflow).not.toBe('hidden');

    mockSearchState({ isOpen: true });
    rerender(<SearchModal />);
    expect(document.body.style.overflow).toBe('hidden');

    mockSearchState({ isOpen: false });
    rerender(<SearchModal />);
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
