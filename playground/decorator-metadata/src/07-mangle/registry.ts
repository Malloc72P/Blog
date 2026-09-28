// 이름을 키로 쓰는 전역 저장소. 번들 두 개가 같은 저장소를 쓰는 상황을 흉내 낸다.
const globalRef = globalThis as { __propertyRegistry?: Map<string, string[]> };
const registry = (globalRef.__propertyRegistry ??= new Map<string, string[]>());

export function Property(target: object, propertyKey: string) {
  const name = target.constructor.name;
  const list = registry.get(name) ?? [];
  list.push(propertyKey);
  registry.set(name, list);
}

export function dump(label: string) {
  console.log(label, Object.fromEntries(registry));
}
