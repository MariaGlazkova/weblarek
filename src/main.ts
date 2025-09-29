import './scss/styles.scss';
import { Products } from './components/Models/Products.ts';
import { Basket } from './components/Models/Basket.ts';
import { Buyer } from './components/Models/Buyer.ts';
import { apiProducts } from './utils/data.ts';

const productsModel = new Products([]);

productsModel.setItems(apiProducts.items);

console.log('Массив товаров из каталога: ', productsModel.getItems());

const id = apiProducts.items[0].id;
console.log(`Товар по id (${id}): `, productsModel.getItemById(id));

productsModel.setSelectedId(id);
console.log('Выбранный товар из каталога: ', productsModel.getSelected());


const basketModel = new Basket();

console.log('Mассив товаров в пустой корзине: ', basketModel.getItems());
console.log('Количество товаров в пустой корзине: ', basketModel.getCount());
console.log('Общая стоимость товаров в пустой корзине: ', basketModel.getTotal());

basketModel.add(apiProducts.items[0]);
basketModel.add(apiProducts.items[2]);

console.log('Mассив товаров в корзине: ', basketModel.getItems());
console.log('Количество товаров в корзине: ', basketModel.getCount());
console.log('Общая стоимость товаров в корзине: ', basketModel.getTotal());
console.log('Наличие 0ого товара в корзине: ', basketModel.has(apiProducts.items[0].id));
console.log('Наличие 1ого товара в корзине: ', basketModel.has(apiProducts.items[1].id));

basketModel.remove(apiProducts.items[2].id);
console.log('Mассив товаров в корзине после удаления: ', basketModel.getItems());
console.log('Количество товаров в корзине после удаления: ', basketModel.getCount());

basketModel.clear();
console.log('Mассив товаров в корзине после очистки: ', basketModel.getItems());
console.log('Количество товаров в корзине после очистки: ', basketModel.getCount());


const buyerModel = new Buyer({
      payment: '',
      email: '',
      phone: '',
      address: '',
});

console.log('Проверка валидации при пустых полях: ', buyerModel.validate());
buyerModel.setPayment('card');
console.log('После выбора оплаты (card): ', buyerModel.validate());

buyerModel.setEmail('user@example.com');
console.log('После заполнения email: ', buyerModel.validate());

buyerModel.setPhone('+7 111 111-11-11');
console.log('После заполнения телефона: ', buyerModel.validate());

buyerModel.setAddress('г. Москва, ул. Практикума, д. 1');
console.log('После заполнения адреса (все поля валидны): ', buyerModel.validate());
console.log('Текущие данные покупателя через get(): ', buyerModel.get());

buyerModel.clear();
console.log('После clear() (все поля пусты): ', buyerModel.get());
console.log('валидация после clear(): ', buyerModel.validate());

buyerModel.set({ payment: 'cash', email: 'cash@example.com' });
console.log('После частичного set(payment=cash, email): ', buyerModel.get());
console.log('Валидация после частичного set(payment=cash, email)', buyerModel.validate());

buyerModel.set({ phone: '+7 111 000-00-00', address: 'Санкт-Петербург, Невский пр., 10' });
console.log('После полного заполнения через set(): ', buyerModel.get());
console.log('Валидация после заполнения через set(): ', buyerModel.validate());
