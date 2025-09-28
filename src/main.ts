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


const buyerModel = new Buyer();
