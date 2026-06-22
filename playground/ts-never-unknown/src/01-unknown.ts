// unknown: any보다 안전한 꼭대기 타입(top type) 예제.
// unknown 값은 좁히기 전에는 거의 아무 연산도 허용되지 않는다.

// 서버 응답이나 사용자 입력처럼, 무엇이 들어올지 모르는 값.
function lengthOf(input: unknown): number {
  // 아래 줄의 주석을 풀면 컴파일 에러가 난다.
  //   'input' is of type 'unknown'.
  // return input.length;

  // 좁히기를 거쳐야만 안전하게 접근할 수 있다.
  if (typeof input === 'string' || Array.isArray(input)) {
    return input.length;
  }
  return 0;
}

console.log(lengthOf('hello')); // 5
console.log(lengthOf([1, 2, 3])); // 3
console.log(lengthOf(42)); // 0

// any와의 대비: any는 검사를 통째로 끈다.
const dangerous: any = 'just a string';
// 컴파일러가 막지 않는다. 런타임에 터질 코드인데도 통과한다.
// (실행하면 TypeError가 나므로 타입 검사용으로만 둔다.)
void (() => dangerous.foo.bar.baz);

const safe: unknown = 'just a string';
// 아래 줄의 주석을 풀면 컴파일 에러가 난다.
//   'safe' is of type 'unknown'.
// safe.foo;
void safe;
