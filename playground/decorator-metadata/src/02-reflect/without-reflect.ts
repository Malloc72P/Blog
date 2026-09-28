import { TitleModel } from '../01-emit/model.js';

console.log('Reflect.metadata 타입:', typeof (Reflect as { metadata?: unknown }).metadata);

new TitleModel();
new TitleModel();
console.log('인스턴스 2개 생성 완료');
