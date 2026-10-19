// src/geojson.js
// GeoJSON geometry를 "링(경위도 점 배열)" 목록으로 풀어낸다.

/** Polygon / MultiPolygon의 모든 링(바깥 경계와 구멍)을 평평한 배열로 돌려준다. */
export function collectRings(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates;
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat();
  return [];
}

/** LineString / MultiLineString의 모든 선을 평평한 배열로 돌려준다. */
export function collectLines(geometry) {
  if (geometry.type === 'LineString') return [geometry.coordinates];
  if (geometry.type === 'MultiLineString') return geometry.coordinates;
  return [];
}

/** 위경도 격자선(경선, 위선)을 MultiLineString geometry로 만든다. 점 간격은 2°다. */
export function createGraticule(stepDegrees = 30, maxLatitude = 90) {
  const lines = [];
  for (let lon = -180; lon <= 180; lon += stepDegrees) {
    const meridian = [];
    for (let lat = -maxLatitude; lat <= maxLatitude; lat += 2) meridian.push([lon, lat]);
    lines.push(meridian);
  }
  for (let lat = -90 + stepDegrees; lat < 90; lat += stepDegrees) {
    if (Math.abs(lat) > maxLatitude) continue;
    const parallel = [];
    for (let lon = -180; lon <= 180; lon += 2) parallel.push([lon, lat]);
    lines.push(parallel);
  }
  return { type: 'MultiLineString', coordinates: lines };
}
