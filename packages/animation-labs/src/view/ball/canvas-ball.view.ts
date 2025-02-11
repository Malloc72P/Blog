import { BallModel } from '@model/ball';
import { CanvasAnimationViewer } from '@view/renderer/CanvasAnimationViewer';

export class CanvasBallView {
  constructor(public model: BallModel) {}

  render(viewer: CanvasAnimationViewer) {
    this.model.move();

    this.drawCircle(viewer, this.model.x, this.model.y, this.model.radius, 'red');
  }

  private drawCircle(
    viewer: CanvasAnimationViewer,
    x: number,
    y: number,
    radius: number,
    color: string
  ) {
    const ctx = viewer.ctx;

    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
