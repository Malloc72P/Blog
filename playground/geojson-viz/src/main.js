// 지도를 그리고 hover/클릭 상호작용을 붙이는 진입점.
import { renderMap } from './map.js';

const app = document.getElementById('app');
const label = document.getElementById('label');

// 단순화한 시도 경계 GeoJSON을 불러온다.
const geojson = await fetch('../data/skorea-provinces.json').then((res) => res.json());

// 라이브러리 없이 만든 SVG 지도를 화면에 붙인다.
const svg = renderMap(geojson, { width: 720, height: 820, padding: 28 });
app.appendChild(svg);

// 이벤트 위임으로 모든 region path의 hover/클릭을 한 번에 처리한다.
svg.addEventListener('mouseover', (e) => {
  const target = e.target;
  if (!(target instanceof SVGPathElement)) return;
  // hover한 지역을 강조 클래스로 채움색을 바꾼다.
  target.classList.add('is-active');
  label.textContent = target.dataset.name ?? '';
});

svg.addEventListener('mouseout', (e) => {
  const target = e.target;
  if (!(target instanceof SVGPathElement)) return;
  target.classList.remove('is-active');
});

// 클릭하면 선택된 지역을 고정 강조한다(데모용 간단 토글).
svg.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof SVGPathElement)) return;
  svg.querySelectorAll('.is-selected').forEach((el) => el.classList.remove('is-selected'));
  target.classList.add('is-selected');
});
