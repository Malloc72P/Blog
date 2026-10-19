// src/mercator-view.js
// 메르카토르 평면 지도. 패닝과 줌은 부모 <g>의 transform만 바꾸고 path는 다시 만들지 않는다.
import { createSvgElement, attachPointerControls, clamp, formatLonLat } from './dom.js';
import { mercatorPath } from './paths.js';
import { createGraticule } from './geojson.js';
import { projectMercator, invertMercator } from './mercator.js';
import { invertTransform, zoomAround } from './transform.js';

const WIDTH = 560;
const HEIGHT = 380;
const RADIUS = 76; // 지구 반지름에 해당하는 px. 세계 전체 너비는 2π × 76 ≈ 477px
const MIN_SCALE = 0.6;
const MAX_SCALE = 8;

export function createMercatorView(svg, readout, countries) {
  svg.setAttribute('width', WIDTH);
  svg.setAttribute('height', HEIGHT);
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

  const layer = createSvgElement('g');
  const graticule = createSvgElement('path', { class: 'graticule', d: mercatorPath(createGraticule(30, 80), RADIUS) });
  const land = createSvgElement('g', { class: 'land' });
  countries.features.forEach((feature) => {
    land.append(createSvgElement('path', { d: mercatorPath(feature.geometry, RADIUS) }));
  });
  const marker = createSvgElement('circle', { class: 'marker', r: 5, visibility: 'hidden' });
  layer.append(graticule, land, marker);
  svg.append(layer);

  let transform = { tx: WIDTH / 2, ty: 215, k: 1 };
  let clickLog = '아직 클릭하지 않았습니다.';

  const transformText = () => `translate(${transform.tx.toFixed(0)} ${transform.ty.toFixed(0)}) scale(${transform.k.toFixed(2)})`;

  function render() {
    layer.setAttribute('transform', transformText());
    // 선과 마커는 배율이 커져도 굵기·크기가 같게 보이도록 k로 나눈다.
    marker.setAttribute('r', String(5 / transform.k));
    readout.textContent = `부모 <g>의 transform: ${transformText()}\n${clickLog}`;
  }

  function locate(px, py) {
    const local = invertTransform(transform, px, py); // 1) 화면 배치 transform 역변환
    const lonLat = invertMercator(local.x / RADIUS, -local.y / RADIUS); // 2) 역메르카토르
    const forward = projectMercator(lonLat);
    marker.setAttribute('cx', String(forward.x * RADIUS));
    marker.setAttribute('cy', String(-forward.y * RADIUS));
    marker.setAttribute('visibility', 'visible');
    clickLog = [
      `클릭한 화면 좌표: (${px.toFixed(2)}, ${py.toFixed(2)})`,
      `1) transform 역변환: (${local.x.toFixed(1)}, ${local.y.toFixed(1)})`,
      `2) 역메르카토르: ${formatLonLat(lonLat)}`,
    ].join('\n');
    render();
  }

  attachPointerControls(svg, {
    onDrag: (dx, dy) => {
      transform = { ...transform, tx: transform.tx + dx, ty: transform.ty + dy };
      render();
    },
    onClick: locate,
    onWheel: (px, py, factor) => {
      const next = clamp(transform.k * factor, MIN_SCALE, MAX_SCALE) / transform.k;
      transform = zoomAround(transform, px, py, next);
      render();
    },
  });

  render();
  return {
    pan(tx, ty, k = transform.k) {
      transform = { tx, ty, k };
      render();
    },
    click: locate,
  };
}
