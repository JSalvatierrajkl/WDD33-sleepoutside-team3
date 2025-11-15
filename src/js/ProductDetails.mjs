import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // Check if we have a product ID
    if (!this.productId) {
      console.error("Product ID is null or undefined");
      return;
    }
    // Get the product information from the data source
    this.product = await this.dataSource.findProductById(this.productId);
    // Show error message
    if (!this.product) {
      console.error("Product not found for ID:", this.productId);
      document.querySelector("main").innerHTML = `
        <section class="product-detail">
          <h2>Product Not Found</h2>
          <p>Sorry, we couldn't find a product with ID: ${this.productId}</p>
          <p><a href="/index.html">Return to home page</a></p>
        </section>
      `;
      return;
    }
    // Show the product details on the page
    this.renderProductDetails();
    // "Add to Cart" button
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
      console.log("Add to Cart button listener attached");
    } else {
      console.error("Add to Cart button not found");
    }
  }

  addProductToCart(e) {
    // Stop the button from doing its default action
    e.preventDefault();
    e.stopPropagation();
    // Check if product is valid before adding to cart
    if (!this.product || !this.product.Id) {
      console.error("Cannot add invalid product to cart:", this.product);
      alert("Error: Product information is invalid. Please try again.");
      return;
    }
    // Get all items currently in the cart
    let cartItems = getLocalStorage("so-cart");
    // If cart is empty
    if (!cartItems) {
      cartItems = [];
    }
    // Remove any bad items from the cart
    cartItems = cartItems.filter(item => item && item.Id && item.Name);
    // Add this product to the cart
    cartItems.push(this.product);
    // Save the updated cart to storage
    setLocalStorage("so-cart", cartItems);
    console.log("Product added to cart:", this.product.Name);
    console.log("Cart items:", cartItems);
    console.log("LocalStorage so-cart:", localStorage.getItem("so-cart"));
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;
  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;
  document.getElementById("productPrice").textContent = `$${product.FinalPrice.toFixed(2)}`;
  // Show the product color 
  if (product.Colors && product.Colors.length > 0) {
    document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  } else {
    document.getElementById("productColor").textContent = "";
  }
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple || "";
  const addToCartButton = document.getElementById("addToCart");
  addToCartButton.dataset.id = product.Id;
  addToCartButton.type = "button";
}
