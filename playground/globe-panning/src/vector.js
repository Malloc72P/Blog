// src/vector.js
// 경위도와 3차원 단위벡터를 서로 바꾼다.
//
// 축 규약 (오른손 좌표계, 화면을 바라보는 관점)
//   X: 화면 오른쪽(동쪽)   Y: 화면 위쪽(북쪽)   Z: 화면에서 보는 사람 쪽
// 경도 0°, 위도 0°인 점이 (0, 0, 1)이다. 즉 기본 상태에서 정면은 (0°, 0°)이다.

export const DEG = Math.PI / 180;

/** [경도, 위도](도 단위)를 단위벡터 [x, y, z]로 바꾼다. */
export function lonLatToVector([lon, lat]) {
  const lambda = lon * DEG;
  const phi = lat * DEG;
  return [Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda)];
}

/** 단위벡터 [x, y, z]를 [경도, 위도](도 단위)로 바꾼다. */
export function vectorToLonLat([x, y, z]) {
  // 부동소수점 오차로 y가 1을 살짝 넘으면 asin이 NaN이 되므로 범위를 맞춘다.
  const clampedY = Math.max(-1, Math.min(1, y));
  return [Math.atan2(x, z) / DEG, Math.asin(clampedY) / DEG];
}
