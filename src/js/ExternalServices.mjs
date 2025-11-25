const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  // Convert response to JSON first
  const contentType = res.headers.get("content-type");
  let jsonResponse;
  
  if (contentType && contentType.includes("application/json")) {
    jsonResponse = await res.json();
  } else {
    const text = await res.text();
    throw { name: 'servicesError', message: { error: "Response is not JSON. Server may be returning HTML." } };
  }
  
  // Check if response is ok after converting to JSON
  if (res.ok) {
    return jsonResponse;
  } else {
    // Throw custom error object with the response body
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // this.category = category;
    // this.path = `../public/json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    // console.log(data.Result);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}
