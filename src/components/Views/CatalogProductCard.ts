import { ProductCard } from './ProductCard';
import { setElementData } from '../../utils/utils';
import { IProduct } from '../../types';

export class CatalogProductCard extends ProductCard {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (data.id) {
      setElementData(this.container, { id: data.id });
    }

    this.container.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('product:select', {
        detail: { id: data.id },
        bubbles: true
      }));
    });
    return this.container;
  }
}
