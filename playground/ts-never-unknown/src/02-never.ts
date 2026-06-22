// never: 발생할 수 없는 값을 나타내는 바닥 타입(bottom type) 예제.

// 1) 불가능한 교차 타입은 never가 된다.
//    string이면서 동시에 number인 값은 존재할 수 없다.
type Impossible = string & number; // 타입은 never
const x: Impossible = 'a' as never; // never에는 어떤 값도 직접 넣을 수 없다.
void x;

// 2) 절대 정상 반환하지 않는 함수의 반환 타입은 never다.
//    예외를 던지거나 무한 루프에 빠지는 경우.
function fail(message: string): never {
  throw new Error(message);
}

function loopForever(): never {
  while (true) {
    // 빠져나오지 않는다.
  }
}

void loopForever;

// never는 모든 타입의 서브타입이라, 어떤 분기로도 합쳐질 수 있다.
function assertString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  // fail의 반환 타입이 never라, 이 분기는 값을 반환하지 않아도 된다.
  return fail('문자열이 아닙니다');
}

console.log(assertString('ok')); // ok
try {
  assertString(123);
} catch (e) {
  console.log((e as Error).message); // 문자열이 아닙니다
}
