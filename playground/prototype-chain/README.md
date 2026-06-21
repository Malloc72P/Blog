# prototype-chain

자바스크립트의 프로토타입과 프로토타입 체인을 직접 콘솔로 확인해보는 예제입니다.

## 실행 방법

별도의 의존성이 없으므로 Node.js만 있으면 바로 실행할 수 있습니다.

```bash
node src/index.mjs
# 또는
npm start
```

## 다루는 내용

`src/index.mjs`는 다음 여섯 가지를 순서대로 출력합니다.

1. 객체 리터럴 / 생성자 함수 / `class`로 만든 인스턴스의 프로토타입 체인
2. 인스턴스에 없는 메서드가 프로토타입에서 찾아지는 속성 조회 위임
3. `hasOwnProperty`로 자기 속성과 상속 속성 구분
4. 프로토타입에 메서드를 추가하면 기존 인스턴스에도 즉시 반영되는 현상
5. `class extends`와 `Object.create` 기반 수동 상속의 결과 비교
6. 체인의 끝이 `Object.prototype` -> `null`로 끝나는 모습
