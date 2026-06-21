// push/pop(끝)과 unshift/shift(앞)의 실제 속도 차이를 측정한다.
// 실행: node src/benchmark.mjs
// 핵심: 끝에서 작업하는 push/pop은 O(1), 앞에서 작업하는 unshift/shift는
//       모든 원소를 한 칸씩 밀어야 해서 O(n)이다. 이걸 숫자로 확인한다.

import { performance } from 'node:perf_hooks';

// 측정에 사용할 원소 개수. 너무 작으면 차이가 안 보이고, 너무 크면 unshift가 매우 오래 걸린다.
const N = 100_000;
// 측정 노이즈를 줄이기 위해 여러 번 반복하고 중앙값을 취한다.
const ROUNDS = 5;

// 콜백 한 번의 소요 시간을 ms 단위로 잰다.
function time(fn) {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// 여러 라운드 측정 후 중앙값을 돌려준다(한두 번의 GC 튐을 걸러내기 위함).
function median(fn) {
  const samples = [];
  for (let r = 0; r < ROUNDS; r++) samples.push(time(fn));
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

// --- 채우기(insert) 측정 ---

// 끝에 N번 추가: 평균 O(1)이라 매우 빠르다.
const pushTime = median(() => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.push(i);
});

// 앞에 N번 추가: 추가할 때마다 기존 원소 전부를 한 칸씩 밀어야 해서 O(n).
const unshiftTime = median(() => {
  const arr = [];
  for (let i = 0; i < N; i++) arr.unshift(i);
});

// --- 비우기(remove) 측정 ---

// 끝에서 N번 제거: O(1).
const popTime = median(() => {
  const arr = Array.from({ length: N }, (_, i) => i);
  while (arr.length) arr.pop();
});

// 앞에서 N번 제거: 제거할 때마다 나머지를 한 칸씩 당겨야 해서 O(n).
const shiftTime = median(() => {
  const arr = Array.from({ length: N }, (_, i) => i);
  while (arr.length) arr.shift();
});

// 소수점 둘째 자리로 정리.
const r = (x) => Math.round(x * 100) / 100;
// 배율 계산(느린 쪽 / 빠른 쪽).
const ratio = (slow, fast) => Math.round((slow / fast) * 10) / 10;

console.log(`N = ${N.toLocaleString()} (라운드 ${ROUNDS}회 중앙값)\n`);
console.log('[추가] 끝 vs 앞');
console.log(`  push    : ${r(pushTime)} ms`);
console.log(`  unshift : ${r(unshiftTime)} ms   → push 대비 약 ${ratio(unshiftTime, pushTime)}배 느림`);
console.log('\n[제거] 끝 vs 앞');
console.log(`  pop     : ${r(popTime)} ms`);
console.log(`  shift   : ${r(shiftTime)} ms   → pop 대비 약 ${ratio(shiftTime, popTime)}배 느림`);

// 차트 생성 등에서 그대로 쓸 수 있도록 JSON 한 줄도 출력한다.
console.log(
  '\nJSON:',
  JSON.stringify({ N, push: r(pushTime), unshift: r(unshiftTime), pop: r(popTime), shift: r(shiftTime) }),
);
