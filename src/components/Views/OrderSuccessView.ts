import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { APP_EVENTS } from '../base/Events';
import { EventEmitter } from '../base/Events';

export interface IOrderSuccessData {
  total: number;
}

export class OrderSuccessView extends Component<IOrderSuccessData> {
  protected totalElement: HTMLElement;
  protected buttonClose: HTMLButtonElement;
  protected eventEmitter: EventEmitter;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.buttonClose.addEventListener('click', this.eventEmitter.trigger(APP_EVENTS.MODAL.CLOSE));
  }

  setTotal(total: number): void {
    this.totalElement.textContent = `Списано ${total} синапсов`;
  }

  render(data?: Partial<IOrderSuccessData>): HTMLElement {
    if (data?.total !== undefined) {
      this.setTotal(data.total);
    }
    return this.container;
  }
}
