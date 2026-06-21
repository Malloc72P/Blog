// 프로토타입과 프로토타입 체인을 직접 눈으로 확인하기 위한 예제 모음.
// node src/index.mjs 로 실행하면 각 실험의 결과가 콘솔에 순서대로 출력된다.

// 보기 좋게 섹션 제목을 출력하는 작은 헬퍼.
function section(title) {
  console.log('\n' + '='.repeat(48)); // 구분선으로 섹션을 나눈다.
  console.log('# ' + title); // 섹션 제목을 출력한다.
  console.log('='.repeat(48)); // 구분선으로 섹션을 닫는다.
}

// 어떤 객체의 프로토타입 체인을 끝(null)까지 따라 올라가며 각 단계의 이름을 모아준다.
function chainOf(obj) {
  const names = []; // 체인의 각 단계 이름을 담을 배열.
  let current = Object.getPrototypeOf(obj); // 첫 프로토타입으로 이동한다.
  while (current !== null) {
    // 생성자 이름이 있으면 그걸, 없으면 '익명'으로 표시한다.
    const ctorName = current.constructor ? current.constructor.name : '익명';
    names.push(ctorName + '.prototype'); // 'Xxx.prototype' 형태로 기록한다.
    current = Object.getPrototypeOf(current); // 한 단계 위로 올라간다.
  }
  names.push('null'); // 체인의 끝은 항상 null이다.
  return names.join(' -> '); // 화살표로 이어 한 줄 문자열로 만든다.
}

// ---------------------------------------------------------------
section('1. 세 가지 방법으로 만든 객체의 프로토타입 체인');

// (1) 객체 리터럴
const literal = { name: '리터럴' };
console.log('객체 리터럴 :', 'literal ->', chainOf(literal));

// (2) 생성자 함수
function Animal(name) {
  this.name = name; // 인스턴스 고유 속성.
}
const dog = new Animal('멍멍이');
console.log('생성자 함수 :', 'dog ->', chainOf(dog));

// (3) class 문법
class Robot {
  constructor(name) {
    this.name = name;
  }
}
const r2d2 = new Robot('R2-D2');
console.log('class 인스턴스 :', 'r2d2 ->', chainOf(r2d2));

// ---------------------------------------------------------------
section('2. 인스턴스에 없는 메서드를 호출하면 프로토타입에서 찾는다');

const nums = [3, 1, 2]; // 평범한 배열 리터럴.
// sort는 nums 자신이 가진 속성이 아니다.
console.log('nums가 sort를 직접 가졌나? ', nums.hasOwnProperty('sort'));
// 그런데도 호출이 된다. 엔진이 Array.prototype까지 올라가 sort를 찾았기 때문.
console.log('nums.sort() 결과       : ', nums.sort());
// sort의 실제 위치는 Array.prototype이다.
console.log('Array.prototype이 sort를 가졌나? ', Array.prototype.hasOwnProperty('sort'));

// ---------------------------------------------------------------
section('3. hasOwnProperty로 자기 속성과 상속 속성을 구분한다');

Animal.prototype.legs = 4; // 프로토타입에 공유 속성을 둔다.
const cat = new Animal('야옹이'); // name은 인스턴스 고유, legs는 프로토타입에서 상속.
console.log("cat.name :", cat.name, '/ 자기 속성?', cat.hasOwnProperty('name'));
console.log("cat.legs :", cat.legs, '/ 자기 속성?', cat.hasOwnProperty('legs'));
console.log("'legs' in cat (상속 포함 조회) :", 'legs' in cat);

// ---------------------------------------------------------------
section('4. 프로토타입에 메서드를 추가하면 기존 인스턴스에도 즉시 반영된다');

const before = new Animal('이미-만든-객체'); // 메서드 추가 전에 만든 인스턴스.
console.log('추가 전 speak 타입 :', typeof before.speak); // 아직 undefined.

// 인스턴스를 만든 뒤에 프로토타입에 메서드를 추가한다.
Animal.prototype.speak = function () {
  return `${this.name}: 멍!`;
};

// 이미 만들어 둔 인스턴스도 같은 프로토타입을 참조하므로 바로 사용할 수 있다.
console.log('추가 후 before.speak() :', before.speak());

// ---------------------------------------------------------------
section('5. class extends 와 Object.create 기반 수동 상속 비교');

// (A) class 문법으로 상속을 구현한다.
class Base {
  hello() {
    return 'hello from Base';
  }
}
class Child extends Base {
  hi() {
    return 'hi from Child';
  }
}
const a = new Child();

// (B) 같은 구조를 Object.create로 손수 엮는다.
function ManualBase() {}
ManualBase.prototype.hello = function () {
  return 'hello from Base';
};
function ManualChild() {}
// ManualChild.prototype의 프로토타입을 ManualBase.prototype으로 연결한다.
ManualChild.prototype = Object.create(ManualBase.prototype);
// 기본값이 ManualBase로 어긋난 constructor를 다시 ManualChild로 바로잡는다.
ManualChild.prototype.constructor = ManualChild;
ManualChild.prototype.hi = function () {
  return 'hi from Child';
};
const b = new ManualChild();

console.log('class    : hi=', a.hi(), '/ hello=', a.hello());
console.log('manual   : hi=', b.hi(), '/ hello=', b.hello());
console.log('두 결과가 같은가? ',
  a.hi() === b.hi() && a.hello() === b.hello());

// ---------------------------------------------------------------
section('6. 체인의 끝은 Object.prototype -> null 이다');

console.log('Child 인스턴스 체인 :', 'a ->', chainOf(a));
// Object.prototype의 프로토타입이 곧 체인의 종점.
console.log('Object.prototype의 프로토타입 :', Object.getPrototypeOf(Object.prototype));
