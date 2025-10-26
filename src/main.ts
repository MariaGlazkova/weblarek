import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { Communication } from './components/Models/Communication';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, APP_EVENTS } from './components/base/Events';
import { apiProducts } from './utils/data';

import { HeaderView } from './components/Views/HeaderView';
import { GalleryView } from './components/Views/GalleryView';
import { BasketView } from './components/Views/BasketView';
import { ModalView } from './components/Views/ModalView';
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
let headerElement: HTMLElement;
let galleryElement: HTMLElement;
let modalElement: HTMLElement;
let headerView: HeaderView;
let galleryView: GalleryView;
let modalView: ModalView;
let paymentForm: PaymentForm;
let contactForm: ContactForm;

document.addEventListener('DOMContentLoaded', () => {
  headerElement = ensureElement<HTMLElement>('.header');
  galleryElement = ensureElement<HTMLElement>('.gallery');
  modalElement = ensureElement<HTMLElement>('#modal-container');

  headerView = new HeaderView(headerElement);
  galleryView = new GalleryView(galleryElement);
  modalView = new ModalView(modalElement);

  const paymentElement = cloneTemplate<HTMLElement>('#order');
  paymentForm = new PaymentForm(paymentElement as HTMLFormElement, buyerModel);

  const contactElement = cloneTemplate<HTMLElement>('#contacts');
  contactForm = new ContactForm(contactElement as HTMLFormElement, buyerModel);

  initializeEventHandlers();
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
    galleryView.setCatalog(cards);
  });

  productsModel.on(APP_EVENTS.PRODUCTS.SELECT, (data: { id: string | null }) => {
    if (data.id) {
      const product = productsModel.getItemById(data.id);
      if (product) {
        const cardElement = cloneTemplate<HTMLElement>('#card-preview');
        const cardView = new PreviewProductCard(cardElement, basketModel, productsModel, modalView);
        cardView.render(product);
        modalView.open(cardElement);
      }
    }
  });

  basketModel.on(APP_EVENTS.PRODUCTS.ADD, () => {
    updateBasketView();
    updateBasketModalContent();
    updateHeaderCounter();
  });

  basketModel.on(APP_EVENTS.PRODUCTS.REMOVE, () => {
    updateBasketView();
    updateBasketModalContent();
    updateHeaderCounter();
  });

  basketModel.on(APP_EVENTS.BASKET.CLEAR, () => {
    updateBasketView();
    updateBasketModalContent();
    updateHeaderCounter();
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

  const basketButton = ensureElement<HTMLElement>('.header__basket', headerElement);
  basketButton.addEventListener('click', () => {
    showBasketModal();
  });


  document.addEventListener('modal:close', () => {
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

  const basketElement = cloneTemplate<HTMLElement>('#basket');
  const basketView = new BasketView(basketElement, eventEmitter);
  basketView.render({
    items: cards,
    total: basketModel.getTotal(),
    buttonState: items.length > 0
  });

  return basketElement;
}

function updateBasketModalContent() {
  const basketElement = modalView.getContent().querySelector('.basket');
  if (basketElement) {
    const items = basketModel.getItems();
    const cards = items.map((item, index) => {
      const cardElement = cloneTemplate<HTMLElement>('#card-basket');
      const cardView = new BasketProductCard(cardElement, basketModel);
      cardView.render(item, index + 1);
      return cardElement;
    });

    const basketView = new BasketView(basketElement as HTMLElement, eventEmitter);
    basketView.render({
      items: cards,
      total: basketModel.getTotal(),
      buttonState: items.length > 0
    });
  }
}

function updateHeaderCounter() {
  headerView.setCounter(basketModel.getCount());
}

function showBasketModal() {
  const basketElement = updateBasketView();
  modalView.open(basketElement);
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
    if (Object.keys(errors).length === 0) {
      buyerModel.set({ address: formData.address });
      showContactForm();
    } else {
      Object.entries(errors).forEach(([field, message]) => {
        paymentForm.setErrorMessage(field, message);
      });
    }
  });

  modalView.open(paymentForm.getContainer());
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
    if (Object.keys(errors).length === 0) {
      buyerModel.set({ email: formData.email, phone: formData.phone });
      completeOrder();
    } else {
      Object.entries(errors).forEach(([field, message]) => {
        contactForm.setErrorMessage(field, message);
      });
    }
  });

  modalView.open(contactForm.getContainer());
}

function completeOrder() {
  const buyerData = buyerModel.get();
  const orderData = {
    ...buyerData,
    total: basketModel.getTotal(),
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
      contactForm.setErrorMessage('', 'Ошибка при отправке заказа. Попробуйте еще раз.');
    });
}

function showOrderSuccess(total: number) {
  const successElement = cloneTemplate<HTMLElement>('#success');
  const successView = new OrderSuccessView(successElement);
  successView.render({ total });

  const closeButton = ensureElement<HTMLElement>('.order-success__close', successElement);
  closeButton.addEventListener('click', () => {
    modalView.close();
  });

  modalView.open(successElement);
}

function loadProducts() {
  communication.fetchProducts()
    .then((items) => {
      productsModel.setItems(items);
    })
    .catch((error) => {
      console.error('Ошибка при запросе каталога:', error);
      productsModel.setItems(apiProducts.items);
    });
}
