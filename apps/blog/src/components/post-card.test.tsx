import { render, screen } from '@testing-library/react';
import { PostCard } from './post-card';
import { PostModel, SeriesModel } from '@libs/types/commons';

// PostCard는 useRouter로 카드 클릭 이동을 처리하므로 테스트 환경에서 모킹한다.
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const series: SeriesModel = { id: 'frontend', title: 'Frontend', date: '2026-01-01' };
const post: PostModel = {
  id: 'my-post',
  route: '/posts/frontend/my-post',
  series,
  title: '내 포스트 제목',
  tags: [{ id: 'react' }],
  date: '2026-01-02 10:00',
};

describe('PostCard', () => {
  it('포스트 제목을 레벨 2 헤딩(h2)으로 렌더한다(헤딩 위계/스크린리더 탐색)', () => {
    render(<PostCard post={post} series={series} />);

    expect(screen.getByRole('heading', { level: 2, name: '내 포스트 제목' })).toBeInTheDocument();
  });
});
