import { IProduct } from '../../types/index.ts'

export class Products {
  items: IProduct[];
  selectedId: string | null = null;


  constructor(initialItems: IProduct[]) {
    this.items = initialItems;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItemById(id: string): IProduct | null {
    for (const item of this.items) {
      if (id === item.id)
        return item;
    }
    return null;
  }

  setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  getSelected(): IProduct | null {
    if (this.selectedId)
      return this.getItemById(this.selectedId);
    else return null;
  }
};


