import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        productListing: resolve(__dirname, "src/product_listing/index.html"),
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    allowedHosts: [
      "wdd33-sleepoutside-team3.onrender.com",
      ".onrender.com",
      "localhost",
    ],
  },
});
