import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

async function initCart() {
  await loadHeaderFooter();
  renderCartContents();
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<li>Your cart is empty</li>";
    document.querySelector(".list-footer").classList.add("hide");
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  // Calculate and display total
  const total = calculateCartTotal(cartItems);
  document.querySelector(".list-total").textContent = `$${total.toFixed(2)}`;
  document.querySelector(".list-footer").classList.remove("hide");
}

function calculateCartTotal(cartItems) {
  if (!cartItems || cartItems.length === 0) {
    return 0;
  }
  
  return cartItems.reduce((sum, item) => {
    const price = parseFloat(item.FinalPrice) || 0;
    return sum + price;
  }, 0);
}

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "/images/camping-products.jpg";
  const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : "";
  const productLink = `/product_pages/?product=${item.Id}`;
  
  const newItem = `<li class="cart-card divider">
  <a href="${productLink}" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productLink}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

initCart();
