import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

async function initProductPage() {
  // Load header and footer first
  await loadHeaderFooter();
  // Get product data and ID from URL
  const dataSource = new ProductData("tents");
  const productID = getParam("product");
  // Check if there is a product ID in the URL
  if (!productID) {
    console.error("No product ID found in URL. Expected format: product_pages/index.html?product=ID");
    document.querySelector("main").innerHTML = `
      <section class="product-detail">
        <h2>Product Not Found</h2>
        <p>No product ID was provided in the URL. Please select a product from the <a href="/index.html">home page</a>.</p>
      </section>
    `;
    return;
  }
  // Create product details
  const product = new ProductDetails(productID, dataSource);
  product.init();
}

initProductPage();
