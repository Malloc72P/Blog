// babel-jest가 테스트 파일과 소스를 변환할 때 사용할 프리셋을 지정한다.
// @babel/preset-env가 현재 노드 버전에 맞게 import/export 같은 최신 문법을 변환한다.
export default {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
};
