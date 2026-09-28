function Inspect(target: object, propertyKey: string) {
  const kind = typeof target === 'function' ? '클래스(생성자)' : '프로토타입';
  console.log(`${propertyKey}: target은 ${kind}`);
}

class TitleModel {
  @Inspect
  text: string = '';

  @Inspect
  static defaultText: string = '제목 없음';
}
