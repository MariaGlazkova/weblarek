import { ProductCard } from './ProductCard';
import { setElementData } from '../../utils/utils';
import { IProduct } from '../../types';
import { Products } from '../Models/Products';

export class CatalogProductCard extends ProductCard {
  private productsModel: Products;

  constructor(container: HTMLElement, productsModel: Products) {
    super(container);
    this.productsModel = productsModel;
  }

  render(data: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (data.id) {
      setElementData(this.container, { id: data.id });
    }

    this.container.addEventListener('click', () => {
      this.productsModel.setSelectedId(data.id!);
    });
    return this.container;
  }
}
