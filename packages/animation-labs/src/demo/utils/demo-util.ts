export function getRandomInt(min: number, max: number) {
  // min, max 범위를 벗어나는 실수가 나오지 않도록 올림/내림을 고려합니다.
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  // Math.random() * (차이 + 1)을 통해 0 <= x < (차이+1)의 난수를 만들고,
  // floor를 씌우고 minCeil을 더해 실제 범위를 맞춥니다.
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}
