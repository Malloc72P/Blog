// src/clip.js
// 직교 투영에서 뒷면(z < 0)을 잘라낸다.
// 선분이 수평선(z = 0 인 원)을 지나면 교차점을 구해 끊고, 폴리곤은 수평선 위의 호로 이어 닫는다.
import { DEG } from './vector.js';

/** 이웃한 두 점 사이의 최대 각도. 넘으면 대원(큰 원) 위에 점을 더 넣는다. */
const MAX_STEP = 2.5 * DEG;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function normalize([x, y, z]) {
  const length = Math.hypot(x, y, z);
  return length === 0 ? [x, y, z] : [x / length, y / length, z / length];
}

/** a에서 b까지 대원을 따라 점을 채운다. a는 제외하고 b는 포함한다. */
function densifyEdge(a, b) {
  const angle = Math.acos(Math.max(-1, Math.min(1, dot(a, b))));
  const steps = Math.max(1, Math.ceil(angle / MAX_STEP));
  const points = [];
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    points.push(normalize([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]));
  }
  points.push(b);
  return points;
}

/** 점 목록의 모든 변을 densifyEdge로 채운다. closed가 true이면 마지막 점에서 첫 점으로 가는 변도 채운다. */
export function densify(vectors, closed) {
  if (vectors.length === 0) return [];
  const result = [vectors[0]];
  const edgeCount = closed ? vectors.length : vectors.length - 1;
  for (let i = 0; i < edgeCount; i += 1) {
    result.push(...densifyEdge(vectors[i], vectors[(i + 1) % vectors.length]));
  }
  // closed이면 마지막에 첫 점이 다시 들어오므로 중복을 제거한다.
  return closed ? result.slice(0, -1) : result;
}

/** 앞면(z ≥ 0)에서 뒷면(z < 0)으로 넘어가는 변 a→b가 수평선과 만나는 점 */
function horizonCrossing(a, b) {
  const t = a[2] / (a[2] - b[2]);
  const [x, y] = normalize([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 0]);
  return [x, y, 0];
}

/** 수평선 위의 두 점 사이를 짧은 쪽 호를 따라 채운다. 양 끝점은 제외한다. */
function horizonArc(from, to) {
  const start = Math.atan2(from[1], from[0]);
  let delta = Math.atan2(to[1], to[0]) - start;
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta <= -Math.PI) delta += 2 * Math.PI;
  const steps = Math.max(1, Math.ceil(Math.abs(delta) / MAX_STEP));
  const points = [];
  for (let i = 1; i < steps; i += 1) {
    const angle = start + (delta * i) / steps;
    points.push([Math.cos(angle), Math.sin(angle), 0]);
  }
  return points;
}

/**
 * 닫힌 링(회전된 벡터 목록)에서 앞면만 남긴다.
 * 앞면에서 나가는 점(exit)과 다시 들어오는 점(entry) 사이는 수평선 호로 잇는다.
 * 전부 뒷면이면 빈 배열을 돌려준다.
 */
export function clipRing(vectors) {
  const kept = [];
  for (let i = 0; i < vectors.length; i += 1) {
    const current = vectors[i];
    const next = vectors[(i + 1) % vectors.length];
    const currentFront = current[2] >= 0;
    const nextFront = next[2] >= 0;
    if (currentFront) kept.push({ vector: current, kind: 'point' });
    if (currentFront !== nextFront) {
      const crossing = currentFront ? horizonCrossing(current, next) : horizonCrossing(next, current);
      kept.push({ vector: crossing, kind: currentFront ? 'exit' : 'entry' });
    }
  }
  const result = [];
  kept.forEach((item, index) => {
    result.push(item.vector);
    if (item.kind === 'exit') {
      // exit 다음에 오는 점은 항상 entry다. 둘 사이 구간이 뒷면이기 때문이다.
      const entry = kept[(index + 1) % kept.length];
      result.push(...horizonArc(item.vector, entry.vector));
    }
  });
  return result;
}

/** 열린 선(회전된 벡터 목록)에서 앞면 구간만 남긴다. 구간별로 나눈 점 목록의 배열을 돌려준다. */
export function clipLine(vectors) {
  const runs = [];
  let current = [];
  for (let i = 0; i < vectors.length; i += 1) {
    const a = vectors[i];
    const b = vectors[i + 1];
    const aFront = a[2] >= 0;
    if (aFront) current.push(a);
    if (b === undefined) break;
    const bFront = b[2] >= 0;
    if (aFront && !bFront) {
      current.push(horizonCrossing(a, b));
      runs.push(current);
      current = [];
    } else if (!aFront && bFront) {
      current = [horizonCrossing(b, a)];
    }
  }
  if (current.length > 1) runs.push(current);
  return runs.filter((run) => run.length > 1);
}
