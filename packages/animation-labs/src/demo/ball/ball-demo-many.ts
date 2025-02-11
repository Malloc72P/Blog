import { BallModel, BallModelOptions } from '@model/ball';
import { BallView } from '@view/ball';
import { createBallModels } from '../utils/ball-demo-util';

const container = document.getElementById('container');

if (!container) {
  throw new Error('no container');
}

const options: BallModelOptions[] = createBallModels(50);

const ballView = options
  .map((option) => new BallModel(option))
  .map((model) => new BallView(container, model));

ballView.forEach((view) => view.start());
