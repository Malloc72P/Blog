export interface BallModelOptions {
  x: number;
  y: number;
  dx: number;
  dy: number;
  width: number;
  height: number;
  containerX: number;
  containerY: number;
  speed?: number;
  radius?: number;
}

export class BallModel implements BallModelOptions {
  public x: number;
  public y: number;
  public dx: number;
  public dy: number;
  public width: number;
  public height: number;
  public containerX: number;
  public containerY: number;
  public speed: number;
  public radius: number;

  constructor(options: BallModelOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.containerX = options.containerX;
    this.containerY = options.containerY;
    this.speed = options.speed ?? 1;
    this.radius = options.radius ?? 16;
    this.dx = options.dx;
    this.dy = options.dy;
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    const r2 = 2 * this.radius;

    if (this.x < 0) {
      this.x = 0;
      this.dx *= -1;
    } else if (this.x > this.containerX - r2) {
      this.x = this.containerX - r2;
      this.dx *= -1;
    }

    if (this.y < 0) {
      this.y = 0;
      this.dy *= -1;
    } else if (this.y > this.containerY - r2) {
      this.y = this.containerY - r2;
      this.dy *= -1;
    }
  }
}
