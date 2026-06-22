// never를 활용한 빠짐없는 분기 검사(exhaustive check) 예제.
// 모든 케이스를 처리했을 때만 컴파일이 통과한다.

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    default: {
      // 모든 케이스를 처리했다면, 여기 도달하는 shape의 타입은 never다.
      // never가 아닌 값이 흘러오면 컴파일 에러가 나, 케이스 누락을 잡아낸다.
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

console.log(area({ kind: 'circle', radius: 2 }).toFixed(2)); // 12.57
console.log(area({ kind: 'square', size: 3 })); // 9
