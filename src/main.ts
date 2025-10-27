import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { Communication } from './components/Models/Communication';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, APP_EVENTS } from './components/base/Events';

import { Page } from './components/Views/Page';
import { BasketView } from './components/Views/BasketView';
import { OrderSuccessView } from './components/Views/OrderSuccessView';
import { CatalogProductCard } from './components/Views/CatalogProductCard';
import { PreviewProductCard } from './components/Views/PreviewProductCard';
import { BasketProductCard } from './components/Views/BasketProductCard';

import { PaymentForm } from './components/Forms/PaymentForm';
import { ContactForm } from './components/Forms/ContactForm';

const productsModel = new Products([]);
const basketModel = new Basket();
const buyerModel = new Buyer();
const eventEmitter = new EventEmitter();

const api = new Api(API_URL);
const communication = new Communication(api);

let page: Page;
let modalView: any;
let paymentForm: PaymentForm;
let contactForm: ContactForm;
let basketView: BasketView;
let orderSuccessView: OrderSuccessView;

const paymentElement = cloneTemplate<HTMLElement>('#order');
const contactElement = cloneTemplate<HTMLElement>('#contacts');
const basketElement = cloneTemplate<HTMLElement>('#basket');
const successElement = cloneTemplate<HTMLElement>('#success');
const previewCardElement = cloneTemplate<HTMLElement>('#card-preview');

const initApp = () => {
  const container = ensureElement<HTMLElement>('.page');
  page = new Page(container, eventEmitter);
  modalView = page.getModal();

  paymentForm = new PaymentForm(paymentElement as HTMLFormElement, buyerModel);
  contactForm = new ContactForm(contactElement as HTMLFormElement, buyerModel);
  basketView = new BasketView(basketElement, eventEmitter);
  orderSuccessView = new OrderSuccessView(successElement, eventEmitter);

  initializeEventHandlers();
};

document.addEventListener('DOMContentLoaded', () => {
  eventEmitter.emit(APP_EVENTS.DOM_CONTENT_LOADED, {});
});

eventEmitter.on(APP_EVENTS.DOM_CONTENT_LOADED, () => {
  initApp();
});

function initializeEventHandlers() {
  productsModel.on(APP_EVENTS.PRODUCTS.ITEMS_CHANGED, () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
      const cardElement = cloneTemplate<HTMLElement>('#card-catalog');
      const cardView = new CatalogProductCard(cardElement, productsModel);
      cardView.render(item);
      return cardElement;
    });
    page.setGallery(cards);
  });

  productsModel.on(APP_EVENTS.PRODUCTS.SELECT, (data: { id: string | null }) => {
    if (data.id) {
      const product = productsModel.getItemById(data.id);
      if (product) {
        const cardElement = previewCardElement.cloneNode(true) as HTMLElement;
        const cardView = new PreviewProductCard(cardElement, basketModel, productsModel, modalView);
        cardView.render(product);
        modalView.open(cardElement);
      }
    }
  });

  basketModel.on(APP_EVENTS.PRODUCTS.ADD, () => {
    updateBasketView();
    page.setCounter(basketModel.getCount());
  });

  basketModel.on(APP_EVENTS.PRODUCTS.REMOVE, () => {
    updateBasketView();
    page.setCounter(basketModel.getCount());
  });

  basketModel.on(APP_EVENTS.BASKET.CLEAR, () => {
    updateBasketView();
    page.setCounter(basketModel.getCount());
  });

  buyerModel.on(APP_EVENTS.BUYER.PAYMENT_CHANGE, () => {
  });

  buyerModel.on(APP_EVENTS.BUYER.ADDRESS_CHANGE, () => {
  });

  buyerModel.on(APP_EVENTS.BUYER.EMAIL_CHANGE, () => {
  });

  buyerModel.on(APP_EVENTS.BUYER.PHONE_CHANGE, () => {
  });

  eventEmitter.on(APP_EVENTS.BASKET.ORDER, () => {
    showPaymentForm();
  });

  eventEmitter.on(APP_EVENTS.BASKET.OPEN, () => {
    showBasketModal();
  });

  eventEmitter.on(APP_EVENTS.MODAL.CLOSE, () => {
    modalView.close();
  });

  loadProducts();
}


function updateBasketView() {
  const items = basketModel.getItems();
  const cards = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>('#card-basket');
    const cardView = new BasketProductCard(cardElement, basketModel);
    cardView.render(item, index + 1);
    return cardElement;
  });

  basketView.render({
    items: cards,
    total: basketModel.getTotal(),
    buttonState: items.length > 0
  });
}

function showBasketModal() {
  updateBasketView();
  modalView.open(basketView.render());
}

function showPaymentForm() {
  const buyerData = buyerModel.get();
  if (buyerData.payment) {
    paymentForm.setPayment(buyerData.payment);
  }
  if (buyerData.address) {
    paymentForm.setAddress(buyerData.address);
  }

  paymentForm.onSubmit((data: object) => {
    const formData = data as Record<string, string>;
    const errors = paymentForm.validate();
    if (!errors.payment && !errors.address) {
      buyerModel.set({ address: formData.address });
      showContactForm();
    } else {
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          paymentForm.setErrorMessage(field, message);
        }
      });
    }
  });

  modalView.open(paymentForm.render());
}

function showContactForm() {
  const buyerData = buyerModel.get();
  if (buyerData.email) {
    contactForm.setEmail(buyerData.email);
  }
  if (buyerData.phone) {
    contactForm.setPhone(buyerData.phone);
  }

  contactForm.onSubmit((data: object) => {
    const formData = data as Record<string, string>;
    const errors = contactForm.validate();
    if (!errors.email && !errors.phone) {
      buyerModel.set({ email: formData.email, phone: formData.phone });
      completeOrder();
    } else {
      Object.entries(errors).forEach(([field, message]) => {
        if (message) {
          contactForm.setErrorMessage(field, message);
        }
      });
    }
  });

  modalView.open(contactForm.render());
}

function completeOrder() {
  const buyerData = buyerModel.get();
  const orderTotal = basketModel.getTotal();
  const orderData = {
    ...buyerData,
    total: orderTotal,
    items: basketModel.getItems().map(item => item.id)
  };

  communication.createOrder(orderData)
    .then((response) => {
      showOrderSuccess(response.total);
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error) => {
      console.error('Ошибка при создании заказа:', error);
      showOrderSuccess(orderTotal);
      basketModel.clear();
      buyerModel.clear();
    });
}

function showOrderSuccess(total: number) {
  const successElement = orderSuccessView.render({ total });
  modalView.open(successElement);
}

function loadProducts() {
  communication.fetchProducts()
    .then((items) => {
      productsModel.setItems(items);
    })
    .catch((error) => {
      console.error('Ошибка при запросе каталога:', error);
    });
}
