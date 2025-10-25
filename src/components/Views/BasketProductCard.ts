import { ProductCard } from './ProductCard';
import { setElementData, ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { Basket } from '../Models/Basket';
import { APP_EVENTS } from '../base/Events';

export class BasketProductCard extends ProductCard {
  protected indexElement: HTMLElement;
  private basketModel: Basket;

  constructor(container: HTMLElement, basketModel: Basket) {
    super(container);
    this.basketModel = basketModel;
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
  }

  render(data: Partial<IProduct>, index?: number): HTMLElement {
    super.render(data);

    if (data.id) {
      setElementData(this.container, { id: data.id });
    }

    if (index !== undefined) {
      this.setIndex(index);
    }

    if (this.button) {
      this.button.addEventListener('click', () => {
        this.basketModel.emit(APP_EVENTS.PRODUCTS.REMOVE, { id: data.id! });
      });
    }
    return this.container;
  }

  setIndex(index: number): void {
    this.indexElement.textContent = index.toString();
  }
}
