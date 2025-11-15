// Find an element on the page using a selector
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// Get data from browser storage
export function getLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
// Save data to browser storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// Add click listener for both touch and mouse clicks
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Get a parameter from the URL (like ?product=123)
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // If clear is true, remove everything inside the parent element first
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Get HTML content from a file
async function fetchTemplate(templatePath) {
  const response = await fetch(templatePath);
  const htmlContent = await response.text();
  return htmlContent;
}
// Load and show the header and footer on the page
export async function loadHeaderFooter() {
  // Get the header and footer HTML files
  const headerHtml = await fetchTemplate("/partials/header.html");
  const footerHtml = await fetchTemplate("/partials/footer.html");

  // Find where to put the header and footer
  const headerContainer = document.querySelector("#main-header");
  const footerContainer = document.querySelector("#main-footer");
  // Put the header and footer HTML on the page
  renderWithTemplate(headerHtml, headerContainer);
  renderWithTemplate(footerHtml, footerContainer);
}


