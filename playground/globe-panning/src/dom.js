// src/dom.js
// SVG 요소 생성과 포인터 입력(드래그, 클릭, 휠) 처리를 모은 보조 모듈

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
}

/** 포인터 이벤트 위치를 svg 좌표(viewBox 기준 px)로 바꾼다. svg의 width/height와 viewBox를 같게 두었으므로 배율은 1이다. */
export function toSvgPoint(svg, event) {
  const rect = svg.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

const CLICK_DISTANCE = 4;

/**
 * 드래그(onDrag), 클릭(onClick), 휠(onWheel)을 한 곳에서 처리한다.
 * 포인터가 CLICK_DISTANCE 이하로 움직이고 끝나면 클릭으로 본다.
 */
export function attachPointerControls(svg, { onDrag, onClick, onWheel }) {
  let last = null;
  let start = null;

  svg.addEventListener('pointerdown', (event) => {
    svg.setPointerCapture(event.pointerId);
    last = toSvgPoint(svg, event);
    start = last;
  });

  svg.addEventListener('pointermove', (event) => {
    if (last === null) return;
    const point = toSvgPoint(svg, event);
    onDrag(point.x - last.x, point.y - last.y);
    last = point;
  });

  svg.addEventListener('pointerup', (event) => {
    if (start === null) return;
    const point = toSvgPoint(svg, event);
    const moved = Math.hypot(point.x - start.x, point.y - start.y);
    if (moved <= CLICK_DISTANCE) onClick(point.x, point.y);
    last = null;
    start = null;
  });

  svg.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const point = toSvgPoint(svg, event);
      onWheel(point.x, point.y, Math.exp(-event.deltaY * 0.001));
    },
    { passive: false },
  );
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function formatLonLat([lon, lat]) {
  return `경도 ${lon.toFixed(2)}°, 위도 ${lat.toFixed(2)}°`;
}
