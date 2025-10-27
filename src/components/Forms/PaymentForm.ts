import { Form } from './Form';
import { ensureElement, ensureAllElements } from '../../utils/utils';
import { TPayment } from '../../types';
import { Buyer } from '../Models/Buyer';
import { IBuyerValidation } from '../../types';

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
        this.buyerModel.set({ payment: button.name as TPayment });
        this.updateButtonState();
      });
    });

    this.setupValidation();
    this.updateButtonState();
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
    this.buyerModel.set({ address: value });
    this.updateButtonState();
  }

  validate(): IBuyerValidation {
    try {
      const selectedPayment = ensureElement<HTMLButtonElement>('button.button_alt-active', this.container);
      this.buyerModel.set({ payment: selectedPayment.name as TPayment });
    } catch {
      this.buyerModel.set({ payment: '' });
    }

    this.buyerModel.set({ address: this.addressInput.value });

    return this.buyerModel.validate();
  }

  private updateButtonState(): void {
    const errors = this.validate();
    const hasErrors = errors.payment || errors.address;
    this.setButtonState(!hasErrors);

    this.displayErrors(errors);
  }

  private displayErrors(errors: IBuyerValidation): void {
    this.clearErrors();
    const firstError = errors.payment || errors.address;
    if (firstError) {
      this.setErrorMessage('', firstError);
    }
  }

  private setupValidation(): void {
    this.addressInput.addEventListener('input', () => this.updateButtonState());
    this.addressInput.addEventListener('change', () => this.updateButtonState());
    this.addressInput.addEventListener('blur', () => this.updateButtonState());
  }
}
