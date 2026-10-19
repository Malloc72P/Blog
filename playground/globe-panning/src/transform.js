// src/transform.js
// 화면 배치용 transform(translate + scale). SVG의 transform="translate(tx ty) scale(k)"와 같은 뜻이다.
// 패닝은 tx, ty를 바꾸고 줌은 k를 바꾼다.

/** 부모 요소 좌표 (x, y)를 화면 좌표로 바꾼다. */
export function applyTransform({ tx, ty, k }, x, y) {
  return { x: tx + k * x, y: ty + k * y };
}

/** 화면 좌표를 부모 요소 좌표로 되돌린다. applyTransform의 역함수다. */
export function invertTransform({ tx, ty, k }, x, y) {
  return { x: (x - tx) / k, y: (y - ty) / k };
}

/** (px, py)가 화면에서 같은 자리에 머물도록 배율을 factor배 하고 translate를 조정한다. */
export function zoomAround(transform, px, py, factor) {
  const { tx, ty, k } = transform;
  return { tx: px - (px - tx) * factor, ty: py - (py - ty) * factor, k: k * factor };
}
