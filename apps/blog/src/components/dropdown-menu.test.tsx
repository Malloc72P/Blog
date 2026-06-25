import { fireEvent, render, screen } from '@testing-library/react';
import { DropdownMenu } from './dropdown-menu';

// DropdownMenu는 usePathname으로 활성 항목을 계산하므로 테스트 환경에서 고정한다.
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const items = [
  { id: 'frontend', label: 'Frontend', href: '/posts/frontend' },
  { id: 'ai', label: 'AI', href: '/posts/ai' },
];

describe('DropdownMenu', () => {
  it('트리거는 aria-expanded를 토글하는 button이다', () => {
    render(<DropdownMenu title="Series" items={items} />);

    const trigger = screen.getByRole('button', { name: 'Series' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('aria-controls가 실제 드롭다운 목록 id를 가리킨다', () => {
    render(<DropdownMenu title="Series" items={items} />);

    const trigger = screen.getByRole('button', { name: 'Series' });
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    if (!controls) throw new Error('aria-controls 없음');

    // aria-controls가 가리키는 id를 가진 요소가 실제로 존재해야 한다.
    expect(document.getElementById(controls)).not.toBeNull();
  });

  it('Esc 키로 드롭다운을 닫는다', () => {
    render(<DropdownMenu title="Series" items={items} />);

    const trigger = screen.getByRole('button', { name: 'Series' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('포커스가 드롭다운 영역 밖으로 나가면 닫힌다', () => {
    render(
      <>
        <DropdownMenu title="Series" items={items} />
        <button>바깥 버튼</button>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'Series' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // 포커스가 드롭다운 바깥 요소로 이동(focusout) → 닫힘
    const outside = screen.getByRole('button', { name: '바깥 버튼' });
    fireEvent.focusOut(trigger, { relatedTarget: outside });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
