import { getRandomInt } from '@demo/utils/demo-util';
import { BallModelOptions } from '@model/ball';

export function createBallModels(itemCount: number, width: number = 300, height: number = 300) {
  const options: BallModelOptions[] = new Array(itemCount).fill(0).map((v, i) => ({
    x: getRandomInt(1, width),
    y: getRandomInt(1, height),
    dx: i % 2 === 0 ? -1 : 1,
    dy: i % 3 === 0 ? -1 : 1,
    width: 32,
    height: 32,
    containerX: width,
    containerY: height,
    speed: getRandomInt(3, 10),
  }));

  return options;
}
