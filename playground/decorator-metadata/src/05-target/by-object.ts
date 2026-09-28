interface PropertyInfo {
  key: string;
  label: string;
}

// 클래스(생성자 함수) 객체 자체를 키로 쓰는 저장소
const registry = new WeakMap<Function, PropertyInfo[]>();

// 프로토타입이 넘어오면 constructor를, 클래스가 넘어오면 그대로 쓴다
function toClass(target: object): Function {
  return typeof target === 'function' ? target : target.constructor;
}

function Property(label: string) {
  return function (target: object, propertyKey: string) {
    const cls = toClass(target);
    const list = registry.get(cls) ?? [];
    list.push({ key: propertyKey, label });
    registry.set(cls, list);
  };
}

function getProperties(target: object) {
  return registry.get(toClass(target));
}

class TitleModel {
  @Property('제목')
  text: string = '';
}

console.log('인스턴스로 조회:', getProperties(new TitleModel()));
console.log('클래스로 조회:', getProperties(TitleModel));
