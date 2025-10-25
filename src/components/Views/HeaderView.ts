import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IHeaderData {
  counter: number;
}

export class HeaderView extends Component<IHeaderData> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
  }

  setCounter(value: number): void {
    if (this.counterElement) {
      this.counterElement.textContent = value.toString();
    }
  }
}
