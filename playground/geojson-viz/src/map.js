// 라이브러리 없이 GeoJSON을 SVG 지도로 그리는 핵심 로직.
// 1) 모든 좌표의 bounding box 계산 -> 2) 경위도를 화면 좌표로 투영 ->
// 3) viewport에 맞게 스케일/패딩 -> 4) 각 폴리곤을 SVG path로 변환.

const SVG_NS = 'http://www.w3.org/2000/svg';

// GeoJSON Feature 하나에서 폴리곤(좌표 링 묶음) 목록을 뽑아낸다.
// Polygon과 MultiPolygon을 같은 형태(폴리곤들의 배열)로 통일한다.
function extractPolygons(geometry) {
  if (geometry.type === 'Polygon') {
    // Polygon은 [외곽링, 구멍링...] 하나의 폴리곤이다.
    return [geometry.coordinates];
  }
  if (geometry.type === 'MultiPolygon') {
    // MultiPolygon은 폴리곤들의 배열이다(섬이 많은 지역 등).
    return geometry.coordinates;
  }
  // 점/선 등 이 데모에서 다루지 않는 타입은 빈 배열로 무시한다.
  return [];
}

// FeatureCollection 전체를 순회해 경도/위도의 최소·최대값(bounding box)을 구한다.
function computeBounds(features) {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const feature of features) {
    for (const polygon of extractPolygons(feature.geometry)) {
      for (const ring of polygon) {
        for (const [lng, lat] of ring) {
          // GeoJSON 좌표는 [경도, 위도] 순서임에 유의한다.
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      }
    }
  }
  return { minLng, minLat, maxLng, maxLat };
}

// 경위도 좌표를 화면(px) 좌표로 바꾸는 투영 함수를 만든다.
// Web Mercator로 경위도를 평면에 투영한다.
function createProjector(bounds, width, height, padding) {
  const { minLng, minLat, maxLng, maxLat } = bounds;

  // 경도를 라디안으로 변환해 x 값으로 쓴다.
  const lngToX = (lng) => (lng * Math.PI) / 180;
  // 위도를 Web Mercator의 y 값으로 변환한다(고위도일수록 늘어난다).
  // 핵심: x도 라디안이므로 y도 같은 라디안 단위여야 가로세로 비율이 맞는다.
  const latToY = (lat) => {
    const rad = (lat * Math.PI) / 180;
    return Math.log(Math.tan(Math.PI / 4 + rad / 2));
  };

  // bounding box를 Mercator 공간으로 옮긴다.
  // 위도가 높을수록 Mercator y가 커지므로, maxLat이 yMax, minLat이 yMin이 된다.
  const xMin = lngToX(minLng);
  const yMin = latToY(minLat);
  const yMax = latToY(maxLat);

  const geoWidth = lngToX(maxLng) - lngToX(minLng);
  const geoHeight = yMax - yMin; // 항상 양수가 되도록 max - min 순서로 계산한다.

  // 가로/세로 중 더 빡빡한 쪽에 맞춰 스케일을 정해 비율이 찌그러지지 않게 한다.
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const scale = Math.min(usableW / geoWidth, usableH / geoHeight);

  // 스케일 적용 후 남는 여백을 반씩 나눠 지도를 가운데로 모은다.
  const offsetX = padding + (usableW - geoWidth * scale) / 2;
  const offsetY = padding + (usableH - geoHeight * scale) / 2;

  // 실제 투영 함수: [경도, 위도] -> [x, y](px).
  return ([lng, lat]) => {
    const x = (lngToX(lng) - xMin) * scale + offsetX;
    // Mercator y는 위로 갈수록 커지지만 화면 y는 아래로 커진다.
    // 그래서 yMax 기준으로 빼서 위아래를 뒤집는다.
    const y = (yMax - latToY(lat)) * scale + offsetY;
    return [x, y];
  };
}

// 좌표 링 하나를 SVG path의 d 속성 문자열로 만든다.
function ringToPath(ring, project) {
  return ring
    .map(([lng, lat], i) => {
      const [x, y] = project([lng, lat]);
      // 첫 점은 M(moveto), 나머지는 L(lineto). 소수점 2자리로 줄여 path를 가볍게.
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ')
    .concat(' Z'); // Z로 도형을 닫는다.
}

// 하나의 Feature를 <path> 엘리먼트로 만든다(MultiPolygon이면 여러 서브패스를 합친다).
function featureToPath(feature, project) {
  const d = extractPolygons(feature.geometry)
    .flatMap((polygon) => polygon.map((ring) => ringToPath(ring, project)))
    .join(' ');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('class', 'region');
  // 지역명을 data 속성으로 달아 hover/클릭에서 활용한다.
  path.dataset.name = feature.properties.name ?? feature.properties.name_eng ?? '';
  return path;
}

// GeoJSON과 옵션을 받아 SVG 지도를 그려 컨테이너에 붙인다.
export function renderMap(geojson, { width = 720, height = 800, padding = 24 } = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));

  const bounds = computeBounds(geojson.features);
  const project = createProjector(bounds, width, height, padding);

  for (const feature of geojson.features) {
    svg.appendChild(featureToPath(feature, project));
  }
  return svg;
}
