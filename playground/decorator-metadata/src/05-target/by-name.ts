interface PropertyInfo {
  key: string;
  label: string;
}

// 클래스 이름을 키로 속성 정보를 모아 두는 저장소
const registry = new Map<string, PropertyInfo[]>();

let registeredTarget: object | undefined;

function Property(label: string) {
  return function (target: object, propertyKey: string) {
    registeredTarget = target;
    console.log('등록 시점 target.constructor.name:', target.constructor.name);

    const name = target.constructor.name;
    const list = registry.get(name) ?? [];
    list.push({ key: propertyKey, label });
    registry.set(name, list);
  };
}

function getProperties(target: object) {
  return registry.get(target.constructor.name);
}

class TitleModel {
  @Property('제목')
  text: string = '';
}

console.log('인스턴스로 조회:', getProperties(new TitleModel()));
console.log('클래스로 조회:', getProperties(TitleModel));
console.log('TitleModel.constructor.name:', TitleModel.constructor.name);
console.log('등록 시점 target === TitleModel.prototype:', registeredTarget === TitleModel.prototype);
