import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkoutOrder = new CheckoutProcess("so-cart", ".checkout-summary");
checkoutOrder.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
  .querySelector("#zip")
  .addEventListener("blur", checkoutOrder.calculateOrderTotal.bind(checkoutOrder));

// listening for click on the button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  // Get the form and validate it
  const checkoutForm = document.forms["checkout"];
  const isValid = checkoutForm.checkValidity();
  checkoutForm.reportValidity();

  if (isValid) {
    checkoutOrder.checkout().catch((err) => {
      // Handle error
      let errorMsg = "There was an error processing your order. Please try again.";
      
      if (err.name === 'servicesError' && err.message) {
        // Extract error message from server response
        if (err.message.error) {
          errorMsg = err.message.error;
        } else if (typeof err.message === 'string') {
          errorMsg = err.message;
        } else if (err.message.message) {
          errorMsg = err.message.message;
        }
      }
      
      alertMessage(errorMsg, true);
    });
  }
});
