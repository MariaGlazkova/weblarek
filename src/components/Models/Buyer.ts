import {IBuyer, TPayment, IBuyerValidation} from '../../types/index.ts'

export class Buyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  set(data: Partial<IBuyer>): void {
    if (data.payment) {
      this.payment = data.payment;
    }
    if (data.email) {
      this.email = data.email;
    }
     if (data.phone) {
      this.phone = data.phone;
     }
     if (data.address) {
      this.address = data.address;
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
