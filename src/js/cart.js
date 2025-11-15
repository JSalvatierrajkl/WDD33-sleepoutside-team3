import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

// First load the header and footer, then show the cart items
async function initCart() {
  await loadHeaderFooter();
  renderCartContents();
}

function renderCartContents() {
  const rawStorage = localStorage.getItem("so-cart");
  console.log("Raw localStorage so-cart:", rawStorage);
  
  // Get all items from the cart
  let cartItems = getLocalStorage("so-cart");
  console.log("Parsed cart items:", cartItems);
  
  // Check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    console.log("Cart is empty");
    document.querySelector(".product-list").innerHTML = "<li>Your cart is empty</li>";
    return;
  }

  // Remove any bad items (null, empty, or missing ID/Name)
  cartItems = cartItems.filter(item => item && item.Id && item.Name);
  
  // If cart is empty after removing bad items, show empty message
  if (cartItems.length === 0) {
    console.log("Cart is empty after filtering null values");
    localStorage.setItem("so-cart", JSON.stringify([]));
    document.querySelector(".product-list").innerHTML = "<li>Your cart is empty</li>";
    return;
  }
  
  // Save the cleaned cart back to storage
  if (cartItems.length !== getLocalStorage("so-cart")?.length) {
    setLocalStorage("so-cart", cartItems);
    console.log("Cleaned cart: removed null/invalid items");
  }

  // Show all cart items on the page
  console.log("Rendering", cartItems.length, "cart items");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // Check if item is valid 
  if (!item || !item.Id || !item.Name) {
    console.warn("Invalid cart item:", item);
    return "";
  }
  
  const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "";
  const price = item.FinalPrice ? item.FinalPrice.toFixed(2) : "0.00";
  const productLink = `/product_pages/index.html?product=${item.Id}`;
  const imageSrc = item.Image || "/images/camping-products.jpg";
  const itemName = item.Name || "Unknown Product";
  
  const newItem = `<li class="cart-card divider">
  <a href="${productLink}" class="cart-card__image">
    <img
      src="${imageSrc}"
      alt="${itemName}"
    />
  </a>
  <a href="${productLink}">
    <h2 class="card__name">${itemName}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${price}</p>
</li>`;

  return newItem;
}

initCart();
