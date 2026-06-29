import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('href를 가진 링크로 렌더되고, onClick이 없으면 aria-current가 없다', () => {
    render(<Badge href="/posts/frontend">FE</Badge>);

    const link = screen.getByRole('link', { name: 'FE' });
    // 배지는 항상 실제 링크(<a>)로 렌더되어 접근성/딥링크를 보장한다.
    expect(link).toHaveAttribute('href', '/posts/frontend');
    // 필터로 쓰이지 않을 땐 현재 항목 표시가 없어야 한다.
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('onClick이 있으면 클릭 시 기본 이동을 막고(preventDefault) 콜백을 호출한다', () => {
    const onClick = jest.fn();
    render(
      <Badge href="/posts/frontend" onClick={onClick}>
        FE
      </Badge>,
    );

    const link = screen.getByRole('link', { name: 'FE' });
    // fireEvent.click은 기본 동작이 취소(preventDefault)되면 false를 반환한다.
    const notCancelled = fireEvent.click(link);

    // 필터 클릭은 페이지 이동 대신 콜백만 실행되어야 한다(랜딩 시리즈 필터의 동작).
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(notCancelled).toBe(false);
  });

  it('active=true면 aria-current="true"를 부여한다', () => {
    render(
      <Badge href="/posts/frontend" active>
        FE
      </Badge>,
    );

    expect(screen.getByRole('link', { name: 'FE' })).toHaveAttribute('aria-current', 'true');
  });
});
