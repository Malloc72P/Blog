import test from 'node:test';
import assert from 'node:assert/strict';
import { lonLatToVector, vectorToLonLat } from '../src/vector.js';
import { rotateToCenter, rotateFromCenter } from '../src/rotation.js';
import { projectOrthographic, invertOrthographic, rotateLonLat } from '../src/orthographic.js';
import { projectMercator, invertMercator } from '../src/mercator.js';
import { applyTransform, invertTransform } from '../src/transform.js';
import { clipRing, clipLine, densify } from '../src/clip.js';
import { createRandom, randomLonLat, randomCenter, lonDifference } from './helpers.js';

const TOLERANCE_DEG = 1e-9; // 왕복 후 경위도 오차 허용치(도)
const TOLERANCE_UNIT = 1e-12; // 단위 벡터 성분 오차 허용치

test('경위도 -> 단위벡터 -> 경위도 왕복', () => {
  const random = createRandom(1);
  for (let i = 0; i < 1000; i += 1) {
    const [lon, lat] = randomLonLat(random);
    const [backLon, backLat] = vectorToLonLat(lonLatToVector([lon, lat]));
    assert.ok(Math.abs(lonDifference(backLon, lon)) < TOLERANCE_DEG, `경도 ${lon} -> ${backLon}`);
    assert.ok(Math.abs(backLat - lat) < TOLERANCE_DEG, `위도 ${lat} -> ${backLat}`);
  }
});

test('단위벡터의 길이는 1이고 (0, 0)은 (0, 0, 1)이다', () => {
  assert.deepEqual(lonLatToVector([0, 0]), [0, 0, 1]);
  const random = createRandom(2);
  for (let i = 0; i < 100; i += 1) {
    const [x, y, z] = lonLatToVector(randomLonLat(random));
    assert.ok(Math.abs(Math.hypot(x, y, z) - 1) < TOLERANCE_UNIT);
  }
});

test('center로 회전하면 center 자신이 정면 (0, 0, 1)에 온다', () => {
  const random = createRandom(3);
  for (let i = 0; i < 200; i += 1) {
    const center = randomCenter(random);
    const [x, y, z] = rotateToCenter(lonLatToVector([center.lon, center.lat]), center);
    assert.ok(Math.abs(x) < TOLERANCE_UNIT && Math.abs(y) < TOLERANCE_UNIT && Math.abs(z - 1) < TOLERANCE_UNIT);
  }
});

test('회전 후 역회전하면 원래 벡터로 돌아온다', () => {
  const random = createRandom(4);
  for (let i = 0; i < 1000; i += 1) {
    const original = lonLatToVector(randomLonLat(random));
    const center = randomCenter(random);
    const roundTrip = rotateFromCenter(rotateToCenter(original, center), center);
    roundTrip.forEach((value, axis) => assert.ok(Math.abs(value - original[axis]) < TOLERANCE_UNIT));
  }
});

test('뒷면 판별: center의 반대편은 보이지 않고 center 근처는 보인다', () => {
  const center = { lon: 30, lat: 40 };
  assert.equal(projectOrthographic([30, 40], center).visible, true);
  assert.equal(projectOrthographic([30 + 80, 40], center).visible, true);
  assert.equal(projectOrthographic([30 + 180, -40], center).visible, false); // 정반대 지점
  assert.equal(projectOrthographic([30 + 100, 0], center).visible, false);
  // 수평선(90°)을 넘는 순간 z의 부호가 바뀐다. 적도에서 center 경도 기준 89°와 91°
  const centerOnEquator = { lon: 0, lat: 0 };
  assert.equal(rotateLonLat([89, 0], centerOnEquator)[2] > 0, true);
  assert.equal(rotateLonLat([91, 0], centerOnEquator)[2] < 0, true);
});

test('직교 투영 -> 역직교투영 왕복 (앞면 점)', () => {
  const random = createRandom(5);
  let checked = 0;
  for (let i = 0; i < 3000; i += 1) {
    const center = randomCenter(random);
    const lonLat = randomLonLat(random);
    const projected = projectOrthographic(lonLat, center);
    if (!projected.visible) continue;
    const [lon, lat] = invertOrthographic(projected.x, projected.y, center);
    assert.ok(Math.abs(lonDifference(lon, lonLat[0])) < 1e-7, `경도 ${lonLat[0]} -> ${lon}`);
    assert.ok(Math.abs(lat - lonLat[1]) < 1e-7, `위도 ${lonLat[1]} -> ${lat}`);
    checked += 1;
  }
  assert.ok(checked > 1000);
});

test('역직교투영: 원판 밖의 점은 null', () => {
  assert.equal(invertOrthographic(1.01, 0, { lon: 0, lat: 0 }), null);
  assert.equal(invertOrthographic(0.8, 0.8, { lon: 10, lat: 20 }), null);
  assert.notEqual(invertOrthographic(0, 0, { lon: 10, lat: 20 }), null);
});

test('원판 중심 (0, 0)은 center의 경위도로 되돌아온다', () => {
  const center = { lon: 126.98, lat: 37.57 };
  const [lon, lat] = invertOrthographic(0, 0, center);
  assert.ok(Math.abs(lon - center.lon) < TOLERANCE_DEG && Math.abs(lat - center.lat) < TOLERANCE_DEG);
});

test('투영 중심을 (0, 0)으로 가정한 역변환은 회전된 지구본에서 틀린다', () => {
  const center = { lon: 126.98, lat: 37.57 };
  const target = [139.69, 35.69]; // 정면에서 약 12도 떨어진 지점
  const { x, y } = projectOrthographic(target, center);
  const correct = invertOrthographic(x, y, center);
  const assumedOrigin = invertOrthographic(x, y, { lon: 0, lat: 0 });
  assert.ok(Math.abs(correct[0] - target[0]) < 1e-9 && Math.abs(correct[1] - target[1]) < 1e-9);
  assert.ok(Math.abs(assumedOrigin[0] - target[0]) > 100, `경도 오차가 커야 한다: ${assumedOrigin[0]}`);
});

test('메르카토르 투영 -> 역투영 왕복, 위도 클램프', () => {
  const random = createRandom(6);
  for (let i = 0; i < 1000; i += 1) {
    const lonLat = randomLonLat(random);
    const { x, y } = projectMercator(lonLat);
    const [lon, lat] = invertMercator(x, y);
    assert.ok(Math.abs(lon - lonLat[0]) < 1e-9 && Math.abs(lat - lonLat[1]) < 1e-9);
  }
  assert.ok(Number.isFinite(projectMercator([0, 90]).y));
});

test('메르카토르: translate로 패닝해도 transform 역변환 + 역투영이면 경위도가 맞다', () => {
  const radius = 72;
  const transform = { tx: -120, ty: 35, k: 1.7 };
  const lonLat = [126.98, 37.57];
  const { x, y } = projectMercator(lonLat);
  const screen = applyTransform(transform, x * radius, -y * radius);
  const local = invertTransform(transform, screen.x, screen.y);
  const [lon, lat] = invertMercator(local.x / radius, -local.y / radius);
  assert.ok(Math.abs(lon - lonLat[0]) < 1e-9 && Math.abs(lat - lonLat[1]) < 1e-9);
});

test('clipRing: 앞면만 남고 모두 z >= 0이다', () => {
  const center = { lon: 0, lat: 0 };
  // 경도 60~150, 위도 -20~20 사각형: 일부는 뒷면에 걸친다
  const ring = [[60, -20], [150, -20], [150, 20], [60, 20], [60, -20]];
  const vectors = densify(ring.slice(0, -1).map((p) => rotateToCenter(lonLatToVector(p), center)), true);
  const clipped = clipRing(vectors);
  assert.ok(clipped.length > 0);
  clipped.forEach((v) => assert.ok(v[2] >= -1e-12, `z=${v[2]}`));
  // 전부 뒷면인 링은 빈 배열
  const behind = [[150, -10], [170, -10], [170, 10], [150, 10]].map((p) => rotateToCenter(lonLatToVector(p), center));
  assert.deepEqual(clipRing(behind), []);
});

test('clipLine: 수평선에서 끊고 앞면 구간만 남긴다', () => {
  const center = { lon: 0, lat: 0 };
  const equator = [];
  for (let lon = -180; lon <= 180; lon += 10) equator.push(rotateToCenter(lonLatToVector([lon, 0]), center));
  const runs = clipLine(densify(equator, false));
  assert.equal(runs.length, 1);
  const [first] = runs;
  first.forEach((v) => assert.ok(v[2] >= -1e-12));
  // 적도는 -90° ~ +90° 구간만 남는다
  assert.ok(Math.abs(first[0][0] + 1) < 1e-9 && Math.abs(first[first.length - 1][0] - 1) < 1e-9);
});
