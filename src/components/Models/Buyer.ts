import {IBuyer, TPayment, IBuyerValidation} from '../../types/index.ts'

export class Buyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor(data: IBuyer) {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
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

  setPayment(payment: TPayment | ''): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
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
    let validateMessages: IBuyerValidation = {
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
