import { TitleModel } from '../01-emit/model.js';
import 'reflect-metadata';

const proto = TitleModel.prototype;

console.log('text:', Reflect.getMetadata('design:type', proto, 'text'));
console.log('text의 메타데이터 키:', Reflect.getMetadataKeys(proto, 'text'));
