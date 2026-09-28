// hasOwn 확인 없이 부모 배열에 그대로 추가하는 버전. standard.ts와 비교한다.
// Node 22에는 Symbol.metadata가 없어서 먼저 채워 둔다
(Symbol as { metadata?: symbol }).metadata ??= Symbol('Symbol.metadata');

function Property(label: string) {
  return function (_value: undefined, context: ClassFieldDecoratorContext) {
    const saved = context.metadata.properties;
    const list: string[] = Array.isArray(saved) ? saved : [];
    list.push(`${String(context.name)}:${label}`);
    context.metadata.properties = list;
  };
}

class TitleModel {
  @Property('제목')
  text: string = '';
}

class SubTitleModel extends TitleModel {
  @Property('부제')
  subtitle: string = '';
}

console.log('TitleModel:', TitleModel[Symbol.metadata]);
console.log('SubTitleModel:', SubTitleModel[Symbol.metadata]);
console.log('자식 메타데이터의 프로토타입이 부모 메타데이터:', Object.getPrototypeOf(SubTitleModel[Symbol.metadata]) === TitleModel[Symbol.metadata]);
