import { Property, dump } from './registry.js';

export class MapLegend {
  @Property
  visible: boolean = true;
}

new MapLegend();
dump('map 번들 로드 후:');
