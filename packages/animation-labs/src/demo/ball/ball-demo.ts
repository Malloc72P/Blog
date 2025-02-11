import { BallModel } from '@model/ball';
import { BallView } from '@view/ball';

const container = document.getElementById('container');

if (!container) {
  throw new Error('no container');
}

const ballModel = new BallModel({
  x: 0,
  y: 0,
  dx: 1,
  dy: 1,
  width: 32,
  height: 32,
  containerX: 300,
  containerY: 300,
});
const ballView = new BallView(container, ballModel);

ballView.start();
