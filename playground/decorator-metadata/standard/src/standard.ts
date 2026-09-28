// Node 22에는 Symbol.metadata가 없어서 먼저 채워 둔다
(Symbol as { metadata?: symbol }).metadata ??= Symbol('Symbol.metadata');

function Property(label: string) {
  return function (_value: undefined, context: ClassFieldDecoratorContext) {
    const { metadata } = context;

    // 자기 배열이 없으면 부모 배열을 복사해 새로 만든다
    if (!Object.hasOwn(metadata, 'properties')) {
      const inherited = metadata.properties;
      metadata.properties = Array.isArray(inherited) ? [...inherited] : [];
    }

    const list = metadata.properties;
    if (Array.isArray(list)) {
      list.push(`${String(context.name)}:${label}`);
    }
  };
}

class TitleModel {
  @Property('제목')
  text: string = '';

  @Property('글자 크기')
  fontSize: number = 12;
}

class SubTitleModel extends TitleModel {
  @Property('부제')
  subtitle: string = '';
}

console.log('TitleModel:', TitleModel[Symbol.metadata]);
console.log('SubTitleModel:', SubTitleModel[Symbol.metadata]);
