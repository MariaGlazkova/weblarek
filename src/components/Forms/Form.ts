import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Form extends Component<HTMLFormElement> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  onSubmit(handler: (data: object) => void): void {
    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(this.container);
      const data = Object.fromEntries(formData.entries());
      handler(data);
    });
  }

  setErrorMessage(field: string, message: string): void {
    this.errorElement.textContent = message;
  }

  clearErrors(): void {
    this.errorElement.textContent = '';
  }

  render(): HTMLElement {
    return this.container;
  }
}
