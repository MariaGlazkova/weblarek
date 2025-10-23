import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

export class ContactForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.emailInput.value.trim()) {
      errors.email = 'Введите email';
    } else if (!this.isValidEmail(this.emailInput.value)) {
      errors.email = 'Введите корректный email';
    }

    if (!this.phoneInput.value.trim()) {
      errors.phone = 'Введите номер телефона';
    } else if (!this.isValidPhone(this.phoneInput.value)) {
      errors.phone = 'Введите корректный номер телефона';
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
}
