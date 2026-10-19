# globe-panning

라이브러리 없이 순수 JavaScript(ESM)로 메르카토르 평면 지도와 직교 투영 지구본의 이동(패닝)을 구현하는 예제입니다.

- 메르카토르: 부모 `<g>`의 `translate`만 바꿔 이동합니다.
- 직교 투영: 구를 회전시켜 원하는 지점을 정면에 놓고 다시 투영합니다.
- 두 지도 모두 클릭한 화면 좌표를 경위도로 되돌리는 역변환을 보여 줍니다.

## 실행 방법

```sh
npm install
npm run isolated:dev   # 정적 서버(포트 5174)
# 브라우저에서 http://localhost:5174 접속
```

ES Module `import`와 `fetch`를 쓰므로 `file://`이 아니라 HTTP 서버로 열어야 합니다.
쿼리스트링으로 초기 상태를 지정할 수 있습니다. 예: `?lon=127&lat=37&gclick=246,212`

## 테스트

```sh
npm test            # node --test
npm run example     # 도쿄 한 점을 투영하고 되돌리는 과정을 단계별로 출력
```

테스트는 왕복 오차, 회전·역회전 항등, 뒷면 판별을 검사하고, `d3-geo`의 `geoOrthographic`, `geoMercator` 결과와 같은 점에서 수치를 비교합니다.
`d3-geo`는 정답 대조용 devDependency이며 `src/`의 투영 수학에는 쓰지 않습니다.

## 파일 구성

```
globe-panning/
├─ index.html                # 데모 페이지(메르카토르 + 지구본)
├─ src/vector.js             # 경위도 <-> 3차원 단위벡터
├─ src/rotation.js           # Y축·X축 회전, 정면 회전과 역회전
├─ src/orthographic.js       # 직교 투영, 역직교투영, 뒷면 판별
├─ src/mercator.js           # 메르카토르 투영, 역투영
├─ src/transform.js          # translate/scale 적용, 역변환, 커서 기준 줌
├─ src/clip.js               # 뒷면 잘라내기(수평선에서 끊기)
├─ src/geojson.js            # 링 추출, 경위선 생성
├─ src/paths.js              # geometry -> SVG path (날짜변경선 처리 포함)
├─ src/dom.js, *-view.js, main.js   # SVG 그리기, 드래그·클릭·휠 처리
├─ scripts/build-data.mjs    # world-atlas(TopoJSON) -> GeoJSON 변환
├─ scripts/example.mjs       # 단계별 계산 출력
├─ test/                     # node --test
└─ data/world-110m.geojson   # 국가 경계(110m 해상도)
```

## 데이터

`world-atlas`의 `countries-110m.json`(Natural Earth 기반 TopoJSON)을 `topojson-client`로 GeoJSON으로 바꿔 `data/world-110m.geojson`에 저장했습니다.
두 라이브러리는 데이터 준비에만 쓰며, 다시 만들려면 `npm run build:data`를 실행합니다.
