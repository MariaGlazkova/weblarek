import { IApi, IProduct, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types/index.ts';

export class Communication {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductListResponse>('/product/');
    return data.items;
  }

  createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', payload);
  }
}


