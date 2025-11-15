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
    // this.category = category;
    // this.path = `../public/json/${this.category}.json`;
  }
  async getData(category) {
    const url = `${baseURL}products/search/${category}`;
    console.log("Fetching from:", url);
    const response = await fetch(url);
    const data = await convertToJson(response);
    
    return data.Result;
  }
  async findProductById(id) {
    const url = `${baseURL}product/${id}`;
    console.log("Fetching product from:", url);
    const response = await fetch(url);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }
}
