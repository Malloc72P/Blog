import 'reflect-metadata';
import { TitleModel } from '../01-emit/model.js';

class SubTitleModel extends TitleModel {}

const proto = SubTitleModel.prototype;

console.log('getMetadata:', Reflect.getMetadata('design:type', proto, 'text'));
console.log('getOwnMetadata:', Reflect.getOwnMetadata('design:type', proto, 'text'));
console.log('부모 프로토타입:', Object.getPrototypeOf(proto) === TitleModel.prototype);
