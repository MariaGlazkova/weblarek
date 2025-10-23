import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  buttonState: boolean;
}

export class BasketView extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonOrder: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonOrder = ensureElement<HTMLButtonElement>('.basket__button', this.container);
  }

  setItems(items: HTMLElement[]): void {
    this.listElement.innerHTML = '';
    this.listElement.append(...items);
  }

  setTotal(total: number): void {
    this.totalElement.textContent = `${total} синапсов`;
  }

  setButtonState(active: boolean): void {
    this.buttonOrder.disabled = !active;
  }

  render(data: IBasketData): HTMLElement {
    this.setItems(data.items);
    this.setTotal(data.total);
    this.setButtonState(data.buttonState);
    return this.container;
  }
}
