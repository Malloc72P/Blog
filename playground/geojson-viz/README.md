# geojson-viz

라이브러리(d3, leaflet 등) 없이 순수 JavaScript + SVG만으로 GeoJSON 지리 데이터를 지도로 그리는 예제입니다.

## 무엇을 하나요?

1. GeoJSON의 모든 좌표를 훑어 bounding box(경위도 최소·최대)를 계산합니다.
2. 경위도를 간이 Web Mercator로 화면 좌표(px)에 투영합니다.
3. viewport 비율에 맞춰 스케일/패딩을 잡아 가운데 정렬합니다.
4. 각 Polygon / MultiPolygon을 SVG `<path>`로 변환하고 hover/클릭 상호작용을 붙입니다.

핵심 로직은 `src/map.js`에 있습니다.

## 실행 방법

```sh
# 정적 서버로 실행 (포트 5173)
npm run isolated:dev
# 브라우저에서 http://localhost:5173 접속
```

ES Module `import`와 `fetch`를 쓰므로 `file://`이 아니라 HTTP 서버로 열어야 합니다.

## 데이터 출처 및 라이선스

- 원본: [southkorea/southkorea-maps](https://github.com/southkorea/southkorea-maps) — `kostat/2018/json/skorea-provinces-2018-geo.json` (대한민국 통계청 2018년 시도 경계).
- 라이선스: 해당 저장소는 데이터 출처별 라이선스를 따릅니다(통계청 SGIS 기반, 공공 데이터). 자세한 내용은 원본 저장소를 참고하세요.
- `data/skorea-provinces.json`은 원본(약 7.5MB)을 Douglas-Peucker 알고리즘으로 단순화한 버전(약 158KB)입니다. 단순화 스크립트는 `scripts/simplify.mjs`입니다.

```sh
# 원본을 직접 받아 다시 단순화하려면:
curl -L -o /tmp/kr.json \
  https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-geo.json
npm run simplify -- /tmp/kr.json data/skorea-provinces.json 0.005
```

## 파일 구성

```
geojson-viz/
├─ index.html               # 데모 페이지(스타일 + 컨테이너)
├─ src/map.js               # bounding box → 투영 → SVG path (라이브러리 없음)
├─ src/main.js              # 데이터 로드 + hover/클릭 이벤트
├─ scripts/simplify.mjs     # 원본 GeoJSON 단순화 스크립트
└─ data/skorea-provinces.json  # 단순화된 시도 경계 데이터
```
