# ts-never-unknown

`never`(바닥 타입)와 `unknown`(꼭대기 타입)의 동작을 실제로 실행해 확인하는 예제다.
블로그 포스트 「never와 unknown 제대로 쓰기」의 코드를 검증하기 위한 프로젝트.

## 구성

- `src/01-unknown.ts` — `unknown`을 좁혀 안전하게 다루기, `any`와의 대비
- `src/02-never.ts` — `never`가 나오는 상황(불가능한 교차 타입, 반환하지 않는 함수)
- `src/03-exhaustive.ts` — `never`로 빠짐없는 분기 검사(exhaustive check)
- `broken/exhaustive-broken.ts` — 케이스를 빠뜨려 컴파일 에러를 재현하는 예제

## 실행

```bash
npm install

npm run typecheck      # src 전체 타입 검사(통과해야 정상)
npm run unknown        # 01 실행
npm run never          # 02 실행
npm run exhaustive     # 03 실행
npm run check-broken   # 케이스 누락 시 컴파일 에러 재현(에러가 나야 정상)
```
