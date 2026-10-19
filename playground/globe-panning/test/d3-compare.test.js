// 정답 대조: d3-geo의 geoOrthographic / geoMercator와 같은 점에서 수치를 비교한다.
//
// 회전 규약 차이
//   d3: projection.rotate([λ, φ])는 경위도 (-λ, -φ)인 점을 정면으로 보낸다.
//   이 예제: center = { lon, lat }인 점을 정면으로 보낸다.
//   따라서 center = (lon0, lat0)에 대응하는 d3 호출은 rotate([-lon0, -lat0])다.
//   d3의 화면 y는 아래로 커지고, 이 예제의 투영 결과 y는 위로 커진다. 비교할 때 y의 부호를 맞춘다.
//   뒷면 판별: d3의 projection(point)는 뒷면 점도 좌표를 돌려주고 잘라내기는 스트림 단계에서 한다.
//   그래서 정답은 geoDistance(점, center)가 90°(π/2) 이하인지로 정한다.
import test from 'node:test';
import assert from 'node:assert/strict';
import { geoOrthographic, geoMercator, geoDistance } from 'd3-geo';
import { projectOrthographic, invertOrthographic } from '../src/orthographic.js';
import { projectMercator, invertMercator } from '../src/mercator.js';
import { createRandom, randomLonLat, randomCenter, lonDifference } from './helpers.js';

const RADIUS = 200;
const PIXEL_TOLERANCE = 1e-8; // 투영 좌표 허용 오차(px). 반지름 200px 기준
const DEGREE_TOLERANCE = 1e-7; // 역변환 경위도 허용 오차(도)

function createD3Orthographic(center) {
  return geoOrthographic().scale(RADIUS).translate([0, 0]).rotate([-center.lon, -center.lat]).clipAngle(90);
}

test('d3 geoOrthographic과 투영 좌표·가시성이 같다', () => {
  const random = createRandom(11);
  let maxError = 0;
  let visibleCount = 0;
  let hiddenCount = 0;
  for (let i = 0; i < 5000; i += 1) {
    const center = randomCenter(random);
    const lonLat = randomLonLat(random);
    const actual = projectOrthographic(lonLat, center);
    const distance = geoDistance(lonLat, [center.lon, center.lat]);
    if (Math.abs(distance - Math.PI / 2) < 1e-9) continue; // 수평선 위의 점은 판정이 모호하므로 제외
    const expectedVisible = distance < Math.PI / 2;
    assert.equal(actual.visible, expectedVisible, `가시성 불일치: ${JSON.stringify({ center, lonLat })}`);
    if (!expectedVisible) {
      hiddenCount += 1;
      continue;
    }
    const expected = createD3Orthographic(center)(lonLat);
    const errorX = Math.abs(actual.x * RADIUS - expected[0]);
    const errorY = Math.abs(-actual.y * RADIUS - expected[1]);
    maxError = Math.max(maxError, errorX, errorY);
    assert.ok(errorX < PIXEL_TOLERANCE && errorY < PIXEL_TOLERANCE, `좌표 불일치 ${errorX}, ${errorY}`);
    visibleCount += 1;
  }
  console.log(`[d3 대조] 직교 투영 비교: 앞면 ${visibleCount}점, 뒷면 ${hiddenCount}점, 최대 오차 ${maxError.toExponential(2)}px (반지름 ${RADIUS}px)`);
  assert.ok(visibleCount > 1000 && hiddenCount > 1000);
});

test('d3 projection.invert와 역직교투영 경위도가 같다', () => {
  const random = createRandom(12);
  let maxError = 0;
  let count = 0;
  for (let i = 0; i < 5000; i += 1) {
    const center = randomCenter(random);
    const d3Projection = createD3Orthographic(center);
    // 원판 안의 임의 화면 좌표
    const px = (random() * 2 - 1) * RADIUS * 0.99;
    const py = (random() * 2 - 1) * RADIUS * 0.99;
    if (Math.hypot(px, py) > RADIUS * 0.99) continue;
    const expected = d3Projection.invert([px, py]);
    const actual = invertOrthographic(px / RADIUS, -py / RADIUS, center);
    const errorLon = Math.abs(lonDifference(actual[0], expected[0])) * Math.cos((expected[1] * Math.PI) / 180);
    const errorLat = Math.abs(actual[1] - expected[1]);
    maxError = Math.max(maxError, errorLon, errorLat);
    assert.ok(errorLon < DEGREE_TOLERANCE && errorLat < DEGREE_TOLERANCE, `역변환 불일치 ${errorLon}, ${errorLat}`);
    count += 1;
  }
  console.log(`[d3 대조] 역직교투영 비교: ${count}점, 최대 오차 ${maxError.toExponential(2)}도`);
  assert.ok(count > 2000);
});

test('d3 geoMercator와 투영·역투영 결과가 같다', () => {
  const d3Projection = geoMercator().scale(RADIUS).translate([0, 0]).center([0, 0]).rotate([0, 0]);
  const random = createRandom(13);
  let maxError = 0;
  for (let i = 0; i < 3000; i += 1) {
    const lonLat = randomLonLat(random);
    const expected = d3Projection(lonLat);
    const { x, y } = projectMercator(lonLat);
    const errorX = Math.abs(x * RADIUS - expected[0]);
    const errorY = Math.abs(-y * RADIUS - expected[1]);
    maxError = Math.max(maxError, errorX, errorY);
    assert.ok(errorX < PIXEL_TOLERANCE && errorY < PIXEL_TOLERANCE);
    const [lon, lat] = invertMercator(expected[0] / RADIUS, -expected[1] / RADIUS);
    const d3Inverse = d3Projection.invert(expected);
    assert.ok(Math.abs(lon - d3Inverse[0]) < DEGREE_TOLERANCE && Math.abs(lat - d3Inverse[1]) < DEGREE_TOLERANCE);
  }
  console.log(`[d3 대조] 메르카토르 비교: 3000점, 투영 최대 오차 ${maxError.toExponential(2)}px (반지름 ${RADIUS}px)`);
});

test('d3 geoMercator에서도 translate 패닝 뒤 역변환 규칙이 같다', () => {
  const translate = [-120, 35];
  const k = 1.7;
  const d3Projection = geoMercator().scale(RADIUS * k).translate(translate).center([0, 0]).rotate([0, 0]);
  const lonLat = [126.98, 37.57];
  const screen = d3Projection(lonLat);
  // 이 예제의 방식: 화면 -> (translate, scale) 역변환 -> 메르카토르 역투영
  const localX = (screen[0] - translate[0]) / k;
  const localY = (screen[1] - translate[1]) / k;
  const [lon, lat] = invertMercator(localX / RADIUS, -localY / RADIUS);
  assert.ok(Math.abs(lon - lonLat[0]) < 1e-9 && Math.abs(lat - lonLat[1]) < 1e-9);
});
