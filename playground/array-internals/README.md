# array-internals

자바스크립트 배열의 내부 동작을 "직접 실행해서" 확인하는 예제입니다.
블로그 포스트 [자바스크립트 배열의 내부 동작 원리]의 코드를 모아 두었습니다.

의존성이 전혀 없으며, Node.js만 있으면 됩니다. (개발 시 `node v22`로 검증)

## 실행 방법

```bash
# 1) 배열=객체, length 동작, sparse/delete, 유사 배열, 배열 판별 데모
npm start        # 또는: node src/index.mjs

# 2) push vs unshift / pop vs shift 실제 속도 측정
npm run bench    # 또는: node src/benchmark.mjs
```

## 파일 구성

- `src/index.mjs` — 배열이 인덱스를 키로 가지는 객체라는 점, `length`의 자동 증감,
  `delete`와 sparse array, 유사 배열 변환(`Array.from`, `Array.prototype.forEach.call`),
  `Array.isArray` vs `Object.prototype.toString.call`을 콘솔로 출력합니다.
- `src/benchmark.mjs` — N=100,000에 대해 `push`/`unshift`, `pop`/`shift`의
  소요 시간을 `performance.now()`로 측정합니다(라운드 5회 중앙값).

## 측정 예시 (node v22, Apple Silicon)

```
N = 100,000 (라운드 5회 중앙값)

[추가] 끝 vs 앞
  push    : 0.6 ms
  unshift : 789 ms   → push 대비 약 1300배 느림

[제거] 끝 vs 앞
  pop     : 3.4 ms
  shift   : 791 ms   → pop 대비 약 230배 느림
```

수치는 환경에 따라 달라지지만, **앞에서 작업하는 unshift/shift가 끝에서 작업하는
push/pop보다 압도적으로 느리다**는 경향은 동일합니다.
