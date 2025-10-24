import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class ProductCard extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected image: HTMLImageElement | null;
  protected category: HTMLElement | null;
  protected button: HTMLButtonElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.title = ensureElement<HTMLElement>('.card__title', this.container);
    this.price = ensureElement<HTMLElement>('.card__price', this.container);

    // Категория может отсутствовать в некоторых шаблонах (например, в корзине)
    try {
      this.category = ensureElement<HTMLElement>('.card__category', this.container);
    } catch {
      this.category = null;
    }

    // Изображение может отсутствовать в некоторых шаблонах (например, в корзине)
    try {
      this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
    } catch {
      this.image = null;
    }

    // Кнопка может отсутствовать в некоторых шаблонах
    try {
      this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
    } catch {
      this.button = null;
    }
  }

  setTitle(value: string): void {
    this.title.textContent = value;
  }

  setPrice(value: number | null): void {
    if (value === null) {
      this.price.textContent = 'Бесценно';
    } else {
      this.price.textContent = `${value} синапсов`;
    }
  }

  setImageSrc(src: string, alt?: string): void {
    if (this.image) {
      const fullImageUrl = CDN_URL + src;
      this.image.src = fullImageUrl;
      if (alt) {
        this.image.alt = alt;
      }
    }
  }

  setCategory(value: string): void {
    if (this.category) {
      this.category.textContent = value;
      this.category.className = 'card__category';
      if (value in categoryMap) {
        this.category.classList.add(categoryMap[value as keyof typeof categoryMap]);
      }
    }
  }

  setButtonLabel(label: string): void {
    if (this.button) {
      this.button.textContent = label;
    }
  }

  render(data: Partial<IProduct>): HTMLElement {
    if (data.title) this.setTitle(data.title);
    if (data.price !== undefined) this.setPrice(data.price);
    if (data.image) this.setImageSrc(data.image, data.title);
    if (data.category) this.setCategory(data.category);
    return this.container;
  }
}
