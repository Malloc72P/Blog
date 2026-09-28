import { Property, getProperties } from './registry.js';

export class MapLegend {
  @Property
  visible: boolean = true;
}

console.log('map 번들 MapLegend 이름:', MapLegend.name, '/ 속성:', getProperties(MapLegend));
