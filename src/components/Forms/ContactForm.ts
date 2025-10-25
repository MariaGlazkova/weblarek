import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { Buyer } from '../Models/Buyer';

export class ContactForm extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  private buyerModel: Buyer;

  constructor(container: HTMLFormElement, buyerModel: Buyer) {
    super(container);
    this.buyerModel = buyerModel;
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.setupValidation();
    this.updateButtonState();
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
    this.updateButtonState();
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
    this.updateButtonState();
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.emailInput.value.trim()) {
      errors.email = 'Укажите емэйл';
    } else {
      this.buyerModel.set({ email: this.emailInput.value });
    }

    if (!this.phoneInput.value.trim()) {
      errors.phone = 'Укажите номер телефона';
    } else {
      this.buyerModel.set({ phone: this.phoneInput.value });
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
    const updateValidation = () => this.updateButtonState();

    this.emailInput.addEventListener('input', updateValidation);
    this.emailInput.addEventListener('change', updateValidation);
    this.emailInput.addEventListener('blur', updateValidation);

    this.phoneInput.addEventListener('input', updateValidation);
    this.phoneInput.addEventListener('change', updateValidation);
    this.phoneInput.addEventListener('blur', updateValidation);
  }
}
