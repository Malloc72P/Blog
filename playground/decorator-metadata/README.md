# decorator-metadata

`emitDecoratorMetadata`가 만드는 메타데이터와 `reflect-metadata`의 동작, 번들 결과를 실제로 실행해 확인하는 예제다.
블로그 포스트 「TypeScript 데코레이터 메타데이터와 reflect-metadata」의 출력과 수치는 모두 이 프로젝트에서 나왔다.

확인한 환경: Node 22.20.0, TypeScript 7.0.2, reflect-metadata 0.2.2, Rollup 4.63.5, terser 5.51.2, esbuild 0.28.2, tsx 4.23.15, Vite 8.3.1

## 구성

- `src/01-emit` — 예제 모델과 그 컴파일 결과. `out/01-emit/model.js`와 `out-nometa/01-emit/model.js`를 비교한다
- `src/02-reflect` — `01-emit`의 모델로 reflect-metadata 유무, import 순서, 상속한 클래스에서의 조회를 확인한다
- `src/03-types` — 속성 타입별로 `design:type`에 기록되는 값. `later-class.ts`는 아래쪽에 선언한 클래스를 타입으로 쓰는 경우다
- `src/04-method` — 메서드의 `design:paramtypes`·`design:returntype`, 생성자의 `design:paramtypes`
- `src/09-import` — 타입 자리에만 쓴 클래스의 import가 메타데이터 옵션에 따라 남는지
- `src/05-target` — 데코레이터가 받는 target(프로토타입과 클래스), 이름 기반 저장소와 객체 기반 저장소
- `src/07-mangle` + `scripts/mangle.mjs` — 따로 번들·압축한 두 번들이 이름을 키로 쓰는 저장소를 공유할 때
- `src/08-object-key` — 같은 상황에서 클래스 객체를 키로 쓰는 저장소
- `src/06-bundle` + `scripts/bundle.mjs` — Rollup·terser(`module: true`)로 번들했을 때 크기와 남는 코드
  - `entry-title.ts`: `TitleModel`만 불러오는 엔트리
  - `entry-decorated.ts`: 라이브러리 파일(`lib-decorated.ts`)을 거쳐 `TitleModel`만 불러오는 엔트리. `LegendModel`은 쓰지 않는다
  - `entry-plain.ts`: 데코레이터가 없는 비교 대상
  - `entry-noop.ts`: 쓰지 않는 클래스에만 빈 데코레이터를 붙인 경우
- `standard` — `experimentalDecorators` 없이 쓰는 표준 데코레이터의 `context.metadata`. `inherit-naive.ts`는 상속을 고려하지 않은 버전이다
- `vite.config.mjs`, `vite.types.config.mjs` — Vite로 같은 코드를 번들했을 때

## 실행

```bash
npm install
npm run build      # tsc로 out, out-nometa(메타데이터 끔), out-helpers(importHelpers) 생성

npm run reflect          # reflect-metadata 유무·import 순서·상속
npm run types            # 타입별 design:type 값
npm run types:nonstrict  # strictNullChecks를 끄고 같은 표 출력
npm run types:tdz        # 아래쪽에 선언한 클래스를 타입으로 쓰면 ReferenceError
npm run import           # 메타데이터를 켜면 타입으로만 쓴 모듈도 실행된다
npm run method           # 메서드·생성자 메타데이터
npm run target           # 등록 시점 target과 저장소 키
npm run bundle           # 번들 크기(UTF-8 바이트)와 포함 여부
npm run mangle           # 압축 후 클래스 이름으로 조회하는 경우와 이름이 겹치는 경우
npm run esbuild          # esbuild로 번들하면 design:type이 없다
npm run tsx              # tsx로 실행해도 design:type이 없다
npm run vite             # Vite 8은 tsconfig 설정대로 design:type을 만든다
npm run vite:types       # Vite 8과 tsc의 design:type 표가 다른 곳(literal)
npm run standard         # 표준 데코레이터의 Symbol.metadata와 상속
```
