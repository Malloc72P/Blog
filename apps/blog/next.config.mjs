/**
 * 해당 설정을 통해 Nextra는 프로젝트 내부의 마크다운 파일을 처리한다.
 * 자세한 내용은 아래 링크 참조.
 * https://nextra.site/docs/guide


 */
import nextra from 'nextra';

const withNextra = nextra({
  // ... Other Nextra config options
  codeHighlight: false,
});

// You can include other Next.js configuration options here, in addition to Nextra settings:
export default withNextra({
  // ... Other Next.js config options
});
