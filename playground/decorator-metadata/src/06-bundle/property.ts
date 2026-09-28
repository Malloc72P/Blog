export interface PropertyInfo {
  key: string;
  label: string;
  editor: 'text' | 'number' | 'color';
}

const registry = new WeakMap<Function, PropertyInfo[]>();

function toClass(target: object): Function {
  return typeof target === 'function' ? target : target.constructor;
}

export function Property(label: string, editor: PropertyInfo['editor']) {
  return function (target: object, propertyKey: string) {
    const cls = toClass(target);
    const list = registry.get(cls) ?? [];
    list.push({ key: propertyKey, label, editor });
    registry.set(cls, list);
  };
}

export function getProperties(target: object): PropertyInfo[] {
  return registry.get(toClass(target)) ?? [];
}
