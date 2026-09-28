// 클래스 객체를 키로 쓰는 전역 저장소. 07-mangle과 같은 상황에서 비교한다.
const globalRef = globalThis as { __propertyRegistryByClass?: WeakMap<Function, string[]> };
const registry = (globalRef.__propertyRegistryByClass ??= new WeakMap<Function, string[]>());

function toClass(target: object): Function {
  return typeof target === 'function' ? target : target.constructor;
}

export function Property(target: object, propertyKey: string) {
  const cls = toClass(target);
  const list = registry.get(cls) ?? [];
  list.push(propertyKey);
  registry.set(cls, list);
}

export function getProperties(target: object): string[] {
  return registry.get(toClass(target)) ?? [];
}
