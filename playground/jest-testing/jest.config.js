// Jest 설정. babel-jest가 변환을 담당하므로 별도 transform 설정 없이 동작한다.
export default {
  // 노드 환경에서 테스트를 실행한다(브라우저 DOM이 필요하면 'jsdom'으로 바꾼다).
  testEnvironment: 'node',
  // 커버리지를 어떤 파일에서 수집할지 지정한다.
  collectCoverageFrom: ['src/**/*.js'],
};
