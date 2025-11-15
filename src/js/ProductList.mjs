import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Use PrimaryMedium image from API
  const imageUrl = product.PrimaryMedium || product.Image || "/images/camping-products.jpg";
  return `
    <li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img src="${imageUrl}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }
  async init() {
    // Pass category to getData method
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    
    // Update the page title with the category name
    const titleElement = document.querySelector('.product-category-title');
    if (titleElement) {
      const categoryName = this.category.charAt(0).toUpperCase() + this.category.slice(1).replace('-', ' ');
      titleElement.textContent = `Top Products: ${categoryName}`;
    }
  }
  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}