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

    // Обновляем данные в модели перед валидацией
    this.buyerModel.set({
      email: this.emailInput.value,
      phone: this.phoneInput.value
    });

    // Используем валидацию из модели Buyer
    const validation = this.buyerModel.validate();

    if (validation.email) {
      errors.email = validation.email;
    }
    if (validation.phone) {
      errors.phone = validation.phone;
    }

    return errors;
  }


  private updateButtonState(): void {
    const errors = this.validate();
    const isValid = Object.keys(errors).length === 0;
    this.setButtonState(isValid);

    // Показываем ошибки в реальном времени
    this.displayErrors(errors);
  }

  private displayErrors(errors: Record<string, string>): void {
    // Очищаем предыдущие ошибки
    this.clearErrors();

    // Показываем первую ошибку
    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.setErrorMessage('', firstError);
    }
  }

  private setupValidation(): void {
    // Обновляем состояние кнопки при изменении email
    this.emailInput.addEventListener('input', () => {
      this.updateButtonState();
    });

    // Обновляем состояние кнопки при изменении телефона
    this.phoneInput.addEventListener('input', () => {
      this.updateButtonState();
    });
  }
}
