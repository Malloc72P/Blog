// 원본 시도 경계 GeoJSON은 약 7.5MB(18만 좌표)라 브라우저 데모/저장소에 부담스럽다.
// Douglas-Peucker 알고리즘으로 폴리곤 외곽선을 단순화해 형태는 유지하되 용량을 줄인다.
// 사용법: node scripts/simplify.mjs <입력.json> <출력.json> [epsilon]
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output, epsStr] = process.argv;
// epsilon이 클수록 점을 더 많이 버린다(단위: 경위도 degree).
const epsilon = parseFloat(epsStr || '0.005');

// 점 p와 선분 a-b 사이의 수직 거리를 구한다.
function perpendicularDistance(p, a, b) {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  // a와 b가 같은 점이면 단순 유클리드 거리로 대체한다.
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  // 점-직선 거리 공식을 그대로 적용한다.
  return Math.abs(dy * px - dx * py + bx * ay - by * ax) / Math.hypot(dx, dy);
}

// 한 개의 좌표 링(폴리곤 외곽선)에 Douglas-Peucker를 적용한다.
function douglasPeucker(points, eps) {
  if (points.length < 3) return points;
  let maxDist = 0;
  let index = 0;
  const end = points.length - 1;
  // 양 끝점을 잇는 선분에서 가장 멀리 떨어진 점을 찾는다.
  for (let i = 1; i < end; i++) {
    const dist = perpendicularDistance(points[i], points[0], points[end]);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  // 그 거리가 임계값보다 크면 해당 점을 기준으로 좌우를 재귀 단순화한다.
  if (maxDist > eps) {
    const left = douglasPeucker(points.slice(0, index + 1), eps);
    const right = douglasPeucker(points.slice(index), eps);
    return left.slice(0, -1).concat(right);
  }
  // 임계값 이하면 양 끝점만 남기고 사이를 모두 버린다.
  return [points[0], points[end]];
}

// 폴리곤(여러 개의 링) 단위로 단순화를 적용한다.
function simplifyPolygon(rings, eps) {
  return rings.map((ring) => {
    const simplified = douglasPeucker(ring, eps);
    // 너무 단순해져 닫힌 도형이 깨지는 경우를 방지한다.
    return simplified.length >= 4 ? simplified : ring;
  });
}

const geo = JSON.parse(readFileSync(input, 'utf-8'));

let before = 0;
let after = 0;
const countPts = (c) => (Array.isArray(c[0]) ? c.reduce((s, x) => s + countPts(x), 0) : 1);

// 각 Feature의 geometry 타입에 맞춰 Polygon/MultiPolygon을 처리한다.
for (const feature of geo.features) {
  const g = feature.geometry;
  before += countPts(g.coordinates);
  if (g.type === 'Polygon') {
    g.coordinates = simplifyPolygon(g.coordinates, epsilon);
  } else if (g.type === 'MultiPolygon') {
    g.coordinates = g.coordinates.map((poly) => simplifyPolygon(poly, epsilon));
  }
  after += countPts(g.coordinates);
}

// 좌표 소수점을 5자리로 잘라 추가로 용량을 줄인다(약 1m 정밀도).
const rounded = JSON.parse(
  JSON.stringify(geo, (key, val) => (typeof val === 'number' ? Math.round(val * 1e5) / 1e5 : val)),
);

writeFileSync(output, JSON.stringify(rounded));
console.log(`points: ${before} -> ${after} (epsilon=${epsilon})`);
