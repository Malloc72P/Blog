// LegendModel은 가져오지 않는다
import { TitleModel, getProperties } from './lib-decorated.js';

const model = new TitleModel();
console.log(model.text, getProperties(model).length);
