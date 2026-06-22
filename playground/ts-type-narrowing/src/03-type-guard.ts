// 사용자 정의 타입 가드(type predicate)로 단언 없이 타입을 좁히는 예제.
// 반환 타입을 'param is T'로 선언하면, true를 반환할 때 컴파일러가 param을 T로 좁힌다.

interface Cat {
  type: 'cat';
  meow(): string;
}
interface Dog {
  type: 'dog';
  bark(): string;
}

// 반환 타입이 'animal is Cat' 이다.
// 이 함수가 true를 반환하면 호출한 쪽에서 animal은 Cat으로 좁혀진다.
function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === 'cat';
}

function speak(animal: Cat | Dog): string {
  if (isCat(animal)) {
    // 타입 가드 덕분에 animal은 Cat으로 좁혀진다. 단언이 필요 없다.
    return animal.meow();
  }
  return animal.bark();
}

const cat: Cat = { type: 'cat', meow: () => '야옹' };
const dog: Dog = { type: 'dog', bark: () => '멍멍' };
console.log(speak(cat)); // 야옹
console.log(speak(dog)); // 멍멍

// getElementById 같은 현실 예시:
// 반환 타입이 HTMLElement | null 이라 곧바로 쓸 수 없다.
// as HTMLInputElement로 단언하는 대신, 타입 가드로 검증한다.
function isInput(el: HTMLElement | null): el is HTMLInputElement {
  return el instanceof HTMLInputElement;
}

function readValue(id: string): string {
  const el = document.getElementById(id);
  if (isInput(el)) {
    // el은 HTMLInputElement로 좁혀져 value에 안전하게 접근한다.
    return el.value;
  }
  return '';
}

// 브라우저 전용 함수라 노드에서는 호출하지 않는다. 타입 검사용으로만 둔다.
void readValue;
