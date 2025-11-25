import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<li>Your cart is empty</li>";
    document.querySelector(".list-footer").classList.add("hide");
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll(".cart-card__remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = button.dataset.id;
      removeFromCart(productId);
    });
  });
  
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

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Filter out the item with the matching ID
  cartItems = cartItems.filter((item) => item.Id !== productId);
  
  // Update localStorage
  setLocalStorage("so-cart", cartItems);
  
  // Re-render the cart
  renderCartContents();
}

function cartItemTemplate(item) {
  // Crear el enlace correcto a la página del producto
  const productLink = `../product_pages/index.html?product=${item.Id}`;
  
  const newItem = `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart" type="button" title="Remove item">&times;</button>
  <a href="${productLink}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
   >
  </a>
  <a href="${productLink}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
