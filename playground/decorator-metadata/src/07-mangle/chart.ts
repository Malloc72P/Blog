import { Property, dump } from './registry.js';

export class ChartTitle {
  @Property
  visible: boolean = true;
}

new ChartTitle();
dump('chart 번들 로드 후:');
