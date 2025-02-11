/**
 * Nextra에선 사이트와 각각의 페이지 구조를 같은 경로에 있는 _meta파일로 설정할 수 있다.
 * 이러한 구성은 Nextra 테마 전반에 영향을 준다. 특히 네비게이션 바와 사이드바를 설정하는데 사용된다.
 *
 * Nextra는 모든 페이지 파일(page.md, page.mdx, _meta)을 모아서 페이지를 만든다.
 * 그 후, Nextra는 전체 라우트 경로 및 디렉토리 구조에 대한 정보를 가지고 있는 pageMap 배열을 생성한다.
 * 네비게이션바와 사이드바와 같은 기능은 pageMap 정보를 기반으로 생성된다.
 *
 * 그리고 전역 pageMap은 Nextra에 의해 각각의 페이지로 import된다.
 * 그러면 설정된 테마가 pageMap을 가지고 실제 UI를 렌더링한다.
 *
 * API
 * 사이드바와 네비바에 표시되는 페이지 제목과 순서는 _meta파일로 설정할 수 있다.
 */

export default {
  index: 'Home Page',
};
