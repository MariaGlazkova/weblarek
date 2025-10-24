import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class ModalView extends Component<HTMLElement> {
  protected modalElement: HTMLElement;
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalElement = this.container;
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.close());
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.setContent(content);
    this.modalElement.classList.add('modal_active');
    document.body.classList.add('modal-open');
  }

  close(): void {
    this.modalElement.classList.remove('modal_active');
    document.body.classList.remove('modal-open');
  }

  setContent(content: HTMLElement): void {
    this.contentElement.innerHTML = '';
    this.contentElement.appendChild(content);
  }

  getContent(): HTMLElement {
    return this.contentElement;
  }

  render(): HTMLElement {
    return this.container;
  }
}
