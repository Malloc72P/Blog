// 타입 단언(as)이 컴파일러 검사를 어떻게 우회하는지 보여주는 예제.
// 컴파일은 통과하지만 런타임에 터진다.

// 서버 응답처럼, 타입을 알 수 없는 값이라고 가정한다.
const raw: unknown = JSON.parse('"42"'); // 실제 값은 문자열 "42"

// "이건 number라고 내가 보증할게" 하고 단언하면
// 컴파일러는 더 이상 raw의 실제 타입을 검사하지 않는다.
const price = raw as number;

// 타입 검사는 통과한다. price는 number로 취급되기 때문이다.
// 하지만 런타임에는 문자열에 toFixed가 없어 TypeError가 발생한다.
console.log(price.toFixed(2));
