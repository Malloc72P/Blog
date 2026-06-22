# ts-type-narrowing

타입 단언(`as`) 대신 타입 좁히기와 사용자 정의 타입 가드를 실제로 실행해 확인하는 예제다.
블로그 포스트 「타입 단언(as)을 버리고 타입 좁히기로 안전하게」의 코드를 검증하기 위한 프로젝트.

## 구성

- `src/01-as-danger.ts` — `as`가 컴파일러 검사를 우회해 런타임 에러로 이어지는 예제
- `src/02-narrowing.ts` — `typeof` / `in` / `instanceof` 기반 타입 좁히기
- `src/03-type-guard.ts` — `param is T` 형태의 사용자 정의 타입 가드

## 실행

```bash
npm install

npm run typecheck    # tsc --noEmit 로 타입 검사
npm run as-danger    # 01: as 단언이 숨긴 런타임 에러 재현
npm run narrowing    # 02: 좁히기 예제 출력
npm run type-guard   # 03: 타입 가드 예제 출력
```
