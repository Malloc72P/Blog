// src/paths.js
// GeoJSON geometry를 SVG path의 d 문자열로 바꾼다.
// 두 투영 모두 반지름 radius를 곱한 좌표를 만든다. 화면 배치(translate/scale)는 부모 <g>의 transform이 맡는다.
import { collectRings, collectLines } from './geojson.js';
import { lonLatToVector } from './vector.js';
import { rotateToCenter } from './rotation.js';
import { densify, clipRing, clipLine } from './clip.js';
import { projectMercator } from './mercator.js';

const format = (n) => n.toFixed(2);

/** 점 목록을 "M x y L x y ..." 문자열로 만든다. closed이면 Z로 닫는다. */
function toPathData(points, closed) {
  if (points.length < 2) return '';
  const body = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${format(x)} ${format(y)}`).join('');
  return closed ? `${body}Z` : body;
}

/** 회전한 3차원 점을 반지름 radius인 원판 좌표로 옮긴다. 화면 y는 아래로 커지므로 부호를 뒤집는다. */
const flatten = ([x, y], radius) => [x * radius, -y * radius];

function rotateRing(ring, center) {
  // GeoJSON 링은 첫 점과 마지막 점이 같으므로 마지막 점은 뺀다.
  const vectors = ring.slice(0, -1).map((lonLat) => rotateToCenter(lonLatToVector(lonLat), center));
  return densify(vectors, true);
}

/** 직교 투영 지구본용 path. 뒷면은 잘라내고 center가 정면에 오도록 회전한다. */
export function orthographicPath(geometry, center, radius) {
  const rings = collectRings(geometry).map((ring) => {
    const clipped = clipRing(rotateRing(ring, center));
    return toPathData(clipped.map((v) => flatten(v, radius)), true);
  });
  const lines = collectLines(geometry).flatMap((line) => {
    const vectors = line.map((lonLat) => rotateToCenter(lonLatToVector(lonLat), center));
    return clipLine(densify(vectors, false)).map((run) => toPathData(run.map((v) => flatten(v, radius)), false));
  });
  return [...rings, ...lines].filter(Boolean).join('');
}

/**
 * 날짜변경선(경도 ±180°)을 가로지르는 링은 경도가 179°에서 -179°로 튄다. 그대로 그리면 지도 전체 너비를 가로지르는 띠가 생긴다.
 * 튀는 곳마다 ±360°를 더해 경도를 이어 붙인다. 이어 붙인 링이 닫히지 않으면(극점을 감싸는 링) 원래대로 둔다.
 */
export function unwrapRing(ring) {
  const unwrapped = [ring[0]];
  let offset = 0;
  for (let i = 1; i < ring.length; i += 1) {
    const jump = ring[i][0] - ring[i - 1][0];
    if (jump > 180) offset -= 360;
    else if (jump < -180) offset += 360;
    unwrapped.push([ring[i][0] + offset, ring[i][1]]);
  }
  const closed = Math.abs(unwrapped[unwrapped.length - 1][0] - unwrapped[0][0]) < 1e-9;
  return closed ? unwrapped : ring;
}

/** 링이 -180° 또는 180° 바깥으로 나갔으면 반대편에 360° 옮긴 복사본도 함께 돌려준다. */
function ringWithWrappedCopies(ring) {
  const unwrapped = unwrapRing(ring);
  const lons = unwrapped.map(([lon]) => lon);
  const copies = [unwrapped];
  if (Math.max(...lons) > 180) copies.push(unwrapped.map(([lon, lat]) => [lon - 360, lat]));
  if (Math.min(...lons) < -180) copies.push(unwrapped.map(([lon, lat]) => [lon + 360, lat]));
  return copies;
}

/** 메르카토르 평면 지도용 path. 회전이 없으므로 한 번 만들면 패닝 중에 다시 만들 필요가 없다. */
export function mercatorPath(geometry, radius) {
  const project = (lonLat) => {
    const { x, y } = projectMercator(lonLat);
    return flatten([x, y], radius);
  };
  const rings = collectRings(geometry)
    .flatMap(ringWithWrappedCopies)
    .map((ring) => toPathData(ring.map(project), true));
  const lines = collectLines(geometry).map((line) => toPathData(line.map(project), false));
  return [...rings, ...lines].filter(Boolean).join('');
}
