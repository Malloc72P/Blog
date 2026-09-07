import { Constants } from '@libs/constants';
import { shouldIndexTagPage } from '@libs/tag-index-policy';

const { tagIndexMinPostCount } = Constants.seo;

describe('shouldIndexTagPage', () => {
  it('글이 임계값 이상인 태그는 색인 대상이다', () => {
    expect(shouldIndexTagPage(tagIndexMinPostCount)).toBe(true);
    expect(shouldIndexTagPage(tagIndexMinPostCount + 10)).toBe(true);
  });

  it('글이 임계값 미만인 태그는 색인 대상이 아니다', () => {
    expect(shouldIndexTagPage(tagIndexMinPostCount - 1)).toBe(false);
  });

  it('글이 하나도 없는 태그는 색인 대상이 아니다', () => {
    expect(shouldIndexTagPage(0)).toBe(false);
  });
});
