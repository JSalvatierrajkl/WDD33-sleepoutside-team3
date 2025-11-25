import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSubTotal();
    
    // Listen for zip code input to calculate order total
    const zipInput = document.querySelector("#zip");
    if (zipInput) {
      zipInput.addEventListener("blur", () => {
        if (zipInput.value.trim() !== "") {
          this.calculateOrderTotal();
        }
      });
    }
  }

  calculateItemSubTotal() {
    // Calculate the total dollar amount of the items in the cart, and the number of items
    if (!this.list || this.list.length === 0) {
      this.itemTotal = 0;
      this.displayItemSummary();
      return;
    }

    this.itemTotal = this.list.reduce((sum, item) => {
      const price = parseFloat(item.FinalPrice) || 0;
      return sum + price;
    }, 0);

    this.displayItemSummary();
  }

  displayItemSummary() {
    // Display the number of items and subtotal
    const numberItemsEl = document.querySelector(`${this.outputSelector} #numberItems`);
    const cartTotalEl = document.querySelector(`${this.outputSelector} #cartTotal`);
    
    if (numberItemsEl) {
      numberItemsEl.textContent = this.list ? this.list.length : 0;
    }
    
    if (cartTotalEl) {
      cartTotalEl.textContent = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    // Calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06; // 6% sales tax
    
    // Shipping: $10 for first item + $2 for each additional item
    if (this.list && this.list.length > 0) {
      this.shipping = 10 + (this.list.length - 1) * 2;
    } else {
      this.shipping = 0;
    }
    
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display the totals
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // Once the totals are all calculated, display them in the order summary page
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #total`);

    if (taxEl) {
      taxEl.textContent = `$${this.tax.toFixed(2)}`;
    }
    
    if (shippingEl) {
      shippingEl.textContent = `$${this.shipping.toFixed(2)}`;
    }
    
    if (totalEl) {
      totalEl.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
  }

  // Takes the items currently stored in the cart (localStorage) and returns them in a simplified form
  packageItems(items) {
    // Convert the list of products from localStorage to the simpler form required for the checkout process
    if (!items || items.length === 0) {
      return [];
    }

    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: parseFloat(item.FinalPrice) || 0,
      quantity: 1
    }));
  }

  // Takes a form element and returns an object where the key is the "name" of the form input
  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach(function (value, key) {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }

  async checkout(form) {
    // Get the form element data by the form name
    // Convert the form data to a JSON order object using the formDataToJSON function
    const formData = this.formDataToJSON(form);
    
    // Populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: this.packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping.toFixed(2),
      tax: this.tax.toFixed(2)
    };

    // Call the checkout method in the ExternalServices module and send it the JSON order data
    const { default: ExternalServices } = await import("./ExternalServices.mjs");
    const services = new ExternalServices();
    return await services.checkout(orderData);
  }
}

