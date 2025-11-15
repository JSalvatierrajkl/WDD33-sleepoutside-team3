import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// Get category from URL parameter
const category = getParam('category');

// Create an instance of the ProductData class
const dataSource = new ProductData();

// Get the element where the product list will be rendered
const listElement = document.querySelector('.product-list');

// Create an instance of the ProductList class with the category, dataSource, and listElement
const myList = new ProductList(category, dataSource, listElement);

// Call the init method to show the products
myList.init();

