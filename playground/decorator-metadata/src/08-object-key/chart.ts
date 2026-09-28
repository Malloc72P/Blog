import { Property, getProperties } from './registry.js';

export class ChartTitle {
  @Property
  visible: boolean = true;
}

console.log('chart 번들 ChartTitle 이름:', ChartTitle.name, '/ 속성:', getProperties(ChartTitle));
