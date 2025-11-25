import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const productCategory = getParam("category");
const productDataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const productListing = new ProductList(productCategory, productDataSource, listElement);

productListing.init();
