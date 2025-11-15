import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Use PrimaryMedium image from API, with fallback
  const imageUrl = product.Images?.PrimaryMedium || product.Image || "/images/camping-products.jpg";
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${imageUrl}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
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
    try {
      const productList = await this.dataSource.getData(this.category);
      if (productList && productList.length > 0) {
        this.renderList(productList);
      } else {
        this.listElement.innerHTML = "<li>No products found for this category.</li>";
      }
      const titleElement = document.querySelector(".title");
      if (titleElement) {
        const categoryName = this.category.charAt(0).toUpperCase() + this.category.slice(1).replace('-', ' ');
        titleElement.textContent = categoryName;
      }
    } catch (error) {
      console.error("Error loading products:", error);
      this.listElement.innerHTML = `<li>Error loading products: ${error.message}</li>`;
    }
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}