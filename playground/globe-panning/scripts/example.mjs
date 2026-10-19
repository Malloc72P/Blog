// 도쿄(139.69°E, 35.69°N)를 정면이 서울 부근(127°E, 37°N)인 지구본에 투영하고 되돌리는 과정을 단계별로 출력한다.
// 반지름(180px)과 translate(210 210)는 예제 페이지 지구본(src/globe-view.js)과 같은 값이다.
// 단계 번호는 글의 다이어그램(그리는 순서 5단계, 역변환 순서 5단계)과 같다.
import { lonLatToVector, vectorToLonLat, DEG } from '../src/vector.js';
import { rotateAroundX, rotateAroundY, rotateFromCenter } from '../src/rotation.js';
import { projectOrthographic, invertOrthographic } from '../src/orthographic.js';
import { applyTransform, invertTransform } from '../src/transform.js';

const fmt = (values) => `[${values.map((v) => v.toFixed(4)).join(', ')}]`;

const tokyo = [139.69, 35.69];
const center = { lon: 127, lat: 37 };
const RADIUS = 180;
const layout = { tx: 210, ty: 210, k: 1 };

console.log('--- 그리는 순서 ---');
const vector = lonLatToVector(tokyo);
console.log('1) 경위도                       ', fmt(tokyo));
console.log('2) 3차원 단위벡터               ', fmt(vector));
const aroundY = rotateAroundY(vector, -center.lon * DEG);
const aroundX = rotateAroundX(aroundY, center.lat * DEG);
console.log('3) 회전: Y축 -127°              ', fmt(aroundY));
console.log('         이어서 X축 +37°        ', fmt(aroundX), '<- z >= 0이면 앞면');
const projected = projectOrthographic(tokyo, center);
const local = { x: projected.x * RADIUS, y: -projected.y * RADIUS };
console.log('4) 직교 투영 (x, y)             ', fmt([projected.x, projected.y]), projected.visible);
console.log('   반지름 180 곱하고 y 뒤집기   ', fmt([local.x, local.y]));
const screen = applyTransform(layout, local.x, local.y);
console.log('5) translate(210 210) 적용      ', fmt([screen.x, screen.y]));

console.log('--- 역변환 순서 ---');
console.log('1) 화면 좌표                    ', fmt([screen.x, screen.y]));
const back = invertTransform(layout, screen.x, screen.y);
console.log('2) transform 역변환             ', fmt([back.x, back.y]));
const unit = { x: back.x / RADIUS, y: -back.y / RADIUS };
const z = Math.sqrt(1 - unit.x ** 2 - unit.y ** 2);
console.log('3) 역직교투영: 단위 원판 + z 복원', fmt([unit.x, unit.y, z]));
const unrotated = rotateFromCenter([unit.x, unit.y, z], center);
console.log('4) 역회전                       ', fmt(unrotated));
console.log('5) 경위도                       ', fmt(vectorToLonLat(unrotated)));
console.log('   (중심을 0,0으로 가정한 경우) ', fmt(invertOrthographic(unit.x, unit.y, { lon: 0, lat: 0 })));
