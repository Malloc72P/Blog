// TitleModel만 쓰는 엔트리. LegendModel은 모듈 그래프에 없다
import { getProperties } from './property.js';
import { TitleModel } from './title-decorated.js';

const model = new TitleModel();
console.log(model.text, getProperties(model).length);
