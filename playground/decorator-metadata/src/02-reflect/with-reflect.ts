import 'reflect-metadata';
import { TitleModel } from '../01-emit/model.js';

const proto = TitleModel.prototype;

console.log('text:', Reflect.getMetadata('design:type', proto, 'text'));
console.log('fontSize:', Reflect.getMetadata('design:type', proto, 'fontSize'));
console.log('text의 메타데이터 키:', Reflect.getMetadataKeys(proto, 'text'));
