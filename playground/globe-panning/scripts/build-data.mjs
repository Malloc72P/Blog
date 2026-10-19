// world-atlas(TopoJSON)를 GeoJSON으로 변환해 data/world-110m.geojson에 저장한다.
// topojson-client는 데이터 준비에만 쓰고, 투영 수학(src/)에는 쓰지 않는다.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const topologyPath = require.resolve('world-atlas/countries-110m.json');
const topology = JSON.parse(await readFile(topologyPath, 'utf8'));

const countries = feature(topology, topology.objects.countries);
// 좌표 소수점을 3자리로 줄여 파일 크기를 줄인다(약 100m 오차, 지도 표시에는 충분하다).
const round = (n) => Math.round(n * 1000) / 1000;
const roundCoordinates = (value) =>
  Array.isArray(value) ? value.map(roundCoordinates) : round(value);

const slim = {
  type: 'FeatureCollection',
  features: countries.features.map((f) => ({
    type: 'Feature',
    properties: { name: f.properties?.name ?? '' },
    geometry: { type: f.geometry.type, coordinates: roundCoordinates(f.geometry.coordinates) },
  })),
};

await mkdir(join(root, 'data'), { recursive: true });
const out = join(root, 'data', 'world-110m.geojson');
await writeFile(out, JSON.stringify(slim));
console.log(`${slim.features.length}개 국가를 ${out}에 저장했습니다.`);
