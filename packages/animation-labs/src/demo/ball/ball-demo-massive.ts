import { BallModel, BallModelOptions, BallView } from '../../main';
import { createBallModels } from '../utils/ball-demo-util';

const container = document.getElementById('container');

if (!container) {
  throw new Error('no container');
}

const options: BallModelOptions[] = createBallModels(1000, 600, 600);

const ballView = options
  .map((option) => new BallModel(option))
  .map((model) => new BallView(container, model));

ballView.forEach((view) => view.start());
