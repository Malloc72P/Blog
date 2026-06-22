// 일부러 케이스를 빠뜨린 예제. exhaustive check가 컴파일 타임에 누락을 잡아낸다는 걸 보여준다.
// 메인 tsconfig의 include에서 제외돼 있고, 아래 명령으로 따로 타입 검사한다.
//   npx tsc --noEmit --strict --target ES2020 broken/exhaustive-broken.ts

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'triangle'; base: number; height: number }; // 새 변형을 추가했는데

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    // triangle 케이스를 처리하는 걸 깜빡했다.
    default: {
      // shape에는 아직 triangle 타입이 남아 있어 never가 아니다 → 컴파일 에러.
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

void area;
