import { ProductCard } from './ProductCard';
import { ensureElement, setElementData } from '../../utils/utils';
import { IProduct } from '../../types';
import { Basket } from '../Models/Basket';

export class PreviewProductCard extends ProductCard {
  protected description: HTMLElement;
  private basketModel: Basket;

  constructor(container: HTMLElement, basketModel: Basket) {
    super(container);
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.basketModel = basketModel;
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
            this.button!.dispatchEvent(new CustomEvent('product:remove', {
              detail: { id: data.id },
              bubbles: true
            }));
            this.button!.dispatchEvent(new CustomEvent('modal:close', {
              bubbles: true
            }));
          });
        } else {
          this.setButtonLabel('Купить');
          this.button.disabled = false;
          this.button.addEventListener('click', () => {
            this.button!.dispatchEvent(new CustomEvent('product:add', {
              detail: { id: data.id },
              bubbles: true
            }));
            this.button!.dispatchEvent(new CustomEvent('modal:close', {
              bubbles: true
            }));
          });
        }
      }
    }

    return this.container;
  }
}
