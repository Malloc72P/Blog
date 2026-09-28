// 아무 일도 하지 않는 데코레이터
function Noop(target: object, propertyKey: string) {}

export class LegendModel {
  @Noop
  position: string = 'bottom';
}
