import { ProductCard } from './ProductCard';
import { ensureElement, setElementData } from '../../utils/utils';
import { IProduct } from '../../types';
import { Basket } from '../Models/Basket';
import { Products } from '../Models/Products';
import { ModalView } from './ModalView';

export class PreviewProductCard extends ProductCard {
  protected description: HTMLElement;
  private basketModel: Basket;
  private productsModel: Products;
  private modalView: ModalView;

  constructor(container: HTMLElement, basketModel: Basket, productsModel: Products, modalView: ModalView) {
    super(container);
    this.description = ensureElement<HTMLElement>('.card__text', this.container);
    this.basketModel = basketModel;
    this.productsModel = productsModel;
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
            this.basketModel.remove(data.id!);
            this.modalView.close();
          });
        } else {
          this.setButtonLabel('Купить');
          this.button.disabled = false;
          this.button.addEventListener('click', () => {
            if (data.id) {
              // Получаем полный объект товара из модели
              const product = this.productsModel.getItemById(data.id);
              if (product) {
                this.basketModel.add(product);
              }
            }
            this.modalView.close();
          });
        }
      }
    }

    return this.container;
  }
}
