// src/orthographic.js
// 직교 투영: 구를 회전시킨 뒤 정면에서 바라본 모습을 평면에 옮긴다.
// 반환하는 좌표는 반지름이 1인 단위 원판 위의 값이며 x는 오른쪽, y는 위쪽이 양수다.
import { lonLatToVector, vectorToLonLat } from './vector.js';
import { rotateToCenter, rotateFromCenter } from './rotation.js';

/** 경위도를 회전한 뒤의 3차원 벡터로 바꾼다. z가 0 이상이면 앞면이다. */
export function rotateLonLat(lonLat, center) {
  return rotateToCenter(lonLatToVector(lonLat), center);
}

/** 회전한 벡터가 앞면(정면에서 보이는 쪽)인지 판별한다. */
export function isFrontFacing(rotatedVector) {
  return rotatedVector[2] >= 0;
}

/**
 * 직교 투영. 회전한 벡터에서 z를 버린 값이 평면 좌표다.
 *   x = cos(φ)·sin(λ - λ0) 꼴 (center가 (0°, 0°)이면 x = cosφ·sinλ, y = sinφ)
 * visible이 false이면 지구 뒷면이라 화면에 보이지 않는다.
 */
export function projectOrthographic(lonLat, center) {
  const rotated = rotateLonLat(lonLat, center);
  return { x: rotated[0], y: rotated[1], visible: isFrontFacing(rotated) };
}

/**
 * 역직교투영. 단위 원판 위의 (x, y)에서 경위도를 구한다.
 * 1) z = √(1 - x² - y²)로 구 표면의 앞면 점을 복원한다. (원판 밖이면 null)
 * 2) 이 점은 회전된 상태의 좌표이므로, 투영 때와 반대로 회전해 상쇄한다.
 */
export function invertOrthographic(x, y, center) {
  const squaredDistance = x * x + y * y;
  if (squaredDistance > 1) return null;
  const z = Math.sqrt(1 - squaredDistance);
  return vectorToLonLat(rotateFromCenter([x, y, z], center));
}
