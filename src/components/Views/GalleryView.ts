import { Component } from '../base/Component';

export interface IGalleryData {
  items: HTMLElement[];
}

export class GalleryView extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = this.container;
  }

  setCatalog(items: HTMLElement[]): void {
    this.catalogElement.innerHTML = '';
    this.catalogElement.append(...items);
  }

  render(data: IGalleryData): HTMLElement {
    this.setCatalog(data.items);
    return this.container;
  }
}
