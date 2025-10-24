import { Form } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';
import { TPayment } from '../../types';
import { Buyer } from '../Models/Buyer';

export class PaymentForm extends Form {
  protected paymentOptions: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  private buyerModel: Buyer;

  constructor(container: HTMLFormElement, buyerModel: Buyer) {
    super(container);
    this.buyerModel = buyerModel;
    this.paymentOptions = ensureAllElements<HTMLButtonElement>('button[name]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.paymentOptions.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentOptions.forEach(btn => btn.classList.remove('button_alt-active'));
        button.classList.add('button_alt-active');
        this.container.dispatchEvent(new CustomEvent('payment:change', {
          detail: { payment: button.name as TPayment },
          bubbles: true
        }));
            setTimeout(() => this.updateButtonState(), 0);
      });
    });

    this.setupValidation();
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
    this.updateButtonState();
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    const selectedPayment = this.container.querySelector('button.button_alt-active') as HTMLButtonElement;
    if (selectedPayment) {
      this.buyerModel.set({ payment: selectedPayment.name as TPayment });
    }
    this.buyerModel.set({ address: this.addressInput.value });

    const validation = this.buyerModel.validate();

    if (validation.payment) {
      errors.payment = validation.payment;
    }
    if (validation.address) {
      errors.address = validation.address;
    }

    return errors;
  }

  private updateButtonState(): void {
    const errors = this.validate();
    const isValid = Object.keys(errors).length === 0;
    this.setButtonState(isValid);

    this.displayErrors(errors);
  }

  private displayErrors(errors: Record<string, string>): void {
    this.clearErrors();
    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.setErrorMessage('', firstError);
    }
  }

  private setupValidation(): void {
    this.addressInput.addEventListener('input', () => {
      this.updateButtonState();
    });
  }
}
