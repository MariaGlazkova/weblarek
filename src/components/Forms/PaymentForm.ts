import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

export class PaymentForm extends Form {
  protected paymentOptions: NodeListOf<HTMLInputElement>;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.paymentOptions = this.container.querySelectorAll('button[name]') as NodeListOf<HTMLInputElement>;
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentOptions.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentOptions.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.container.dispatchEvent(new CustomEvent('payment:change', {
          detail: { payment: button.name as TPayment },
          bubbles: true
        }));
      });
    });
  }

  setPayment(value: TPayment): void {
    this.paymentOptions.forEach(button => {
      button.classList.remove('button_alt-active');
      if (button.name === value) {
        button.classList.add('button_alt-active');
      }
    });
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    const selectedPayment = this.container.querySelector('button.button_alt-active');
    if (!selectedPayment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.addressInput.value.trim()) {
      errors.address = 'Введите адрес доставки';
    }

    return errors;
  }
}
