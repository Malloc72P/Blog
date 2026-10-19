// src/main.js
// 데이터를 불러와 두 지도(메르카토르 평면, 직교 투영 지구본)를 화면에 붙인다.
// 쿼리스트링으로 초기 상태를 지정할 수 있다. 예: ?lon=127&lat=37&gclick=210,200&mtx=300&mty=215
import { createMercatorView } from './mercator-view.js';
import { createGlobeView } from './globe-view.js';

const params = new URLSearchParams(location.search);
const numberParam = (name) => (params.has(name) ? Number(params.get(name)) : null);
const pairParam = (name) => (params.has(name) ? params.get(name).split(',').map(Number) : null);

const response = await fetch('./data/world-110m.geojson');
const countries = await response.json();

const mercator = createMercatorView(document.querySelector('#mercator'), document.querySelector('#mercator-readout'), countries);
const globe = createGlobeView(document.querySelector('#globe'), document.querySelector('#globe-readout'), countries);

const mtx = numberParam('mtx');
const mty = numberParam('mty');
if (mtx !== null && mty !== null) mercator.pan(mtx, mty, numberParam('mk') ?? 1);

const lon = numberParam('lon');
const lat = numberParam('lat');
if (lon !== null && lat !== null) globe.rotate(lon, lat);

const mclick = pairParam('mclick');
if (mclick) mercator.click(mclick[0], mclick[1]);
const gclick = pairParam('gclick');
if (gclick) globe.click(gclick[0], gclick[1]);
