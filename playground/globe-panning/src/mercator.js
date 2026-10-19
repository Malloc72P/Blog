// src/mercator.js
// 메르카토르 투영(원통 투영). 경도는 x에 비례하고 위도는 로그 식으로 y에 대응한다.
// 반환 좌표의 단위는 라디안이며 x는 오른쪽, y는 위쪽이 양수다.
import { DEG } from './vector.js';

/** 위도가 ±90°에 가까우면 y가 무한대로 커지므로 웹 지도에서 쓰는 범위로 자른다. */
export const MAX_LATITUDE = 85.0511287798;

export function projectMercator([lon, lat]) {
  const clampedLat = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat));
  return {
    x: lon * DEG,
    y: Math.log(Math.tan(Math.PI / 4 + (clampedLat * DEG) / 2)),
  };
}

export function invertMercator(x, y) {
  return [x / DEG, (2 * Math.atan(Math.exp(y)) - Math.PI / 2) / DEG];
}
