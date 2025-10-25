import { ProductCard } from './ProductCard';
import { ensureElement, setElementData } from '../../utils/utils';
import { IProduct } from '../../types';
import { Basket } from '../Models/Basket';
import { ModalView } from './ModalView';
import { APP_EVENTS } from '../base/Events';

export class PreviewProductCard extends ProductCard {
  protected description: HTMLElement;
  private basketModel: Basket;
  private modalView: ModalView;

  constructor(container: HTMLElement, basketModel: Basket, modalView: ModalView) {
    super(container);
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.basketModel = basketModel;
    this.modalView = modalView;
  }

  setDescription(value: string): void {
    this.description.textContent = value;
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);
    if (data.description) this.setDescription(data.description);

    if (data.id) {
      setElementData(this.container, { id: data.id });
    }

    if (this.button) {
      if (data.price === null) {
        this.setButtonLabel('Недоступно');
        this.button.disabled = true;
      } else {
        const isInBasket = this.basketModel.has(data.id!);

        if (isInBasket) {
          this.setButtonLabel('Удалить из корзины');
          this.button.disabled = false;
          this.button.addEventListener('click', () => {
            this.basketModel.emit(APP_EVENTS.PRODUCTS.REMOVE, { id: data.id! });
            this.modalView.close();
          });
        } else {
          this.setButtonLabel('Купить');
          this.button.disabled = false;
          this.button.addEventListener('click', () => {
            this.basketModel.emit(APP_EVENTS.PRODUCTS.ADD, data as IProduct);
            this.modalView.close();
          });
        }
      }
    }

    return this.container;
  }
}
