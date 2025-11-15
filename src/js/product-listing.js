import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const productCategory = getParam("category");
const productDataSource = new ProductData();
const listElement = document.querySelector(".product-list");
const productListing = new ProductList(productCategory, productDataSource, listElement);

productListing.init();
