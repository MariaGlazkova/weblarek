import {IBuyer} from '../../types/index.ts'

export class Buyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor() {

  }

  set(data: Partial<IBuyer>): void {

  }

  setPayment(payment: TPayment | ''): void {

  }

  setEmail(email: string): void {

  }

  setPhone(phone: string): void {

  }

  setAddress(address: string): void {

  }

  get(): IBuyer {

  }

  clear(): void {

  }

  validate(): Partial<Record<keyof IBuyer, string>> {

  }
};
