import { ProductCard } from './ProductCard';
import { setElementData } from '../../utils/utils';
import { IProduct } from '../../types';

export class BasketProductCard extends ProductCard {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);
    this.setButtonLabel('Удалить');

    if (data.id) {
      setElementData(this.container, { id: data.id });
    }

    if (this.button) {
      this.button.addEventListener('click', () => {
        this.button!.dispatchEvent(new CustomEvent('product:remove', {
          detail: { id: data.id },
          bubbles: true
        }));
      });
    }
    return this.container;
  }
}
