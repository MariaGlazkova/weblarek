import { ProductCard } from './ProductCard';
import { ensureElement, setElementData } from '../../utils/utils';
import { IProduct } from '../../types';

export class PreviewProductCard extends ProductCard {
  protected description: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
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
        this.setButtonLabel('Нельзя купить');
        this.button.disabled = true;
      } else {
        this.setButtonLabel('В корзину');
        this.button.disabled = false;
        this.button.addEventListener('click', () => {
          this.button!.dispatchEvent(new CustomEvent('product:add', {
            detail: { id: data.id },
            bubbles: true
          }));
        });
      }
    }

    return this.container;
  }
}
