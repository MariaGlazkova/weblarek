import { Component } from '../base/Component';
import { EventEmitter, APP_EVENTS } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { GalleryView } from './GalleryView';
import { HeaderView } from './HeaderView';
import { ModalView } from './ModalView';

export class Page extends Component<HTMLElement> {
  protected eventEmitter: EventEmitter;
  protected galleryView: GalleryView;
  protected headerView: HeaderView;
  protected modalView: ModalView;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;

    const galleryElement = ensureElement<HTMLElement>('.gallery', this.container);
    this.galleryView = new GalleryView(galleryElement);

    const headerElement = ensureElement<HTMLElement>('.header', this.container);
    this.headerView = new HeaderView(headerElement);

    const modalElement = ensureElement<HTMLElement>('#modal-container', this.container);
    this.modalView = new ModalView(modalElement);

    const basketButton = ensureElement<HTMLElement>('.header__basket', headerElement);
    basketButton.addEventListener('click', () => {
      this.eventEmitter.emit(APP_EVENTS.BASKET.OPEN, {});
    });
  }

  setGallery(items: HTMLElement[]): void {
    this.galleryView.render({ items });
  }

  setCounter(value: number): void {
    this.headerView.render({ counter: value });
  }

  getModal(): ModalView {
    return this.modalView;
  }

  render(): HTMLElement {
    return this.container as HTMLElement;
  }
}

