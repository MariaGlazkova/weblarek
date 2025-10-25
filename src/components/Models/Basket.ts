import { IProduct } from '../../types/index.ts'
import { EventEmitter, APP_EVENTS } from '../base/Events'

export class Basket extends EventEmitter {
  items: IProduct[];

  constructor(initialItems: IProduct[] = []) {
    super();
    this.items = initialItems;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  add(item: IProduct): void {
    this.items.push(item);
    this.emit(APP_EVENTS.PRODUCTS.ADD, { item });
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id != id);
    this.emit(APP_EVENTS.PRODUCTS.REMOVE, { id });
  }

  clear(): void {
    this.items = [];
    this.emit(APP_EVENTS.BASKET.CLEAR);
  }

  getTotal(): number {
    let sum = 0;
    for (const item of this.items) {
      if (item.price)
        sum += item.price;
    }
    return sum;
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    for (const item of this.items) {
      if (item.id === id)
        return true;
    }
    return false;
  }
};
