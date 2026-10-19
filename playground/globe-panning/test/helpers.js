// 테스트 보조: 시드를 고정한 난수 생성기와 무작위 경위도/중심 생성
export function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    // mulberry32
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 경도 -180~180, 위도는 극점 근처(경도가 모호해지는 곳)를 피해 -85~85 */
export function randomLonLat(random) {
  return [random() * 360 - 180, random() * 170 - 85];
}

export function randomCenter(random) {
  const [lon, lat] = randomLonLat(random);
  return { lon, lat };
}

/** 두 경도의 차이를 -180~180 범위로 맞춘다. */
export function lonDifference(a, b) {
  return ((((a - b) % 360) + 540) % 360) - 180;
}
