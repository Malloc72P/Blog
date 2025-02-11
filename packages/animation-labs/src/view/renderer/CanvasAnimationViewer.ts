import { CanvasBallView } from '@view/ball';

export interface CanvasAnimationViewerOptions {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export class CanvasAnimationViewer {
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private animationId: number = -1;
  private items: CanvasBallView[] = [];
  private _ctx: CanvasRenderingContext2D;

  constructor(options: CanvasAnimationViewerOptions) {
    this.canvas = options.canvas;
    this.width = options.width;
    this.height = options.height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const ctxOptional = this.canvas.getContext('2d');

    if (!ctxOptional) {
      throw new Error('no canvas context');
    }

    this._ctx = ctxOptional;
  }

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  addItems(...items: CanvasBallView[]) {
    this.items.push(...items);
  }

  start() {
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animationId);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const item of this.items) {
      item.render(this);
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
