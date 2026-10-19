// src/rotation.js
// 구를 회전시켜 원하는 지점(center)이 정면 (0, 0, 1)에 오게 한다.
import { DEG } from './vector.js';

/** Y축(북쪽 방향 축) 회전. 양의 각도는 Z 쪽을 X 쪽으로 돌린다. 경도가 theta만큼 늘어난다. */
export function rotateAroundY([x, y, z], theta) {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

/** X축(동쪽 방향 축) 회전. 위도가 alpha만큼 줄어든다. */
export function rotateAroundX([x, y, z], alpha) {
  const cos = Math.cos(alpha);
  const sin = Math.sin(alpha);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

/**
 * center({ lon, lat }, 도 단위)가 정면에 오도록 벡터를 회전한다.
 * 1) 경도 회전: center의 경도가 0이 되도록 Y축으로 -lon만큼 돌린다.
 * 2) 위도 회전: center의 위도가 0이 되도록 X축으로 +lat만큼 돌린다.
 */
export function rotateToCenter(vector, center) {
  const aroundY = rotateAroundY(vector, -center.lon * DEG);
  return rotateAroundX(aroundY, center.lat * DEG);
}

/** rotateToCenter의 역회전. 회전 순서도 반대로 적용한다(위도 회전 취소 후 경도 회전 취소). */
export function rotateFromCenter(vector, center) {
  const aroundX = rotateAroundX(vector, -center.lat * DEG);
  return rotateAroundY(aroundX, center.lon * DEG);
}
