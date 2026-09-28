import { Color } from './color.js';

function Mark(target: object, propertyKey: string) {}

export class StyleModel {
  // Color는 타입 자리에만 쓴다
  @Mark
  color?: Color;
}
