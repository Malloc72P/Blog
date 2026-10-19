// src/globe-view.js
// 직교 투영 지구본. 드래그하면 회전값(center)이 바뀌므로 path를 다시 만든다.
// 화면 배치(translate/scale)는 메르카토르와 마찬가지로 부모 <g>의 transform이 맡는다.
import { createSvgElement, attachPointerControls, clamp, formatLonLat } from './dom.js';
import { orthographicPath } from './paths.js';
import { createGraticule } from './geojson.js';
import { DEG } from './vector.js';
import { projectOrthographic, invertOrthographic } from './orthographic.js';
import { invertTransform, zoomAround } from './transform.js';

const SIZE = 420;
const RADIUS = 180;
const MIN_SCALE = 0.6;
const MAX_SCALE = 3;

const normalizeLon = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180;

export function createGlobeView(svg, readout, countries) {
  svg.setAttribute('width', SIZE);
  svg.setAttribute('height', SIZE);
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);

  const graticuleGeometry = createGraticule(30, 90);
  const layer = createSvgElement('g');
  const ocean = createSvgElement('circle', { class: 'ocean', r: RADIUS });
  const graticule = createSvgElement('path', { class: 'graticule' });
  const land = createSvgElement('g', { class: 'land' });
  const countryPaths = countries.features.map((feature) => {
    const path = createSvgElement('path');
    land.append(path);
    return { geometry: feature.geometry, path };
  });
  const outline = createSvgElement('circle', { class: 'outline', r: RADIUS });
  const marker = createSvgElement('circle', { class: 'marker', visibility: 'hidden' });
  layer.append(ocean, graticule, land, outline, marker);
  svg.append(layer);

  let center = { lon: 0, lat: 0 };
  let transform = { tx: SIZE / 2, ty: SIZE / 2, k: 1 };
  let clicked = null; // { px, py }
  let clickLog = '아직 클릭하지 않았습니다.';

  const transformText = () => `translate(${transform.tx.toFixed(0)} ${transform.ty.toFixed(0)}) scale(${transform.k.toFixed(2)})`;

  /** 클릭한 화면 좌표를 경위도로 되돌린다. 그리는 순서의 반대로 적용한다. */
  function locate(px, py) {
    clicked = { px, py };
    const local = invertTransform(transform, px, py); // 1) 화면 배치 transform 역변환
    const unit = { x: local.x / RADIUS, y: -local.y / RADIUS };
    const lonLat = invertOrthographic(unit.x, unit.y, center); // 2) 역직교투영 3) 역회전
    if (lonLat === null) {
      clickLog = `클릭한 화면 좌표: (${px.toFixed(2)}, ${py.toFixed(2)})\n지구 바깥입니다.`;
      return;
    }
    const withoutRotation = invertOrthographic(unit.x, unit.y, { lon: 0, lat: 0 });
    clickLog = [
      `클릭한 화면 좌표: (${px.toFixed(2)}, ${py.toFixed(2)})`,
      `1) transform 역변환: (${local.x.toFixed(1)}, ${local.y.toFixed(1)}) -> 단위 원판 (${unit.x.toFixed(4)}, ${unit.y.toFixed(4)})`,
      `2~3) 역직교투영 + 역회전: ${formatLonLat(lonLat)}`,
      `참고) 회전을 무시하고 (0°, 0°) 중심으로 역변환: ${formatLonLat(withoutRotation ?? [NaN, NaN])}`,
    ].join('\n');
    placeMarker(lonLat);
  }

  /** 구한 경위도를 다시 정방향 투영해 같은 자리에 마커를 찍는다(왕복 확인). */
  function placeMarker(lonLat) {
    const projected = projectOrthographic(lonLat, center);
    marker.setAttribute('visibility', projected.visible ? 'visible' : 'hidden');
    marker.setAttribute('cx', String(projected.x * RADIUS));
    marker.setAttribute('cy', String(-projected.y * RADIUS));
  }

  function render() {
    layer.setAttribute('transform', transformText());
    graticule.setAttribute('d', orthographicPath(graticuleGeometry, center, RADIUS));
    countryPaths.forEach(({ geometry, path }) => path.setAttribute('d', orthographicPath(geometry, center, RADIUS)));
    marker.setAttribute('r', String(5 / transform.k));
    // 드래그로 회전값이 바뀌면 이전 클릭 위치는 의미가 없으므로 마커를 숨긴다.
    if (clicked === null) marker.setAttribute('visibility', 'hidden');
    readout.textContent = [
      `부모 <g>의 transform: ${transformText()}`,
      `회전 중심(정면): ${formatLonLat([center.lon, center.lat])}`,
      clickLog,
    ].join('\n');
  }

  attachPointerControls(svg, {
    onDrag: (dx, dy) => {
      // 표면을 오른쪽으로 끌면 정면은 서쪽으로, 아래로 끌면 북쪽으로 옮겨 간다.
      const radiansPerPixel = 1 / (RADIUS * transform.k);
      center = {
        lon: normalizeLon(center.lon - (dx * radiansPerPixel) / DEG),
        lat: clamp(center.lat + (dy * radiansPerPixel) / DEG, -90, 90),
      };
      clicked = null;
      clickLog = '아직 클릭하지 않았습니다.';
      render();
    },
    onClick: (px, py) => {
      locate(px, py);
      render();
    },
    onWheel: (px, py, factor) => {
      const next = clamp(transform.k * factor, MIN_SCALE, MAX_SCALE) / transform.k;
      transform = zoomAround(transform, px, py, next);
      render();
    },
  });

  render();
  return {
    rotate(lon, lat) {
      center = { lon, lat };
      clicked = null;
      clickLog = '아직 클릭하지 않았습니다.';
      render();
    },
    click(px, py) {
      locate(px, py);
      render();
    },
  };
}
