import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

async function initCheckout() {
  await loadHeaderFooter();
  
  const checkoutProcess = new CheckoutProcess("so-cart", ".checkout-summary");
  checkoutProcess.init();
  
  // Handle form submission
  const checkoutForm = document.forms.checkout;
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if all fields are filled
      const formData = new FormData(checkoutForm);
      let allFieldsFilled = true;
      
      for (const [key, value] of formData.entries()) {
        if (!value || value.trim() === "") {
          allFieldsFilled = false;
          break;
        }
      }
      
      if (!allFieldsFilled) {
        alert("Please fill out all fields before submitting.");
        return;
      }
      
      // Make sure order total is calculated
      if (checkoutProcess.orderTotal === 0) {
        checkoutProcess.calculateOrderTotal();
      }
      
      try {
        const result = await checkoutProcess.checkout(checkoutForm);
        console.log("Order submitted successfully:", result);
        // TODO: Handle success response (next activity)
      } catch (error) {
        console.error("Error submitting order:", error);
        alert("There was an error processing your order. Please try again.");
      }
    });
  }
}

initCheckout();
