# jest-testing-playground

블로그 글 "Jest로 자바스크립트 단위 테스트 시작하기"의 예제 프로젝트입니다.
작은 장바구니 모듈(`src/cart.js`)과 결제 모듈(`src/checkout.js`)을 ESM(`import`/`export`) 문법으로 작성하고,
Jest로 단위 테스트를 작성해 둔 구성입니다.

## 구성

- `src/cart.js` — 순수 함수(`calculateTotal`, `applyDiscount`, `createItem`)와 비공개 헬퍼(`clampRate`)
- `src/checkout.js` — 의존성(결제 함수)을 주입받는 비동기 함수
- `src/cart.test.js` — 기본 matcher, `toThrow`, `beforeEach`, 비공개 함수 테스트
- `src/checkout.test.js` — `async/await`, `jest.fn()` mock, `rejects` 매처
- `babel.config.js` — `@babel/preset-env`로 ESM 문법을 변환
- `jest.config.js` — 테스트 환경 및 커버리지 설정

## 실행 방법

```sh
npm install      # 의존성 설치 (이 폴더는 pnpm 워크스페이스 밖이라 npm으로 설치)
npm test         # 테스트 실행
npm run coverage # 커버리지 리포트 포함 실행
```
