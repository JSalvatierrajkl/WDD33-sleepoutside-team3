const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  if (res.ok) {
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Response is not JSON. Content:", text.substring(0, 200));
      throw new Error("Response is not JSON. Server may be returning HTML.");
    }
    return res.json();
  } else {
    const text = await res.text();
    console.error("Bad Response:", res.status, text.substring(0, 200));
    throw new Error(`Bad Response: ${res.status}`);
  }
}

export default class ProductData {
  constructor() {
    // No category or path needed - category will be passed when needed
  }
  
  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Base URL:", baseURL);
      throw error;
    }
  }
  
  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error("Error fetching product:", error);
      console.error("Base URL:", baseURL);
      throw error;
    }
  }
}
