function Mark(target: object, propertyKey: string) {}

class TitleModel {
  // 같은 파일 아래쪽에 선언한 클래스를 타입으로 쓴다
  @Mark
  color?: Color;
}

class Color {}

console.log(TitleModel, Color);
