import * as ms from 'ms';
import { BaseComponent } from './base.component';

export class BaseController extends BaseComponent {
  async sleep(msString: ms.StringValue): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms(msString));
    });
  }
}
