import { Logger } from '@nestjs/common';

export class BaseComponent {
  protected logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }
}
