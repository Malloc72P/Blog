// 자바스크립트 배열의 내부 동작을 "직접 실행해서" 확인하는 데모 모음.
// 실행: node src/index.mjs

// 한 섹션의 제목을 보기 좋게 출력하는 작은 헬퍼.
const section = (title) => console.log(`\n=== ${title} ===`);

// 1) 배열은 사실 객체다. 인덱스는 사실 "키"다.
section('1. 배열은 인덱스를 키로 가지는 객체');
{
  // 평범한 배열을 하나 만든다.
  const arr = ['a', 'b', 'c'];
  // for...in은 객체의 "키"를 순회한다. 배열에 쓰면 인덱스가 키로 나온다.
  const keys = [];
  for (const key in arr) keys.push(key);
  // 인덱스가 문자열 키라는 사실을 그대로 보여준다.
  console.log('for...in 키:', keys); // ['0', '1', '2']
  // 대괄호 접근은 객체의 속성 접근과 동일하다. 문자열 키로도 접근된다.
  console.log("arr['1'] === arr[1]:", arr['1'] === arr[1]); // true
  // 배열도 객체이므로 인덱스가 아닌 속성을 붙일 수 있다(권장하진 않는다).
  arr.note = 'hello';
  // 단, 인덱스가 아닌 속성은 length에 포함되지 않는다.
  console.log('length:', arr.length, '/ note:', arr.note); // 3 / hello
}

// 2) length는 "최대 인덱스 + 1"을 따라 자동으로 움직인다.
section('2. length는 인덱스에 따라 자동 증감');
{
  const arr = [];
  console.log('초기 length:', arr.length); // 0
  // push는 "현재 length를 키로" 값을 넣고 length를 1 늘리는 것과 같다.
  arr.push('x');
  console.log("push 후 → arr[0]:", arr[0], '/ length:', arr.length); // x / 1
  // 인덱스 5에 직접 값을 넣으면 length가 6으로 점프한다(중간은 비어 있는 채로).
  arr[5] = 'y';
  console.log('arr[5] 할당 후 length:', arr.length); // 6
  // length를 줄이면 뒤쪽 원소가 잘려 나간다.
  arr.length = 1;
  console.log('length=1로 줄인 뒤:', arr); // [ 'x' ]
}

// 3) 구멍 난 배열(sparse array)과 delete의 함정.
section('3. sparse array와 delete');
{
  const arr = [1, 2, 3];
  // delete는 "그 자리의 값만" 지운다. length는 그대로다.
  delete arr[1];
  console.log('delete arr[1] 후:', arr, '/ length:', arr.length); // [ 1, <1 empty item>, 3 ] / 3
  // 구멍은 undefined와 다르다. in 연산자로 키 존재 여부를 확인하면 false.
  console.log('1 in arr:', 1 in arr, '/ 2 in arr:', 2 in arr); // false / true
  // forEach 등 일부 메서드는 구멍을 아예 건너뛴다.
  const visited = [];
  arr.forEach((v, i) => visited.push(i));
  console.log('forEach가 방문한 인덱스:', visited); // [ 0, 2 ]  ← 1은 건너뜀
}

// 4) 유사 배열(array-like)을 진짜 배열처럼 다루기.
section('4. 유사 배열 다루기');
{
  // 길이와 숫자 키만 가진 "유사 배열" 객체. prototype이 Array가 아니다.
  const arrayLike = { 0: 'first', 1: 'second', 2: 'third', length: 3 };
  // 그래서 배열 메서드가 아예 없다.
  console.log('arrayLike.map 존재?', typeof arrayLike.map); // undefined
  // 방법 A) Array.from으로 진짜 배열로 복사한다.
  const real = Array.from(arrayLike);
  console.log('Array.from 결과:', real, '/ map 가능:', typeof real.map); // [...] / function
  console.log('map 적용:', real.map((s) => s.toUpperCase())); // [ 'FIRST', 'SECOND', 'THIRD' ]
  // 방법 B) Array.prototype의 메서드를 call로 "빌려" 쓴다.
  const borrowed = [];
  Array.prototype.forEach.call(arrayLike, (s) => borrowed.push(s));
  console.log('forEach.call로 빌려 쓰기:', borrowed); // [ 'first', 'second', 'third' ]
}

// 5) 배열인지 확실하게 판별하기.
section('5. 배열 판별: isArray vs toString.call');
{
  const real = [1, 2, 3];
  const arrayLike = { 0: 'a', length: 1 };
  // 가장 명확한 방법.
  console.log('Array.isArray(real):', Array.isArray(real)); // true
  console.log('Array.isArray(arrayLike):', Array.isArray(arrayLike)); // false
  // typeof는 배열을 구분하지 못한다(둘 다 'object').
  console.log("typeof real:", typeof real, "/ typeof arrayLike:", typeof arrayLike); // object / object
  // 구형 환경 호환용으로 쓰던 방식.
  const tag = (x) => Object.prototype.toString.call(x);
  console.log('toString.call(real):', tag(real)); // [object Array]
  console.log('toString.call(arrayLike):', tag(arrayLike)); // [object Object]
}

console.log('\n모든 데모 실행 완료.');
