import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { Buyer } from '../Models/Buyer';
import { IBuyerValidation } from '../../types';

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
    this.buyerModel.set({ email: value });
    this.updateButtonState();
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
    this.buyerModel.set({ phone: value });
    this.updateButtonState();
  }

  validate(): IBuyerValidation {
    this.buyerModel.set({
      email: this.emailInput.value,
      phone: this.phoneInput.value
    });

    return this.buyerModel.validate();
  }


  private updateButtonState(): void {
    const errors = this.validate();
    const hasErrors = errors.email || errors.phone;
    this.setButtonState(!hasErrors);

    this.displayErrors(errors);
  }

  private displayErrors(errors: IBuyerValidation): void {
    this.clearErrors();
    const firstError = errors.email || errors.phone;
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
