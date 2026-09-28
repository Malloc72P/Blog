function Property(label: string) {
  return function (target: object, propertyKey: string) {
    console.log(`Property('${label}') 호출: ${propertyKey}`);
  };
}

export class TitleModel {
  @Property('제목')
  text: string = '';

  @Property('글자 크기')
  fontSize: number = 12;
}
