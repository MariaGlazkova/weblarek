import {IBuyer, TPayment, IBuyerValidation} from '../../types/index.ts'
import { EventEmitter, APP_EVENTS } from '../base/Events'

export class Buyer extends EventEmitter {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor() {
    super();
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  set(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
      this.emit(APP_EVENTS.BUYER.PAYMENT_CHANGE, { payment: data.payment });
    }
    if (data.email !== undefined) {
      this.email = data.email;
      this.emit(APP_EVENTS.BUYER.EMAIL_CHANGE, { email: data.email });
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
      this.emit(APP_EVENTS.BUYER.PHONE_CHANGE, { phone: data.phone });
    }
    if (data.address !== undefined) {
      this.address = data.address;
      this.emit(APP_EVENTS.BUYER.ADDRESS_CHANGE, { address: data.address });
    }
  }

  get(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.emit('buyer:clear');
  }

  validate(): IBuyerValidation {
    const validateMessages: IBuyerValidation = {
      payment: null,
      email: null,
      phone: null,
      address: null
    };
    if (!this.payment)
      validateMessages.payment = 'Не выбран вид оплаты';
    if (!this.email)
      validateMessages.email = 'Укажите емэйл';
    if (!this.phone)
      validateMessages.phone = 'Укажите номер телефона';
    if (!this.address)
      validateMessages.address = 'Укажите адрес';
    return validateMessages;
  }
};
