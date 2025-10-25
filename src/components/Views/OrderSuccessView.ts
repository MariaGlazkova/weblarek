import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IOrderSuccessData {
  total: number;
}

export class OrderSuccessView extends Component<IOrderSuccessData> {
  protected description: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonClose: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
  }

  setTotal(total: number): void {
    this.totalElement.textContent = `Списано ${total} синапсов`;
  }
}
