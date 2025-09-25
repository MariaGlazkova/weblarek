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

const buyerModel = new Buyer();
