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

  }

  remove(id: string): void {

  }

  clear(): void {

  }

  getTotal(): number {

  }

  getCount(): number {

  }

  has(id: string): boolean {

  }
};
