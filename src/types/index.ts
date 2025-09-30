export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = "card" | "cash" | "";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
};

export interface IBuyer {
  email: string;
  phone: string;
  address: string;
  payment: TPayment;
};

export interface IBuyerValidation {
  email: string | null;
  phone: string | null;
  address: string | null;
  payment: string | null;
};


export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

