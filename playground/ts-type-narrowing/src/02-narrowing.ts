// typeof / in / instanceof로 타입을 좁히는(narrowing) 예제.
// 단언 없이도 컴파일러가 분기 안에서 타입을 자동으로 좁혀준다.

// 1) typeof: 원시 타입을 좁힌다.
function format(value: string | number): string {
  if (typeof value === 'number') {
    // 이 분기 안에서 value는 number로 좁혀진다.
    return value.toFixed(2);
  }
  // 여기서는 자동으로 string으로 좁혀진다.
  return value.trim();
}

// 2) in: 속성 존재 여부로 객체 타입을 좁힌다.
interface Admin {
  role: 'admin';
  permissions: string[];
}
interface Guest {
  role: 'guest';
  expiresAt: number;
}

function describe(user: Admin | Guest): string {
  if ('permissions' in user) {
    // permissions 속성을 가진 쪽, 즉 Admin으로 좁혀진다.
    return `관리자(${user.permissions.length}개 권한)`;
  }
  // Guest로 좁혀진다.
  return `게스트(만료 ${user.expiresAt})`;
}

// 3) instanceof: 클래스 인스턴스를 좁힌다.
function dump(value: Date | string): string {
  if (value instanceof Date) {
    // Date로 좁혀져 getTime을 안전하게 쓸 수 있다.
    return String(value.getTime());
  }
  return value;
}

console.log(format(3.14159)); // 3.14
console.log(format('  hi  ')); // hi
console.log(describe({ role: 'admin', permissions: ['read', 'write'] })); // 관리자(2개 권한)
console.log(describe({ role: 'guest', expiresAt: 1000 })); // 게스트(만료 1000)
console.log(dump(new Date(0))); // 0
console.log(dump('plain')); // plain
