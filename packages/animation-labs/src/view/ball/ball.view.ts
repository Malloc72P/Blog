import { BallModel } from '@model/ball';

interface BallViewElementMap {
  element: SVGSVGElement;
  circle: {
    element: SVGCircleElement;
  };
}

export class BallView {
  private static readonly ClassNames = {
    root: 'al-ball-view-root',
    circle: 'al-ball-view-circle',
  };

  private root: BallViewElementMap;
  private animationId: number = -1;

  constructor(
    private container: HTMLElement,
    public model: BallModel
  ) {
    const parser = new DOMParser();

    const template = `
        <svg class="${BallView.ClassNames.root}">
            <circle 
                cx="${model.radius}" 
                cy="${model.radius}" 
                r="${model.radius}" 
                fill="tomato"
                class="${BallView.ClassNames.circle}">
            </circle>
        </svg>
        `;

    const root = parser
      .parseFromString(template.trim(), 'text/html')
      .querySelector('svg') as SVGSVGElement;

    const circle = root.querySelector('.' + BallView.ClassNames.circle) as SVGCircleElement;

    this.root = {
      element: root,
      circle: {
        element: circle,
      },
    };

    this.root.element.style.width = model.width + 'px';
    this.root.element.style.height = model.height + 'px';
    this.root.element.style.position = 'absolute';

    this.container.appendChild(this.root.element);
  }

  start() {
    this.animationId = requestAnimationFrame(this.render.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animationId);
  }

  render() {
    this.model.move();
    const rootElement = this.root.element;

    rootElement.style.left = this.model.x + 'px';
    rootElement.style.top = this.model.y + 'px';

    requestAnimationFrame(this.render.bind(this));
  }
}
