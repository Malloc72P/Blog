import { Property } from './property.js';

export class TitleModel {
  @Property('제목', 'text')
  text: string = '';

  @Property('글자 크기', 'number')
  fontSize: number = 12;

  @Property('글자 색', 'color')
  color: string = '#000000';
}
