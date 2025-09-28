import { IProduct } from '../../types/index.ts'

export class Basket {
  items: IProduct[];

  constructor(initialItems: IProduct[] = []) {
    this.items = initialItems;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  add(item: IProduct): void {
    this.items.push(item);
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id != id);

  }

  clear(): void {
    this.items = [];
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
