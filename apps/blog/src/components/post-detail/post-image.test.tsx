import { render, screen } from '@testing-library/react';
import { PostImage } from './post-image';

describe('PostImage', () => {
  it('기본은 lazy 로딩이다(priority 미지정 시 loading="lazy")', () => {
    render(<PostImage src="/sample.png" alt="샘플 이미지" />);

    const img = screen.getByRole('img', { name: '샘플 이미지' });
    // priority 남용 시 하단 이미지까지 즉시 preload되어 LCP가 늦어지므로 기본은 lazy여야 한다.
    expect(img).toHaveAttribute('loading', 'lazy');
    // 실제 표시폭 힌트(sizes)를 내려 과대 크기 다운로드를 막는다.
    expect(img).toHaveAttribute('sizes', '(max-width: 1024px) 100vw, 944px');
  });

  it('priority를 옵트인하면 lazy 로딩이 해제된다(즉시 로딩)', () => {
    render(<PostImage src="/sample.png" alt="첫 화면 이미지" priority />);

    const img = screen.getByRole('img', { name: '첫 화면 이미지' });
    // 첫 화면(LCP) 이미지에만 명시적으로 우선순위를 부여할 수 있어야 한다.
    // (jsdom에서는 fetchpriority가 attribute로 반영되지 않으므로 loading 부재로 검증한다.)
    expect(img).not.toHaveAttribute('loading');
  });
});
